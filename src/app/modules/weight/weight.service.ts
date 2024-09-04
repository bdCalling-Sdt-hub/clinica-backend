import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import { TWeight } from "./weight.interface";
import { WeightModel } from "./weight.model";

const createWeightIntoDb = async (user:TTokenUser,payload: TWeight) => {

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
    const weightData = {
        user: userData._id,
        date: payload.date,
        time: payload.time,
        weight: payload.weight
    }
    const newWeight = await WeightModel.updateOne({user: userData._id,date: payload.date,time: payload.time},weightData,{upsert:true})
    return newWeight;
};

const getWeightsFromDb = async (user:TTokenUser) => {
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
    const weights = await WeightModel.find({user:userData._id});
    return weights;
} 

export const WeightServices = {
    createWeightIntoDb,
    getWeightsFromDb
}