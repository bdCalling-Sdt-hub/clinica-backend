import { Router } from "express";
import { SettingsControllers } from "./settings.controller";
import auth from "../../middlewares/auth";

const router = Router();


router.post("/create-settings", auth("admin"), SettingsControllers.createSettings);

export const SettingsRoutes = router