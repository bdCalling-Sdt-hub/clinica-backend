// import { Server as HttpServer } from "http";
// import httpStatus from "http-status";
// import { Secret } from "jsonwebtoken";
// import { Server } from "socket.io";
// import config from "./app/config";
// import AppError from "./app/errors/AppError";
// import { verifyToken } from "./app/modules/auth/auth.utils";
// import MessageModel from "./app/modules/massage/message.model";
// import UserModel from "./app/modules/user/user.model";
// import { TTokenUser } from "./app/types/common";
// import { ChatListServices } from "./app/modules/chatList/chatList.service";
// import { Types } from "mongoose";
// import ChatListModel from "./app/modules/chatList/chatList.model";
// const initializeSocketIo = (server: HttpServer) => {
//     const io = new Server(server, {
//         cors: { origin: "*" }
//     });

//     const onlineUser = new Set();

//     io.on("connection",async(socket) => {
//         console.log("connected",socket.id);

//         try {
//             const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

//             const decode = verifyToken(token, config.jwt_access_secret as Secret) as TTokenUser;
//             if (!decode) {
//                 throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
//             }
//             const userData = await UserModel.findOne({ email:decode.email }).lean();
//             if (!userData) {
//                 throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
//             }
//             if (!userData.isActive) {
//                 throw new AppError(httpStatus.BAD_REQUEST, "Account is Blocked");
//             }
//             if (userData.isDelete) {
//                 throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
//             }
//             if (!userData.validation?.isVerified) {
//                 throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
//             }

//             socket.join(userData._id.toString())
//             onlineUser.add(userData._id.toString());

//             socket.on("check",(data,callback)=> {
//                 console.log(data)
//                 callback({success:true})
//             })

//             io.emit("onlineUser", Array.from(onlineUser))

//             socket.on("message-page", async(receiverId,callback) => {
//                 if (!receiverId) {
//                     callback({success:false,message:"Receiver Id is required"})
//                 }

//                try {
//                  const receiverDetails = await UserModel.findById(receiverId).select("_id name slug email role contact profilePicture");
//                 if (!receiverDetails) {
//                     callback({success:false,message:"Receiver not found"})
//                 }

//                 io.emit("io-error",{
//                     success:false,
//                     message:"receiver not found"
//                 });

//                 const payload = {
//                     _id:receiverDetails?._id,
//                     email:receiverDetails.email,
//                     name:receiverDetails.name,
//                     slug:receiverDetails.slug,
//                     contact:receiverDetails.contact,
//                     profilePicture:receiverDetails.profilePicture,
//                     role:receiverDetails.role,
//                 }

//                 io.emit("user-details", payload)
                

//                 const getPreMessage = await MessageModel.find({
//                     $or:[
//                         {sender: userData._id,receiver:receiverId},
//                         {sender:receiverId, receiver:userData._id},
//                     ]
//                 }).sort({createdAt:-1})

//                   io.emit('message', getPreMessage || []);
                
//                } catch (error:any) {
//                 callback({
//                     success:false,
//                     message:error.message
//                 })
//                }
//             })

//             socket.on("seen", async(chatListId,callback) => {
//                 if (!chatListId ) {
//                     callback({success:false,message:"Chat List Id is required"})
//                 }

//                try {
//                 const chatList = await ChatListModel.findById(chatListId);
//                 if (!chatList) {
//                     callback({success:false,message:"Chat List not found"})
//                 }

//                   const messageIdList = await MessageModel.aggregate([
//                         {
//                         $match: {
//                             chat: new Types.ObjectId(chatListId),
//                             seen: false,
//                             sender: { $ne: userData?._id },
//                         },
//                         },
//                         { $group: { _id: null, ids: { $push: '$_id' } } },
//                         { $project: { _id: 0, ids: 1 } },
//                     ]);

//                     const unseenMessage = messageIdList.length > 0 ? messageIdList[0].ids : [];

//                     const updateMessages = await MessageModel.updateMany(
//                     { _id: { $in: unseenMessage } },
//                     { $set: { seen: true } },
//                     );


//                      const user1 = chatList.participants[0];
//                     const user2 = chatList.participants[1];


//                     const ChatListUser1 = await ChatListServices.getChatListByUserId(
//                         user1.toString(),
//                     );

//                     const ChatListUser2 = await ChatListServices.getChatListByUserId(
//                         user1.toString(),
//                     );

//           const user1Chat = 'chat-list::' + user1;
//           const user2Chat = 'chat-list::' + user2;

//           io.emit(user1Chat, ChatListUser1);
//           io.emit(user2Chat, ChatListUser2);

//                } catch (error:any) {
//                 callback({
//                     success:false,
//                     message:error.message
//                 })
//                }

//             })

//             socket.on("my-chat-list", async({query},callback)=>{
//                 try {
                    
//                     const chatList = await ChatListServices.getChatListFromDb(decode,query);
//                        const myChat = 'chat-list::' + decode?.email;

//                     callback({success:true,data:chatList})
//                     io.emit(myChat,chatList)
                    
//                 } catch (error:any) {
//                     callback({success:false,message:error.message})
//                 }
//             })
//         socket.on('disconnect', () => {
//         onlineUser.delete(userData?._id?.toString());
//         io.emit('onlineUser', Array.from(onlineUser));
//         console.log('disconnect user ', socket.id);
//       });

//         } catch (error) {
//                console.error('-- socket.io connection error --', error);
//         }

//     })

//     return io
    
// }
// export default initializeSocketIo




// import { Server as HttpServer } from "http";
// import httpStatus from "http-status";
// import { Secret } from "jsonwebtoken";
// import { Server } from "socket.io";
// import config from "./app/config";
// import AppError from "./app/errors/AppError";
// import { verifyToken } from "./app/modules/auth/auth.utils";
// import UserModel from "./app/modules/user/user.model";
// import { TTokenUser } from "./app/types/common";
// import { ChatListServices } from "./app/modules/chatList/chatList.service";
// import { Types } from "mongoose";
// import ChatListModel from "./app/modules/chatList/chatList.model";
// import MessageModel from "./app/modules/massage/message.model";

// const initializeSocketIo = (server: HttpServer) => {
//   const io = new Server(server, {
//     cors: { origin: "*" },
//   });

//   const onlineUsers = new Set();

//   io.on("connection", async (socket) => {
//     console.log("connected", socket.id);

//     try {
//       // Authenticate the user via token
//       const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
//       const decoded = verifyToken(token, config.jwt_access_secret as Secret) as TTokenUser;

//       if (!decoded) throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");

//       const userData = await UserModel.findOne({ email: decoded.email }).lean();
//       if (!userData) throw new AppError(httpStatus.NOT_FOUND, "User not found");
//       if (!userData.isActive) throw new AppError(httpStatus.BAD_REQUEST, "Account is blocked");

//       // Join the room for the authenticated user
//       socket.join(userData._id.toString());
//       onlineUsers.add(userData._id.toString());

//       // Notify all users of the updated list of online users
//       io.emit("onlineUser", Array.from(onlineUsers));

//       // Check connection API
//       socket.on("check", (data, callback) => {
//         console.log(data);
//         callback({ success: true });
//       });

//       // Load previous messages between two users
//       socket.on("message-page", async (receiverId, callback) => {
//         if (!receiverId) return callback({ success: false, message: "Receiver ID is required" });

//         try {
//           const receiverDetails = await UserModel.findById(receiverId).select("_id name slug email role contact profilePicture");

//           if (!receiverDetails) return callback({ success: false, message: "Receiver not found" });

//           const payload = {
//             _id: receiverDetails._id,
//             email: receiverDetails.email,
//             name: receiverDetails.name,
//             slug: receiverDetails.slug,
//             contact: receiverDetails.contact,
//             profilePicture: receiverDetails.profilePicture,
//             role: receiverDetails.role,
//           };

//           socket.emit("user-details", payload);

//           const messages = await MessageModel.find({
//             $or: [
//               { sender: userData._id, receiver: receiverId },
//               { sender: receiverId, receiver: userData._id },
//             ],
//           }).sort({ createdAt: -1 });

//           socket.emit("message", messages || []);
//         } catch (error: any) {
//           callback({ success: false, message: error.message });
//         }
//       });

//       // Send a new message
//       socket.on("send-message", async (data, callback) => {
//         const { receiverId,chatId, text } = data;
//         if (!receiverId || !text) return callback({ success: false, message: "Receiver ID and text are required" });

//         try {
//           const message = new MessageModel({
//             sender: userData._id,
//             receiver: receiverId,
//             text,
//             chat: chatId,
//           });

//           await message.save();
//           // Send the message to both sender and receiver
//           io.to(receiverId).emit("receive-message", message);
//           io.to(userData._id.toString()).emit("receive-message", message);
//           callback({ success: true, message });
//         } catch (error: any) {
//           callback({ success: false, message: error.message });
//         }
//       });
// 8
//       // Mark messages as seen
//       socket.on("seen", async (chatListId, callback) => {
//         if (!chatListId) return callback({ success: false, message: "Chat List ID is required" });

//         try {
//           const chatList = await ChatListModel.findById(chatListId);
//           if (!chatList) return callback({ success: false, message: "Chat List not found" });

//           const unseenMessages = await MessageModel.aggregate([
//             {
//               $match: {
//                 chat: new Types.ObjectId(chatListId),
//                 seen: false,
//                 sender: { $ne: userData._id },
//               },
//             },
//             { $group: { _id: null, ids: { $push: "$_id" } } },
//             { $project: { _id: 0, ids: 1 } },
//           ]);

//           const unseenMessageIds = unseenMessages.length > 0 ? unseenMessages[0].ids : [];

//           await MessageModel.updateMany({ _id: { $in: unseenMessageIds } }, { $set: { seen: true } });

//           // No need to update chat lists unless chat structures change
//           callback({ success: true });
//         } catch (error: any) {
//           callback({ success: false, message: error.message });
//         }
//       });

//       // Load the chat list of the user
//       socket.on("my-chat-list", async ({ query }, callback) => {
//         try {
//           const chatList = await ChatListServices.getChatListFromDb(decoded, query);
//           const myChat = "chat-list::" + userData._id.toString();
//           io.emit(myChat, chatList);
//           callback({ success: true, data: chatList });
//         } catch (error: any) {
//           callback({ success: false, message: error.message });
//         }
//       });

//       // Handle user disconnect
//       socket.on("disconnect", () => {
//         onlineUsers.delete(userData._id.toString());
//         io.emit("onlineUser", Array.from(onlineUsers));
//         console.log("User disconnected:", socket.id);
//       });
//     } catch (error) {
//       console.error("-- socket.io connection error --", error);
//     }
//   });

//   return io;
// };

// export default initializeSocketIo;


/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createToken } from './app/modules/auth/auth.utils';
// socketIO.js
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from "jsonwebtoken"
import { Types } from 'mongoose';
import httpStatus from 'http-status';
import AppError from './app/errors/AppError';
import { TUser } from './app/modules/user/user.interface';
import UserModel from './app/modules/user/user.model';
import MessageModel from './app/modules/massage/message.model';
import { ChatListServices } from './app/modules/chatList/chatList.service';
import { TChatList } from './app/modules/chatList/chatList.interface';
import ChatListModel from './app/modules/chatList/chatList.model';
import { TTokenUser } from './app/types/common';

const initializeSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Online users
  const onlineUser = new Set();

  io.on('connection', async socket => {
    console.log('connected', socket?.id);

    try {
      //----------------------user token get from front end-------------------------//
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.token;
      //----------------------check Token and return user details-------------------------//
      const user = jwt.decode(token) as TTokenUser;
      if (!user) {
        // io.emit('io-error', {success:false, message:'invalid Token'});
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      const userData = await UserModel.findOne({ email:user.email }).lean();
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

      socket.join(userData?._id?.toString());

      //----------------------user id set in online array-------------------------//
      onlineUser.add(userData?._id?.toString());

      socket.on('check', (data, callback) => {
        console.log(data);
        callback({ success: true });
      });

      console.log(onlineUser)

      //----------------------online array send for front end------------------------//
      io.emit('onlineUser', Array.from(onlineUser));

      //----------------------user details and messages send for front end -->(as need to use)------------------------//
      socket.on('message-page', async (userId, callback) => {
        if (!userId) {
          callback({ success: false, message: 'userId is required' });
        }

        try {
          const receiverDetails: TUser = await UserModel.findById(userId).select(
            '_id email role image',
          );

          if (!receiverDetails) {
            callback({
              success: false,
              message: 'user is not found!',
            });
            io.emit('io-error', {
              success: false,
              message: 'user is not found!',
            });
          }
          const payload = {
            _id: receiverDetails?._id,
            email: receiverDetails?.email,
            image: receiverDetails?.profilePicture,
            role: receiverDetails?.role,
          };

          socket.emit('user-details', payload);

          const getPreMessage = await MessageModel.find({
            $or: [
              { sender: userData?._id, receiver: userId },
              { sender: userId, receiver: userData?._id },
            ],
          }).sort({ updatedAt: -1 });

          socket.emit('message', getPreMessage || []);
        } catch (error: any) {
          callback({
            success: false,
            message: error.message,
          });
          io.emit('io-error', { success: false, message: error });
          console.error('Error in message-page event:', error);
        }
      });

      //----------------------chat list------------------------//
      socket.on('my-chat-list', async (data, callback) => {
        try {
          const chatList = await ChatListServices.getChatListByUserId(userData?._id as string);
          const myChat = 'chat-list::' + userData?._id;

          io.emit(myChat, chatList);

          callback({ success: true, message: chatList });
        } catch (error: any) {
          callback({
            success: false,
            message: error.message,
          });
          io.emit('io-error', { success: false, message: error.message });
        }
      });

      //----------------------seen message-----------------------//
      socket.on('seen', async ({ chatId }, callback) => {
        if (!chatId) {
          callback({
            success: false,
            message: 'chatId id is required',
          });
          io.emit('io-error', {
            success: false,
            message: 'chatId id is required',
          });
        }

        try {
          const chatList: TChatList | null = await ChatListModel.findById(chatId);
          if (!chatList) {
            callback({
              success: false,
              message: 'chat id is not valid',
            });
            io.emit('io-error', {
              success: false,
              message: 'chat id is not valid',
            });
            throw new AppError(httpStatus.BAD_REQUEST, 'chat id is not valid');
          }

          const messageIdList = await MessageModel.aggregate([
            {
              $match: {
                chat: new Types.ObjectId(chatId),
                seen: false,
                sender: { $ne: userData?._id },
              },
            },
            { $group: { _id: null, ids: { $push: '$_id' } } },
            { $project: { _id: 0, ids: 1 } },
          ]);
          console.log('🚀 ~ socket.on ~ messageIdList:', messageIdList);
          const unseenMessageIdList =
            messageIdList.length > 0 ? messageIdList[0].ids : [];

          const updateMessages = await MessageModel.updateMany(
            { _id: { $in: unseenMessageIdList } },
            { $set: { seen: true } },
          );

          const user1 = chatList.participants[0];
          const user2 = chatList.participants[1];
          //----------------------ChatList------------------------//
          const ChatListUser1 = await ChatListServices.getChatListByUserId(
            user1.toString(),
          );

          const ChatListUser2 = await ChatListServices.getChatListByUserId(
            user2.toString(),
          );

          const user1Chat = 'chat-list::' + user1;

          const user2Chat = 'chat-list::' + user2;

          io.emit(user1Chat, ChatListUser1);
          io.emit(user2Chat, ChatListUser2);

        } catch (error: any) {
          callback({
            success: false,
            message: error.message,
          });
          console.error('Error in seen event:', error);
          socket.emit('error', { message: error.message });
        }
      });

      //-----------------------Disconnect------------------------//
      socket.on('disconnect', () => {
        onlineUser.delete(userData?._id?.toString());
        io.emit('onlineUser', Array.from(onlineUser));
        console.log('disconnect user ', socket.id);
      });
    } catch (error) {
      console.error('-- socket.io connection error --', error);
    }
  });

  return io;
};

export default initializeSocketIO;