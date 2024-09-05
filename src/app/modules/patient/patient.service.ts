import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import PatientModel from "./patient.model";
import { TPatient } from "./patient.interface";
import { TUser } from "../user/user.interface";
import { BloodPressureModel } from "../bloodPressure/bloodPressure.model";
import { GlucoseModel } from "../glucose/glucose.model";
import { WeightModel } from "../weight/weight.model";
import { HealthRecordModel } from "../healthRecord/healthRecord.model";
import mongoose from "mongoose";

const getAllPatientsFromDb = async(query: Record<string, unknown>) => {
    const patientQuery = new QueryBuilder(PatientModel.find().populate({path:"user"}),query).search(["dateOfBirth","bloodGroup"]).filter().sort().paginate().fields();
    const meta = await patientQuery.countTotal();
    const patients = await patientQuery.modelQuery;
    return { meta, patients };
}

const getSinglePatientFromDb = async(slug:string, query: Record<string, unknown>) => {
  const userData = await UserModel.findOne({ slug: slug }).lean();
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (!userData.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
  }
  if (userData.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
  }
  if (!userData.validation?.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
  }


  let fields = query.fields ? (query.fields as string).replace(",", " ") : "-__v";
    const patient = await PatientModel.findOne({slug}).populate("user").select(fields).lean();
    const bloodPressure = await BloodPressureModel.find({user:userData?._id});
    const glucose = await GlucoseModel.find({user:userData?._id});
    const weight = await WeightModel.find({user:userData?._id});
    const healthRecord = await HealthRecordModel.find({user:userData?._id});

    return {
      ...patient,
      bloodPressure,
      glucose,
      weight,
      healthRecord
    }
}

const getPatientProfileFromDb = async(user:TTokenUser) => {
    const userData = await UserModel.findOne({email:user.email})
    const patientData = await PatientModel.findOne({user:userData?._id}).populate("user");
    console.log(userData,patientData)
    return patientData
}

const updatePatientProfileIntoDb = async(user:TTokenUser,payload:Partial<TPatient> & Partial<TUser>) => {
    const userData = await UserModel.findOne({user:user._id});
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
      }
      if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
      }
      if (!userData.validation?.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
      }
        const result = await PatientModel.findOneAndUpdate({user:userData._id},payload,{new:true,runValidators:true});
    return result  
}

const patientActionForAdmin = async(slug:string,payload:{isDelete?:boolean,isActive?:boolean}) => {
  const updatedData:Record<string,unknown> = {}
  if (payload.isActive !== undefined) updatedData.isActive = payload.isActive
  if (payload.isDelete !== undefined) updatedData.isDelete = payload.isDelete

    const userData = await UserModel.findOne({slug:slug});
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        await UserModel.findOneAndUpdate({slug:slug},updatedData,{session});
        await PatientModel.findOneAndUpdate({user:userData._id},updatedData,{session});
        await session.commitTransaction();
        session.endSession();
        return null
      } catch (error:any) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message);
      }
}


const deleteMyAccountFromDb = async(user:TTokenUser) => {
    const userData = await UserModel.findOne({user:user._id});
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
      }
      if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is already Deleted");
      }
      if (!userData.validation?.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
      }
      const result = await UserModel.findOneAndUpdate({_id:userData._id,role:user.role},{isDelete:true},{new:true,runValidators:true});
      console.log(result,"result")
    return result  
}

export const PatientServices = {
    getAllPatientsFromDb,
    getSinglePatientFromDb,
    getPatientProfileFromDb,
    updatePatientProfileIntoDb,
    deleteMyAccountFromDb,
    patientActionForAdmin
}