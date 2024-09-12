import catchAsync from "../../utils/catchAsync";
import { MessageServices } from "./message.service";
import { CustomRequest } from "../../types/common";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createMessage = catchAsync(async (req, res) => {
    const user = (req as CustomRequest).user
    const result = await MessageServices.createMessageIntoDb(user,req.body);
    sendResponse(req, res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Message created successfully",
        data: result,
    });
})


export const MessageControllers = {
    createMessage
}


