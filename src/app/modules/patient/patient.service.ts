import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import PatientModel from "./patient.model";
import { TPatient } from "./patient.interface";
import { TUser } from "../user/user.interface";

const getAllPatientsFromDb = async(query: Record<string, unknown>) => {
    const patientQuery = new QueryBuilder(PatientModel.find({isDelete:false,isActive:true}).populate("user"),query).search(["name"]).filter().sort().paginate().fields();
    const meta = await patientQuery.countTotal();
    const patients = await patientQuery.modelQuery;
    return { meta, patients };
}

const getSinglePatientFromDb = async(slug:string) => {
    const result = await PatientModel.findOne({slug,isDelete:false,isActive:true}).populate("user");
    return result
}

const getPatientProfile = async(user:TTokenUser) => {
    const userData = await UserModel.findOne({email:user.email})
    const patientData = await PatientModel.findOne({user:userData?._id}).populate("user");
    console.log(userData,patientData)
    return patientData
}

const updatePatientProfile = async(user:TTokenUser,payload:Partial<TPatient> & Partial<TUser>) => {
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


      const {bloodPressure,glucose,weight, ...updatedData} = payload

      if (bloodPressure) {
        for (const bp of bloodPressure) {
            await PatientModel.findOneAndUpdate(
                { user: userData._id, "bloodPressure.date": bp.date, "bloodPressure.time": bp.time },
                { $set: { "bloodPressure.$": bp } }, // Update existing
                { upsert: true, new: true, runValidators: true }
            );
        }
    }

    if (glucose) {
        // Add or update glucose records
        for (const glu of glucose) {
            await PatientModel.findOneAndUpdate(
                { user: userData._id, "glucose.date": glu.date, "glucose.time": glu.time },
                { $set: { "glucose.$": glu } }, // Update existing
                { upsert: true, new: true, runValidators: true }
            );
        }
    }

    if (weight) {
        // Add or update weight records
        for (const wt of weight) {
            await PatientModel.findOneAndUpdate(
                { user: userData._id, "weight.date": wt.date, "weight.time": wt.time },
                { $set: { "weight.$": wt } }, // Update existing
                { upsert: true, new: true, runValidators: true }
            );
        }
    }
        const result = await PatientModel.findById(userData?._id,payload,{new:true,runValidators:true});
    return result  
}




export const PatientServices = {
    getAllPatientsFromDb,
    getSinglePatientFromDb,
    getPatientProfile,
    updatePatientProfile,
}