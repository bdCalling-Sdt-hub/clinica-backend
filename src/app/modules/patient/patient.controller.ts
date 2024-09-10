import httpStatus from "http-status";
import { CustomRequest } from "../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PatientServices } from "./patient.service";

const getPatients = catchAsync(async (req, res) => {
    const result = await PatientServices.getAllPatientsFromDb(req.query);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patients fetched successfully',
        data:result
      });
})

const getSinglePatient = catchAsync(async (req, res) => {
    const result = await PatientServices.getSinglePatientFromDb(req.params.slug,req.query);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient fetched successfully',
        data:result
      });
})

const getPatientProfile = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await PatientServices.getPatientProfileFromDb(user);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile fetched successfully',
        data:result
      });
})


const updatePatientProfile = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await PatientServices.updatePatientProfileIntoDb(user,req.body);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data:result
      });
})


const deleteMyAccount = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await PatientServices.deleteMyAccountFromDb(user);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile deleted successfully',
        data:result
      });
})

const patientActionForAdmin = catchAsync(async (req, res) => {
    const result = await PatientServices.patientActionForAdmin(req.params.slug,req.body);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient action successfully',
        data:result
      });
})

const setupAlert = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await PatientServices.setupAlertIntoDb(user,req.body);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Alert setup successfully',
        data:result
      });
})



export const PatientController = {
    getPatients,
    getSinglePatient,
    getPatientProfile,
    updatePatientProfile,
    deleteMyAccount,
    patientActionForAdmin,
    setupAlert
}

