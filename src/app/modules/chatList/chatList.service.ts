import { TTokenUser } from "src/app/types/common";
import { TChatList } from "./chatList.interface";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import httpStatus from "http-status";
import mongoose from "mongoose";
import ChatListModel from "./chatList.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createChatListIntoDb = async (user:TTokenUser,payload: TChatList) => {
     const userData = await UserModel.findOne({email:user.email});
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

      const participantsWithMe = [...payload.participants, userData._id];
      console.log(participantsWithMe)

      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        const alreadyExists = await ChatListModel.findOne({
        participants: { $all: participantsWithMe },
    });
  
    if (alreadyExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Chat already exists');
    }
        const result = await ChatListModel.create([{user:userData._id,participants:participantsWithMe}],{session});
        await session.commitTransaction();
        session.endSession();
        return result
      } catch (error:any) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message);
      }
}

const getChatListFromDb = async (user:TTokenUser,query:Record<string,unknown>) => {
    const userData = await UserModel.findOne({email:user.email});
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

      console.log(userData)

       const chatsList = await ChatListModel.find({
        participants: { $all: userData._id },
      }).populate({
        path: 'participants',
        select: 'name email profilePicture slug role _id contact gender',
        // match: { _id: { $ne: userData._id } },
      });

    return chatsList
    }

const addUserIntoChatList = async (userId:string) => {
console.log(userId);
}

export const ChatListServices = {
    createChatListIntoDb,
    addUserIntoChatList,
    getChatListFromDb
}