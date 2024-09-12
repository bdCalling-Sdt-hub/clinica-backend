import { Router } from "express";
import httpStatus from "http-status";
import multer, { memoryStorage } from "multer";
import { uploadToS3 } from "../../constant/s3";
import AppError from "../../errors/AppError";
import auth from "../../middlewares/auth";
import { HealthRecordControllers } from "./healthRecord.controller";
const storage = memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/get-health-records", auth("patient"), HealthRecordControllers.getHealthRecord);
router.post("/upload", auth("patient"),
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
                req.body = {
                  file:  healthRecordFile
                }
            } 
        next()
        } catch (error) {
            next(error)
        }
    },
HealthRecordControllers.uploadHealthRecord);

export const HealthRecordRoutes = router