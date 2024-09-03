import { Router } from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";

const router = Router()

router.get("/patient-list", 
     PatientController.getPatients
)

router.get("/profile",
    auth("patient"),
    PatientController.getPatientProfile
)

router.get("/:slug",
    PatientController.getSinglePatient
)


router.patch("/update-profile", 
    PatientController.updatePatientProfile
)


export const PatientRoute = router