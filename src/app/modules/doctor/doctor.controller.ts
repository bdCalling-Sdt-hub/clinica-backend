import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DoctorServices } from "./doctor.service";
import { CustomRequest } from "../../types/common";

const createDoctor = catchAsync(async (req, res) => {
    const doctor = await DoctorServices.createDoctorFromDb(req.body);
    sendResponse(req,res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Doctor created successfully, Need to verify email",
        data: doctor,
    });
})


const getDoctors = catchAsync(async (req, res) => {
    const doctors = await DoctorServices.getDoctorsFromDb();
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor fetched successfully",
        data: doctors,
    });
})


const getSingleDoctor = catchAsync(async (req, res) => {
    const doctor = await DoctorServices.getSingleDoctorFromDb(req.params.slug);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor fetched successfully",
        data: doctor,
    });
})

const getProfile = catchAsync(async (req, res) => {
    const doctor = await DoctorServices.getProfileFromDb();
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor fetched successfully",
        data: doctor,
    });
})

const updateDoctor = catchAsync(async (req, res) => {
    const doctor = await DoctorServices.updateDoctorIntoDb(req.params.doctorId, req.body);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor updated successfully",
        data: doctor,
    });
})


const deleteMyAccount = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const doctor = await DoctorServices.deleteMyProfileFromDb(user);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: doctor,
    });
})


export const DoctorControllers = {
    createDoctor,
    getDoctors,
    getSingleDoctor,
    getProfile,
    updateDoctor,
    deleteMyAccount
}