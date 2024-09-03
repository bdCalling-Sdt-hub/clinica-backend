import { Router } from "express";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";

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
    auth("admin","doctor","patient"),
    PatientController.updatePatientProfile
)

export const PatientRoute = router