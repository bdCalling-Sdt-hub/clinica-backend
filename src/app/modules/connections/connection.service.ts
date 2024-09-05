import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import PatientModel from "../patient/patient.model";
import UserModel from "../user/user.model";
import { TConnection, TConnectionStatus } from "./connection.interface";
import ConnectionModel from "./connection.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createConnectionIntoDb = async (user:TTokenUser, payload: {doctorId:string}) => {
    const userData = await UserModel.findOne({ email: user.email,role:"patient" }).lean();

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
    } 
    if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
    }

    const doctorData = await UserModel.findOne({ _id: payload.doctorId,role:"doctor" }).lean();
    if (!doctorData) {
        throw new AppError(httpStatus.NOT_FOUND, "Doctor Not Found");
    } 
    if (doctorData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
    }
    if (!doctorData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
    }

    const result = await ConnectionModel.create({
        patient: userData._id,
        doctor: doctorData._id,
    });
    return result;
}

//  FOR DOCTOR
const getConnectionRequestFromDb = async (user:TTokenUser,query:Record<string,unknown>) => {
    const userData = await UserModel.findOne({ email: user.email,role:"doctor" }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
    } 
    if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
    }
    const connectionQuery = new QueryBuilder(ConnectionModel.find({
        doctor: userData._id
    }).populate("patient doctor"),query).search(["patient","doctor"]).filter().sort().paginate().fields();
    const result = await connectionQuery.modelQuery.lean();
    return result;
}

// FOR PATIENT
const getMyConnectionRequest = async (user:TTokenUser, query:Record<string,unknown>) => {
    const userData = await UserModel.findOne({ email: user.email,role:"patient" }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
    } 
    if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
    }
   const connectionQuery = new QueryBuilder(ConnectionModel.find({
        patient: userData._id
   }).populate("patient doctor"),query).search(["doctor patient"]).filter().sort().paginate().fields();
   const result = await connectionQuery.modelQuery.lean();
    return result;
}

const updateConnectionStatusIntoDb = async (user:TTokenUser, payload: {connectionId:string, status: TConnectionStatus}) => {
    const userData = await UserModel.findOne({ email: user.email,role:"patient" }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
    } 
    if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
    }

    const result = await ConnectionModel.findOneAndUpdate({
        _id: payload.connectionId,
        doctor: userData._id
    }
    , {
        status: payload.status
    });
    return result;
}

const cancelConnectionIntoDb = async (user:TTokenUser, payload: {connectionId:string}) => {
    const userData = await UserModel.findOne({ email: user.email,role:"patient" }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
    } 
    if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
    }

    const result = await ConnectionModel.findOneAndDelete({
        _id: payload.connectionId, 
        patient: userData._id,
    });
    return result;
}


export const ConnectionServices = {
    createConnectionIntoDb,
    updateConnectionStatusIntoDb,
    cancelConnectionIntoDb,
    getConnectionRequestFromDb,
    getMyConnectionRequest
}