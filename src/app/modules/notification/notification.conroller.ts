import catchAsync from "../../utils/catchAsync"
import { NotificationServices } from "./notification.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const createNotification = catchAsync(async(req,res) => {
    // const result = await NotificationServices.createNotificationIntoDb();
})

const getNotification = catchAsync(async(req,res) => {
    const result = await NotificationServices.getNotificationFromDb(req.headers.token as string);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Notification fetched successfully',
        data:result
      });
})

const readNotification = catchAsync(async(req,res) => {
    const result = await NotificationServices.readNotificationFromDb(req.headers.token as string);
    sendResponse(req,res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Notification read successfully',
        data:result
      });
})


export const NotificationControllers = {
    createNotification,
    getNotification,
    readNotification
}