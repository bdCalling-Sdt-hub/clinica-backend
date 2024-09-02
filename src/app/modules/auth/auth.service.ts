import bcrypt from "bcrypt";
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import PatientModel from "../patient/patient.model";
import { TUser } from "../user/user.interface";
import UserModel from "../user/user.model";
import { createToken } from "./auth.utils";

const createPatientIntoDb = async (payload: TUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
  payload.password = hashedPassword;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Create User document
   const user = await UserModel.create([payload], { session });

 

    // Retrieve the created User document
    const userData = await UserModel.findOne({ email: payload.email }).session(session);
    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

       // Create Patient document
       await PatientModel.create([{ ...payload, role: "patient",user:userData._id }], { session });

    const jwtPayload = { email: userData.email, role: userData.role };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.access_token_expire_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.refresh_token_expire_in as string,
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error:any) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    console.log(error)
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const signInIntoDb = async (payload:{email:string,password:string}) => {
  const userData = await UserModel.findOne({ email: payload.email });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
  }

  const isMatch = await bcrypt.compare(payload.password, userData.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Password");
  }

  
  const jwtPayload = { email: userData.email, role: userData.role };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expire_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_token_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
}

const refreshToken = async (refreshToken:string) => {
    console.log(refreshToken)
}

const forgetPasswordIntoDb = async () => {
    console.log("forget password")
}

export const AuthServices = {
    createPatientIntoDb,
    signInIntoDb,
    refreshToken,
    forgetPasswordIntoDb
}