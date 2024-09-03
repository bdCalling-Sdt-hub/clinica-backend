import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import PatientModel from "./patient.model";

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

const updatePatientProfile = async(user:TTokenUser) => {
    const patientData = await PatientModel.findOne({user:user._id});
    if(!patientData) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
}

export const PatientServices = {
    getAllPatientsFromDb,
    getSinglePatientFromDb,
    getPatientProfile,
    updatePatientProfile
}