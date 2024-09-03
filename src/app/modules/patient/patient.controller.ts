import httpStatus from "http-status";
import { CustomRequest } from "../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PatientServices } from "./patient.service";

const getPatients = catchAsync(async (req, res) => {
    const result = await PatientServices.getAllPatientsFromDb(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patients fetched successfully',
        data:result
      });
})

const getSinglePatient = catchAsync(async (req, res) => {
    const result = await PatientServices.getSinglePatientFromDb(req.params.slug);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient fetched successfully',
        data:result
      });
})

const getPatientProfile = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await PatientServices.getPatientProfile(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile fetched successfully',
        data:result
      });
})


const updatePatientProfile = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await PatientServices.updatePatientProfile(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data:result
      });
})


export const PatientController = {
    getPatients,
    getSinglePatient,
    getPatientProfile,
    updatePatientProfile
}

