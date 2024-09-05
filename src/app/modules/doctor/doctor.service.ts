import { generateSlug } from "../../utils/generateSlug";
import { TDoctor } from "./doctor.interface";
import DoctorModel from "./doctor.model";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import mongoose from "mongoose";
import UserModel from "../user/user.model";
import config from "../../config";
import AppError from "../../errors/AppError";
import moment from "moment";
import path from "path"
import fs from "fs"
import { sendMail } from "../../utils/sendMail";
import { createToken } from "../auth/auth.utils";
import { TUser } from "../user/user.interface";
import { TTokenUser } from "../../types/common";

const createDoctorFromDb = async (payload: TDoctor & TUser) => {
    const hashedPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
    payload.password = hashedPassword;
    const slug = generateSlug(payload.name)
    payload.slug = slug
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      payload.role = "doctor";
      // Create User document
     const user = await UserModel.create([payload], { session });
  
      // Retrieve the created User document
      const userData = await UserModel.findOne({ email: payload.email}).session(session);
  
      if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "Invalid Email");
      }
  
      if (!userData.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
      }
      if (userData.isDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, "Account is Deleted");
      }
  
         // Create doctor document
         await DoctorModel.create([{ ...payload, user:userData._id,slug:userData.slug }], { session });
  
      //  SEND EMAIL FOR VERIFICATION
      const otp = Math.floor(100000 + Math.random() * 900000);   
      const currentTime = new Date();
      // generate token
      const expiresAt = moment(currentTime).add(3, 'minute');
  
      await UserModel.findOneAndUpdate({email:userData.email}, {validation:{isVerified:false,otp,expiry:expiresAt.toString()}},{session})
      const parentMailTemplate = path.join(process.cwd(), "/src/template/verify.html");
      const forgetOtpEmail = fs.readFileSync(parentMailTemplate, "utf-8");
      const html = forgetOtpEmail
        .replace(/{{name}}/g, userData.name)
        .replace(/{{otp}}/g, otp.toString());
        sendMail({to:userData.email, html, subject: "Verify Your Account From Clinica"});
  
  
        // after send verification email put the otp into db
      const jwtPayload = { email: userData.email, role: userData.role };
      const token = createToken(
        jwtPayload,
        config.jwt_reset_secret as string,
        config.jwt_reset_token_expire_in as string
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

const getDoctorsFromDb = async () => {
    const doctors = await DoctorModel.find().populate("user");
    return doctors;
};


const getSingleDoctorFromDb = async (slug: string) => {
    const doctor = await DoctorModel.findOne({slug}).populate("user");
    return doctor;
};

const getProfileFromDb = async () => {
    const profile = await DoctorModel.find().populate("user");
    return profile;
};

const updateDoctorIntoDb = async (slug: string, payload: Partial<TDoctor>) => {
    const updatedDoctor = await DoctorModel.findOneAndUpdate({slug}, payload, {
        new: true,
    });
    return updatedDoctor;
};

const deleteMyProfileFromDb = async (user: TTokenUser) => {
    // const deletedDoctor = await DoctorModel.findByIdAndDelete(doctorId);
    // return deletedDoctor;
};



export const DoctorServices = {
    createDoctorFromDb,
    getDoctorsFromDb,
    getSingleDoctorFromDb,
    getProfileFromDb,
    updateDoctorIntoDb,
    deleteMyProfileFromDb,
}