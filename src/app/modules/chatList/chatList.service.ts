import httpStatus from "http-status";
import mongoose from "mongoose";
import { TTokenUser } from "src/app/types/common";
import AppError from "../../errors/AppError";
import UserModel from "../user/user.model";
import { TChatList } from "./chatList.interface";
import ChatListModel from "./chatList.model";
import { MessageServices } from "../massage/message.service";
import MessageModel from "../massage/message.model";

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
  // Find the user based on the email provided by the token
  const userData = await UserModel.findOne({ email: user.email });
  
  // Handle cases where the user is not found or is inactive/deleted/unverified
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

  // Retrieve the chat list where the user is a participant
  const chatsList = await ChatListModel.find({
    'participants.user': userData._id,
  }).populate({
    path: 'participants.user',
    select: 'name slug email profilePic gender contact role _id',
    match: { _id: { $ne: userData._id } }, // Exclude the current user
  });

  if (!chatsList || chatsList.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Chat List Not Found");
  }

  const chatData = [];

  // Loop through each chat and get the latest message and unread message count
  for (const chat of chatsList) {
    // Filter out participants who are marked as deleted
    const filteredParticipants = chat.participants.filter(participant => !participant.isDelete);

    // Get the latest message in the chat
    const latestMessage = (await MessageModel.findOne({ chat: chat._id }).populate({path:"sender receiver",select:"name profilePicture createdAt updatedAt"}).sort({ updatedAt: -1 }))

    // Get the count of unread messages for this chat
    const unreadMessageCount = await MessageModel.countDocuments({
      chat: chat._id,
      seen: false,
      sender: { $ne: userData._id },
    });

    // Construct the chat object with the participants, latest message, and unread message count
    chatData.push({
      chatId: chat._id,
      participants: filteredParticipants,
      latestMessage: latestMessage
        ? {
            sender: latestMessage.sender,
            receiver: latestMessage.receiver,
            text: latestMessage.text,
            file: latestMessage.file,
            seen: latestMessage.seen,
            createdAt: latestMessage.createdAt,
          }
        : null,
      unreadMessageCount,
    });
  }

  // Sort chat data based on the latest message date
  chatData.sort((a, b) => {
    const dateA = (a.latestMessage && a.latestMessage.createdAt) || 0;
    const dateB = (b.latestMessage && b.latestMessage.createdAt) || 0;
    return dateB - dateA;
  });

  return chatData;
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