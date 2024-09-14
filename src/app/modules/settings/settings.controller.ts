import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { SettingsServices } from "./settings.service";
import catchAsync from "../../utils/catchAsync";

const createSettings = catchAsync(async (req, res) => {
    const result = await SettingsServices.createSettingsIntoDb(req.body);
    sendResponse(req, res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Settings created successfully",
        data: result,
    });
})


export const SettingsControllers = {
    createSettings
}