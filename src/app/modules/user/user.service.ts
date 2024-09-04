import QueryBuilder from "../../builder/QueryBuilder";
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


export const UserServices = {
    getAllUsersFromDb,
    getSingleUserFromDb,
    updateUser
}