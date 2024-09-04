import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";

const getAllUser =catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDb(req.query);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users fetched successfully',
        data:result
      });
})

const getSingleUser =catchAsync(async (req, res) => {
    const result = await UserServices.getSingleUserFromDb(req.params.slug);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User fetched successfully',
        data:result
      });
})

const updateUser =catchAsync(async (req, res) => {
    const result = await UserServices.updateUser(req.params.slug,req.body);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data:result
      });
})



export const UserControllers = {
    getAllUser,
    getSingleUser,
    updateUser
}