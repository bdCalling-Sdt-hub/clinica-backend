import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PatientValidation } from "../patient/patient.validation";
import { AuthController } from "./auth.controller";
import { AuthValidations } from "./authValidation";
import auth from "../../middlewares/auth";

const router = Router();
router.get("/refresh-token", auth(), AuthController.refreshToken);
router.post("/sign-up", validateRequest(PatientValidation.createPatient),AuthController.createPatient);
router.post("/sign-in", validateRequest(AuthValidations.signInValidation),AuthController.signIn);
router.post("/forget-password", validateRequest(AuthValidations.forgetPasswordValidation), AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-account", AuthController.verifyAccount);

export const AuthRoute = router;