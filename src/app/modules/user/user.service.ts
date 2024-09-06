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
    throw new AppError(httpStatus.BAD_REQUEST, "Account is Blocked");
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


const getUsersCount = async () => {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();

  const userCounts = await UserModel.aggregate([
    {
      // Match users created in the current year
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`), // Start of the current year
          $lt: new Date(`${currentYear + 1}-01-01`) // Start of the next year
        }
      }
    },
    {
      // Group by month and count users
      $group: {
        _id: { $month: "$createdAt" }, // Group by the month part of the date
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0, // Remove _id field
        month: "$_id", // Rename _id to monthIndex
        count: 1
      }
    }
  ]);

  console.log(userCounts,"users count");

  // Map the result to include the month names
  const result = userCounts.map(({ monthIndex, count }) => ({
    month: months[monthIndex - 1], // Convert monthIndex (1-based) to month name
    count
  }));

  // Ensure all months are accounted for, filling in with 0 for months without data
  const allMonths = months.map((month, index) => {
    const found = result.find(item => {
      return item.month === month;
    });
    
    return found ? found : { month, count: 0 };
  });

  return allMonths;
};



export const UserServices = {
    getAllUsersFromDb,
    getSingleUserFromDb,
    updateUser,
    deleteMyProfileFromDb,
    getUsersCount
}