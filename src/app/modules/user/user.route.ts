import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserControllers } from "./user.controller";

const router = Router()

router.get("/all-users", auth("admin"), UserControllers.getAllUser);
router.get("/:slug", auth("admin"), UserControllers.getSingleUser);
router.patch("/:slug", auth("admin"), UserControllers.updateUser);
router.delete("/delete-my-account", auth("patient","doctor"), UserControllers.deleteMyProfile);


export const UserRoutes = router