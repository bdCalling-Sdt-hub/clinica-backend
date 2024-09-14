import httpStatus from "http-status";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import UserModel from "../user/user.model";
import { TBloodPressure } from "./bloodPressure.interface";
import { BloodPressureModel } from "./bloodPressure.model";
import { sendNotification } from "../notification/sendNotification";

const createBloodPressureIntoDb = async (user:TTokenUser,payload: TBloodPressure) => {
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

       const map = (payload.systolic + (2 * payload.diastolic)) / 3
    const bloodPressureData = {
      user: userData._id,
        data:map.toFixed(2),
        date: payload.date,
        time: payload.time,
        systolic: payload.systolic,
        diastolic: payload.diastolic
    }

      const session = await mongoose.startSession();
      try {
         session.startTransaction();
    const newWeight = await BloodPressureModel.updateOne({user: userData._id,date: payload.date,time: payload.time},bloodPressureData,{upsert:true}).session(session)


        // High blood pressure (in case blood pressure is equal or above 140/90 or MAP equal of above 106.7
    if (payload?.systolic >= 140) {
    
   const notification = await sendNotification([userData.fcmToken],{
    data: {
      type: "bloodPressure",
    },
      title: "High Blood Pressure",
      body: `Your systolic blood pressure is ${payload.systolic} and diastolic blood pressure is ${payload.diastolic}. Your blood pressure is high.`
    })


//  await NotificationModel.create([{
//         user: userData._id,
//         notification
//       }],{session})
    }


    if (payload?.diastolic >= 90) {

   const notification = await sendNotification([userData.fcmToken],{
    data: {
      type: "bloodPressure",
    },
      title: "High Low Pressure",
      body: `Your systolic blood pressure is ${payload.systolic} and diastolic blood pressure is ${payload.diastolic}. Your blood pressure is low.`
    })
   }
    


    //  if (payload?.diastolic >= 90) {
    //  await NotificationModel.create({
    //     user: userData._id,
    //     type: "bloodPressure",
    //     // set a working message
    //     message:`Your systolic blood pressure is ${payload.systolic} and diastolic blood pressure is ${payload.diastolic}. Please visit your doctor.`
    //   },{session})
    // }
    //  if (payload?.data >= 106.7) {
    //  await NotificationModel.create({
    //     user: userData._id,
    //     type: "bloodPressure",
    //     // set a working message
    //     message:`Your systolic blood pressure is ${payload.systolic} and diastolic blood pressure is ${payload.diastolic}. Please visit your doctor`,
    //   },{session})
    // }

    await session.commitTransaction();
    session.endSession();
    return newWeight;
  
      } catch (error:any) {
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message);  
      }

    // CALCULATION FORMULA
      // MAP = [systolic blood pressure + (2 X diastolic blood pressure)] / 3
   
};

const getBloodPressuresFromDb = async (user:TTokenUser,query:Record<string,unknown>) => {
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

      const bloodPressureQuery = new QueryBuilder(BloodPressureModel,BloodPressureModel.find({user:userData._id}),query).filter()
      const result = await bloodPressureQuery.modelQuery
      
    return result;
} 


const getLatestBloodPressureDataFromDb = async (user:TTokenUser) => {

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


  const latestData = await BloodPressureModel.aggregate([
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

export const BloodPressureServices = {
    createBloodPressureIntoDb,
    getBloodPressuresFromDb,
    getLatestBloodPressureDataFromDb
}