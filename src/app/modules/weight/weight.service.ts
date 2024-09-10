import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import { TWeight } from "./weight.interface";
import { WeightModel } from "./weight.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createWeightIntoDb = async (user:TTokenUser,payload: TWeight) => {

    const userData = await UserModel.findOne({ email: user.email }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Blocked");
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

const getWeightsFromDb = async (user:TTokenUser,query:Record<string,unknown>) => {
    const userData = await UserModel.findOne({ email: user.email }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Blocked");
      }
      if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
      }
      if (!userData.validation?.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
      }

      const weightQuery = new QueryBuilder(WeightModel,WeightModel.find({user:userData._id}),query).filter()
    const result = await weightQuery.modelQuery
    return result;
}


const getLatestWeightDataFromDb = async (user:TTokenUser) => {

  const userData = await UserModel.findOne({ email: user.email }).lean();
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
      }
      if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Blocked");
      }
      if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
      }
      if (!userData.validation?.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
      }


  const latestData = await WeightModel.aggregate([
    {
      // Match documents by user
      $match: { user: userData._id }
    },
    {
      // Add a new field that combines date and time into a Date object
      $addFields: {
        combinedDateTime: {
          $dateFromString: {
            dateString: {
              $concat: ["$date", "T", "$time", ":00"] // Combining into an ISO string
            },
            format: "%d-%m-%YT%H:%M:%S", // Adjusted format for dd-mm-yyyy and time
            timezone: "UTC"
          }
        }
      }
    },
    {
      // Sort by the new combinedDateTime field in descending order
      $sort: { combinedDateTime: -1 }
    },
    {
      // Limit to only the most recent document
      $limit: 1
    }
  ]).exec();
  return latestData[0];
};

export const WeightServices = {
    createWeightIntoDb,
    getWeightsFromDb,
    getLatestWeightDataFromDb,
}