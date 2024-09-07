import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { Request, Response } from "express";
import { CustomRequest, TTokenUser } from "../../types/common";

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.createPatientIntoDb(req.body);

  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign Up successfully!, please verify your email',
    data: result,
  });
});

const verifyAccount = catchAsync(async (req, res) => {
  const {token} = req.headers
  const {accessToken, refreshToken,role} = await AuthServices.verifyAccount(token as string,req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(req,res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account verified successfully',
    data:{
      accessToken,
      role
    }
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const {token} = await AuthServices.resendOtp(req.body);
  sendResponse(req,res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Otp resend successfully',
    data:{
      token,
    }
  });

})
const signIn = catchAsync(async (req, res) => {
    const result = await AuthServices.signInIntoDb(req.body);
    const { refreshToken, accessToken,role} = result;

    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
  
    sendResponse(req,res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sign Up successfully!',
      data: {
        accessToken,
        role
      },
    });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken,role } = req.cookies;
    const {accessToken} = await AuthServices.refreshToken(refreshToken);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token successfully",
        data: {
          accessToken,
          role
        }
    }) 
});


const changePassword = catchAsync(async (req, res) => {
  const user = (req as CustomRequest).user
  const result = await AuthServices.changePassword(user,req.body);
  sendResponse(req,res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data:result
  });
})

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email
  const result = await AuthServices.forgetPasswordIntoDb(email);

  sendResponse(req,res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Please check you email',
    data:result
  });
})


const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.token
  const {accessToken,refreshToken,role} = await AuthServices.resetPassword(token as string, req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(req,res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: {
      accessToken,
      role
    },
  });
})


export const AuthController = {
    createPatient,
    signIn,
    refreshToken,
    forgetPassword,
    resetPassword,
    verifyAccount,
    resendOtp,
    changePassword
}