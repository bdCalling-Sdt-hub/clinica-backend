import { Router } from "express";
import auth from "../../middlewares/auth";
import { HealthRecordControllers } from "./healthRecord.controller";
import multer, { memoryStorage } from "multer";
import { uploadToS3 } from "../../constrant/s3";
import { HealthRecordValidation } from "./healthRecord.validation";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const storage = memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/health-record", auth("patient"), HealthRecordControllers.getHealthRecord);
router.get("/upload", auth("patient"),
upload.single('file'),
    async(req,res,next ) => {
        try {
            if (!req.file) {
                throw new AppError(httpStatus.BAD_REQUEST, "File is required");
            }
            if (req.file) {
                const healthRecordFile = await uploadToS3({
                  file: req.file,
                  fileName: `health-records/${Math.floor(100000 + Math.random() * 900000)}`,
                });
                req.body = HealthRecordValidation.uploadHealthRecordValidation.parse({...JSON.parse(req?.body?.data),healthRecordFile})
            } 
        next()
        } catch (error) {
            next(error)
        }
    },
HealthRecordControllers.getHealthRecord);

export const HealthRecordRoutes = router