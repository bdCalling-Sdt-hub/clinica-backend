import { Server as HttpServer } from "http";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { Server } from "socket.io";
import config from "./app/config";
import AppError from "./app/errors/AppError";
import { verifyToken } from "./app/modules/auth/auth.utils";
import MessageModel from "./app/modules/massage/message.model";
import UserModel from "./app/modules/user/user.model";
import { TTokenUser } from "./app/types/common";
const initializeSocketIo = (server: HttpServer) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    const onlineUser = new Set();

    io.on("connection",async(socket) => {
        console.log("connected",socket.id);

        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

            const decode = verifyToken(token, config.jwt_access_secret as Secret) as TTokenUser;

            if (!decode) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
            }
            const userData = await UserModel.findOne({ email:decode.email }).lean();
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

            socket.join(decode.email)
            onlineUser.add(decode.email);

            socket.on("check",(data,callback)=> {
                console.log(data)
                callback({success:true})
            })

            io.emit("onlineUser", Array.from(onlineUser))

            socket.on("message-page", async(receiverId,callback) => {
                if (!receiverId) {
                    callback({success:false,message:"Receiver Id is required"})
                }

               try {
                 const receiverDetails = await UserModel.findById(receiverId).select("name email role profilePicture");

                if (!receiverDetails) {
                    callback({success:false,message:"Receiver not found"})
                }

                io.emit("io-error",{
                    success:false,
                    message:"receiver not found"
                });

                const payload = {
                    _id:receiverDetails?._id,
                    email:receiverDetails.email,
                    profilePicture:receiverDetails.profilePicture,
                    role:receiverDetails.role,
                }

                socket.emit("user-details", payload);

                const getPreMessage = await MessageModel.find({
                    $or:[
                        {sender: userData._id,receiver:receiverId},
                        {sender:receiverId, receiver:userData._id},
                    ]
                })
               } catch (error:any) {
                callback({
                    success:false,
                    message:error.message
                })
               }
            })

            socket.on("my-chat-list", async(data,callback)=>{
                try {
                    console.log(data)
                    
                } catch (error:any) {
                    callback({success:false,message:error.message})
                }
            })
        socket.on('disconnect', () => {
        // onlineUser.delete(user?._id?.toString());
        // io.emit('onlineUser', Array.from(onlineUser));
        console.log('disconnect user ', socket.id);
      });

        } catch (error) {
               console.error('-- socket.io connection error --', error);
        }

    })

    return io
    
}
export default initializeSocketIo

