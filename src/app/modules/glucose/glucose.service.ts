import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import { TGlucose } from "./glucose.interface";
import { GlucoseModel } from "./glucose.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createGlucoseIntoDb = async (user:TTokenUser,payload: TGlucose) => {

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
    const glucoseData = {
        user: userData._id,
        date: payload.date,
        time: payload.time,
        label: payload.label,
        data: payload.data
    }
    const newWeight = await GlucoseModel.updateOne({user: userData._id,date: payload.date,time: payload.time},glucoseData,{upsert:true})
    return newWeight;
};

const getGlucoseFromDb = async (user:TTokenUser, query:Record<string,unknown>) => {
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

      const glucoseQuery = new QueryBuilder(GlucoseModel.find({user:userData._id}), query).filter();
      const result = await glucoseQuery.modelQuery;
    return result;
} 

export const GlucoseServices = {
     createGlucoseIntoDb,
     getGlucoseFromDb
}