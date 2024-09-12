import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { uploadToS3 } from "../../constant/s3";
import auth from "../../middlewares/auth";
import { MessageControllers } from "./message.controller";
import { MessageValidations } from "./message.validation";
const storage = memoryStorage();
const upload = multer({ storage });

const router = Router();
router.post("/create", auth("doctor", "patient"), upload.single('file'),
    async(req,res,next ) => {
        try {
            if (req.file) {
                const file = await uploadToS3({
                  file: req.file,
                  fileName: `document/${Math.floor(100000 + Math.random() * 900000)}`,
                });
                req.body = MessageValidations.createMessageSchema.parse({...JSON.parse(req?.body?.data),file})
            } else {
                req.body = MessageValidations.createMessageSchema.parse(JSON.parse(req?.body?.data))
            }
        next()
        } catch (error) {
            next(error)
        }
    }, MessageControllers.createMessage);
export const MessageRoutes = router