import httpStatus from "http-status";
import mongoose from "mongoose";
import { TTokenUser } from "src/app/types/common";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { TChatList } from "./chatList.interface";
import ChatListModel from "./chatList.model";

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

      const participantsWithMe = [...payload.participants, {user:userData._id}];
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

const getChatListFromDb = async (user: TTokenUser, query: Record<string, unknown>) => {
  const userData = await UserModel.findOne({ email: user.email });
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

  // Retrieve the chat list
  const chatsList = await ChatListModel.findOne({
    'participants.user': userData._id,
  }).populate({
    path: 'participants.user',
    select: 'name slug email profilePic gender contact role _id',
    match: { _id: { $ne: userData._id } }, // Exclude the current user
  });

  // If chatList exists, filter out participants with isDelete: true
  if (chatsList) {
    chatsList.participants = chatsList.participants.filter(participant => !participant.isDelete);
  }

  return chatsList;
};


const deleteUserFromChatList = async (user: TTokenUser, userId: string) => {
  const userData = await UserModel.findOne({ email: user.email });
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

  const myList = await ChatListModel.findOne({
    'participants.user': userData._id,
  });

  if (!myList) {
    throw new AppError(httpStatus.NOT_FOUND, "Chat List Not Found");
  }

  const deletable = myList.participants.find(item => {
    return userId === item.user.toString();
  });

  if (!deletable) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found in Chat List");
  }

  await ChatListModel.findOneAndUpdate(
    {
      'participants.user': userId,
    },
    {
      $set: { 'participants.$[elem].isDelete': true },
    },
    {
      arrayFilters: [{ 'elem.user': userId }],
      new: true, 
      runValidators:true
    }
  );

  return null
};



export const ChatListServices = {
    createChatListIntoDb,
    deleteUserFromChatList,
    getChatListFromDb
}