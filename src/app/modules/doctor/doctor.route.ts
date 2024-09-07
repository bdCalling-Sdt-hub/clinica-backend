import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidations } from "./doctor.validation";
import { uploadToS3 } from "../../constrant/s3";
import multer, { memoryStorage } from "multer";
const storage = memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/doctor-list", DoctorControllers.getDoctors);
router.get("/profile", auth("doctor"), DoctorControllers.getProfile);
router.post("/create", auth("admin"),validateRequest(DoctorValidations.createDoctorValidation), DoctorControllers.createDoctor);
router.get("/:slug", DoctorControllers.getSingleDoctor);
router.patch("/update-profile", auth("doctor"),  
upload.single('profilePicture'),
async(req,res,next ) => {
    try {
        if (req.file) {
            const profilePicture = await uploadToS3({
              file: req.file,
              fileName: `users/${Math.floor(100000 + Math.random() * 900000)}`,
            });
            if (req.body?.data) {
            req.body = DoctorValidations.updateDoctorValidation.parse({...JSON.parse(req?.body?.data),profilePicture})
            } else {
                req.body = DoctorValidations.updateDoctorValidation.parse({profilePicture})
            }
        } else if (req?.body?.data) {
            req.body = DoctorValidations.updateDoctorValidation.parse(JSON.parse(req?.body?.data))
        }
    next()
    } catch (error) {
        next(error)
    }
}, DoctorControllers.updateDoctor);
router.delete("/delete-my-account", auth("doctor"), DoctorControllers.deleteMyAccount);
router.patch("/action/:slug", auth("admin"), validateRequest(DoctorValidations.doctorActionFromAdminValidation), DoctorControllers.doctorActionFromAdmin);

export const DoctorRoute = router