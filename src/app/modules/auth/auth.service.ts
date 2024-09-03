import bcrypt from "bcrypt";
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import PatientModel from "../patient/patient.model";
import { TUser } from "../user/user.interface";
import UserModel from "../user/user.model";
import { createToken, verifyToken } from "./auth.utils";
import { TTokenUser, TUserRole } from "../../types/common";
import jwt, { Secret } from "jsonwebtoken";
import { sendMail } from "../../utils/sendMail";
import fs from "fs"
import path from "path"
import moment from "moment";
import { generateSlug } from "../../utils/generateSlug";

const createPatientIntoDb = async (payload: TUser) => {
  const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
  payload.password = hashedPassword;
  const slug = generateSlug(payload.name)
  payload.slug = slug
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    payload.role = "patient";
    // Create User document
   const user = await UserModel.create([payload], { session });

    // Retrieve the created User document
    const userData = await UserModel.findOne({ email: payload.email}).session(session);

    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
    }

    if (!userData.isActive) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deactivated");
    }
    if (userData.isDelete) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deleted");
    }

       // Create Patient document
       await PatientModel.create([{ ...payload, role: "patient",user:userData._id,slug:userData.slug }], { session });

       
    //  SEND EMAIL FOR VERIFICATION
    const otp = Math.floor(100000 + Math.random() * 900000);   
    const currentTime = new Date();
    // generate token
    const expiresAt = moment(currentTime).add(3, 'minute');

    await UserModel.findOneAndUpdate({email:userData.email}, {validation:{isVerified:false,otp,expiry:expiresAt.toString()}})
    const parentMailTemplate = path.join(process.cwd(), "/src/template/email.html");
    const forgetOtpEmail = fs.readFileSync(parentMailTemplate, "utf-8");
    const html = forgetOtpEmail
      .replace(/{{name}}/g, userData.name)
      .replace(/{{otp}}/g, otp.toString());
      sendMail({to:userData.email, html, subject: "Forget Password Otp From Clinica"});


      // after send verification email put the otp into db
    const updatedUser = await  UserModel.findByIdAndUpdate(userData._id, { validation: {otp, expiry: expiresAt.toString(), isVerified: false } }, { new: true,runValidators:true }).session(session);

    const jwtPayload = { email: userData.email, role: userData.role };
    const token = createToken(
      jwtPayload,
      config.jwt_reset_secret as string,
      "3m"
    );


    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    return {
      token
    }
  } catch (error:any) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const verifyAccount = async (token:string,payload:{email:string,otp:number}) => {

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Please provide your token");
  }

  const  decode = verifyToken(token, config.jwt_reset_secret as Secret);
  if (!decode) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Token");
  }

  const userData = await UserModel.findOne({ email: decode.email });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
  }

  if (!userData.isActive) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deactivated");
  }
  if (userData.isDelete) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deleted");
  }

  if (userData.validation?.isVerified === true) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is already verified");
  }

  console.log(userData.validation,payload)

  if (userData.validation?.otp !== payload.otp) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Otp");
  }
  

  await UserModel.findByIdAndUpdate(userData._id, { validation: { isVerified: true,otp:0,expiry:null } }, { new: true,runValidators:true }).lean();

  const jwtPayload = { email: userData.email, role: userData.role };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_reset_secret as string,
      config.access_token_expire_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_reset_secret as string,
      config.refresh_token_expire_in as string,
    );

    return {
      accessToken,
      refreshToken
    }



}

const resendOtp = async (payload:{email:string}) => {

  const userData = await UserModel.findOne({ email: payload.email});

    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
    }

    if (!userData.isActive) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deactivated");
    }
    if (userData.isDelete) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deleted");
    }

  //  SEND EMAIL FOR VERIFICATION
  const otp = Math.floor(100000 + Math.random() * 900000);   
  const currentTime = new Date();
  // generate token
  const expiresAt = moment(currentTime).add(3, 'minute');


  await UserModel.findOneAndUpdate({email:userData.email}, {validation:{isVerified:false,otp,expiry:expiresAt.toString()}})
  const parentMailTemplate = path.join(process.cwd(), "/src/template/email.html");
  const forgetOtpEmail = fs.readFileSync(parentMailTemplate, "utf-8");
  const html = forgetOtpEmail
    .replace(/{{name}}/g, userData.name)
    .replace(/{{otp}}/g, otp.toString());
    sendMail({to:userData.email, html, subject: "Forget Password Otp From Clinica"});


    // after send verification email put the otp into db
  const updatedUser = await  UserModel.findByIdAndUpdate(userData._id, { validation: {otp, expiry: expiresAt.toString(), isVerified: false } }, { new: true,runValidators:true });

  const jwtPayload = { email: userData.email, role: userData.role };
  const token = createToken(
    jwtPayload,
    config.jwt_reset_secret as string,
    "3m"
  );
return {
  token
}
}

const signInIntoDb = async (payload:{email:string,password:string}) => {
  const userData = await UserModel.findOne({ email: payload.email }).select("+password").lean();

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
  }

  if (!userData.isActive) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deactivated");
  }
  if (userData.isDelete) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deleted");
  }

  const isMatch = await bcrypt.compare(payload.password, userData.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Password");
  }

  if (userData.validation?.isVerified === false) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is not verified");
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

  const payload = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as {
    email: string;
    role: TUserRole;
  };
  const jwtPayload = { email: payload.email, role: payload.role };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expire_in as string,
  );
  return {
    accessToken
  }
}

const forgetPasswordIntoDb = async (email:string) => {
    const userData = await UserModel.findOne({ email: email });

    if (!userData) {
      throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
    }
    if (!userData.isActive) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deactivated");
    }
    if (userData.isDelete) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deleted");
    }
    if (!userData.validation?.isVerified) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your Account is not verified");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);   
    const currentTime = new Date();
    // generate token
    const expiresAt = moment(currentTime).add(3, 'minute');
    const token = createToken(
      { email: userData.email, role: userData.role },
      config.jwt_reset_secret as Secret,
      "3m",)

    //  find user and update validation
      await UserModel.findOneAndUpdate({email}, {validation:{isVerified:false,otp,expiry:expiresAt.toString()}})
      const parentMailTemplate = path.join(process.cwd(), "/src/template/email.html");
      const forgetOtpEmail = fs.readFileSync(parentMailTemplate, "utf-8");
      const html = forgetOtpEmail
        .replace(/{{name}}/g, userData.name)
        .replace(/{{otp}}/g, otp.toString());
        sendMail({to:userData.email, html, subject: "Forget Password Otp From Clinica"});
    return {
    token
    }
}

const resetPassword = async (token:string, payload:{email:string,otp:string,password:string}) => {
  const decode = jwt.verify(token, config.jwt_access_secret as Secret) as TTokenUser
  const userData = await UserModel.findOne({ email: decode.email });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
  } 
  if (userData.isDelete) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deleted");
  } 
  if (!userData.isActive) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Account is Deactivated");
  }

  if (payload.otp !== userData.validation?.otp.toString()) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Otp");
  }

  
  const newPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
  await UserModel.findOneAndUpdate({email:decode.email}, {password:newPassword,validation:{isVerified:true,otp:0,expiry:null}})

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



export const AuthServices = {
    createPatientIntoDb,
    signInIntoDb,
    refreshToken,
    forgetPasswordIntoDb,
    resetPassword,
    verifyAccount,
    resendOtp
}