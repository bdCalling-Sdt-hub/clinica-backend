import { TTokenUser } from "src/app/types/common";
import { TMessage } from "./message.interface";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import httpStatus from "http-status";
import MessageModel from "./message.model";


const createMessageIntoDb = async (user:TTokenUser,payload: TMessage) => {
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

  const receiverData = await UserModel.findOne({ _id: payload.receiver }).lean();
  if (!receiverData) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver Not Found");
  }
  if (!receiverData.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver Account is Blocked");
  }
  if (receiverData.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver Account is Deleted");
  }
  if (!receiverData.validation?.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Receiver Account is not verified");
  }

  const message = await MessageModel.create({...payload,sender:userData._id,receiver:receiverData._id});
  return message;
}




export const MessageServices = {
    createMessageIntoDb
}