import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const createPatient = catchAsync(async (req, res) => {
    const result = await AuthServices.createPatientIntoDb(req.body);

     const { refreshToken, accessToken} = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign Up successfully!',
    data: {
      accessToken,
    },
  });
});

const signIn = catchAsync(async (req, res) => {
    const result = await AuthServices.signInIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Sign in successfully",
        data: result
    }) 
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Refresh token successfully",
        data: result
    }) 
});

export const AuthController = {
    createPatient,
    signIn,
    refreshToken
}