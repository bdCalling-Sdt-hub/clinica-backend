import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import { TBloodPressure } from "./bloodPressure.interface";
import { BloodPressureModel } from "./bloodPressure.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createBloodPressureIntoDb = async (user:TTokenUser,payload: TBloodPressure) => {

    const userData = await UserModel.findOne({ email: user.email }).lean();
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
    const bloodPressureData = {
        user: userData._id,
        date: payload.date,
        time: payload.time,
        systolic: payload.systolic,
        diastolic: payload.diastolic
    }
    const newWeight = await BloodPressureModel.updateOne({user: userData._id,date: payload.date,time: payload.time},bloodPressureData,{upsert:true})
    return newWeight;
};

const getBloodPressuresFromDb = async (user:TTokenUser,query:Record<string,unknown>) => {

    const userData = await UserModel.findOne({ email: user.email }).lean();
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

      const bloodPressureQuery = new QueryBuilder(BloodPressureModel.find({user:userData._id}),query).filter();

    const result = await bloodPressureQuery.modelQuery;
    return result;
} 

export const BloodPressureServices = {
    createBloodPressureIntoDb,
    getBloodPressuresFromDb
}