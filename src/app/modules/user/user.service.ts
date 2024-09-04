import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TTokenUser } from "../../types/common";
import { TUser } from "./user.interface";
import UserModel from "./user.model";

const getAllUsersFromDb = async (query: Record<string, unknown>) => {
    const patientQuery = new QueryBuilder(UserModel.find({isDelete:false}),query).search(["name", "email", "role"]).filter().sort().paginate().fields();
    const meta = await patientQuery.countTotal();
    const patients = await patientQuery.modelQuery;
    return { meta, patients };
}

const getSingleUserFromDb = async (slug:string) => {
    const result = await UserModel.findOne({slug,isDelete:false});
   return result
}

const updateUser = async (slug:string,payload:Partial<TUser>) => {
    const result = await UserModel.findOneAndUpdate({slug,isDelete:false},payload,{new:true,runValidators:true});
    return result
}

const deleteMyProfileFromDb = async (user:TTokenUser) => {

    const userData = await UserModel.findOne({ email: user.email }).select("+password").lean();
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (!userData.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Account is Deactivated");
  }
  if (userData.isDelete) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Account already Deleted");
  }
  if (!userData.validation?.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your Account is not verified");
  }

    await UserModel.findOneAndUpdate({_id:userData._id}, {isDelete:true});
    return null
}

export const UserServices = {
    getAllUsersFromDb,
    getSingleUserFromDb,
    updateUser,
    deleteMyProfileFromDb
}