import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import { CustomRequest, TTokenUser } from "../../types/common";

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

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
    const {accessToken} = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token successfully",
        data: {
          accessToken
        }
    }) 
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email
  const result = await AuthServices.forgetPasswordIntoDb(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please check you email',
    data:result
  });
})


const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.token
  const {accessToken,refreshToken} = await AuthServices.resetPassword(token as string, req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: {
      accessToken,
    },
  });
})


export const AuthController = {
    createPatient,
    signIn,
    refreshToken,
    forgetPassword,
    resetPassword
}