import { Router } from "express";
import { DoctorControllers } from "./doctor.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidations } from "./doctor.validation";

const router = Router();

router.get("/doctor-list", auth("admin","patient","doctor"), DoctorControllers.getDoctors);
router.get("/profile", auth("doctor"), DoctorControllers.getProfile);
router.get("/:slug", auth("admin","patient","doctor"), DoctorControllers.getSingleDoctor);
router.post("/create", auth("admin"),validateRequest(DoctorValidations.createDoctorValidation), DoctorControllers.createDoctor);
router.patch("/update-profile/:slug", auth("doctor"), validateRequest(DoctorValidations.updateDoctorValidation), DoctorControllers.updateDoctor);
router.delete("/delete-my-account", auth("doctor"), DoctorControllers.deleteMyAccount);


export const DoctorRoute = router