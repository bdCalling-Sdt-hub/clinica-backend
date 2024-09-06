import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { uploadToS3 } from "../../constrant/s3";
import auth from "../../middlewares/auth";
import { PatientController } from "./patient.controller";
import { PatientValidation } from "./patient.validation";
import validateRequest from "../../middlewares/validateRequest";
const storage = memoryStorage();
const upload = multer({ storage });

const router = Router()

router.get("/patient-list",
    auth("admin","doctor"),
     PatientController.getPatients
)

router.get("/profile",
    auth("admin","doctor","patient"),
    PatientController.getPatientProfile
)

router.get("/:slug",
    auth("admin","doctor"),
    PatientController.getSinglePatient
)


router.patch("/update-profile", 
    auth("patient"),
    upload.single('profilePicture'),
    async(req,res,next ) => {
        try {
            if (req.file) {
                const profilePicture = await uploadToS3({
                  file: req.file,
                  fileName: `users/${Math.floor(100000 + Math.random() * 900000)}`,
                });
                req.body = PatientValidation.updatePatient.parse({...JSON.parse(req?.body?.data),profilePicture})
            } else {
                req.body = PatientValidation.updatePatient.parse(JSON.parse(req?.body?.data))
            }
        next()
        } catch (error) {
            next(error)
        }
    },
    PatientController.updatePatientProfile
)

router.patch("/action/:slug", auth("admin"),  validateRequest(PatientValidation.patientActionValidation), PatientController.patientActionForAdmin);
router.delete("/delete-my-account", auth("patient"), PatientController.deleteMyAccount);



export const PatientRoutes = router