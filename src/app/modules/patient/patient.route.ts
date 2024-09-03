import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router()

router.get("/patient-list", 
     PatientController.getPatients
)

router.get("/:slug", 
    PatientController.getSinglePatient
)

router.get("/profile", 
    PatientController.getPatientProfile
)

router.patch("/update-profile", 
    PatientController.updatePatientProfile
)


export const PatientRoute = router