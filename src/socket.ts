import { Server } from "socket.io";
import {createServer,Server as HttpServer} from "http";
import { TUser } from "./app/modules/user/user.interface";
import { verifyToken } from "./app/modules/auth/auth.utils";
import config from "./app/config";
import { Secret } from "jsonwebtoken";
import { TTokenUser } from "./app/types/common";
import AppError from "./app/errors/AppError";
import httpStatus from "http-status";
import UserModel from "./app/modules/user/user.model";
const initializeSocketIo = (server: HttpServer) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    const onlineUser = new Set();

    io.on("connection",(socket) => {
        console.log("connected",socket.id);

        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.token;

            const decode = verifyToken(token, config.jwt_access_secret as Secret) as TTokenUser;

            if (!decode) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
            }

            try {
                // const receiverDetails:TUser = await UserModel.findOne({email:decode.email});
            } catch (error) {
                
            }


        } catch (error) {
            
        }

    })
    
}
