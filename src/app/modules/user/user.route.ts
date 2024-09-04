import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserControllers } from "./user.controller";
import { uploadToS3 } from "../../constrant/s3";

const router = Router()

router.get("/all-users", auth("admin"), UserControllers.getAllUser);
router.get("/:slug", auth("admin"), UserControllers.getSingleUser);
router.patch("/:slug", auth("admin"), UserControllers.updateUser);


export const UserRoutes = router