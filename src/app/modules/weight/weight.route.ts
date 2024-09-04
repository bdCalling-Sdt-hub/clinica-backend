import { Router } from "express";
import auth from "../../middlewares/auth";
import { WeightController } from "./weight.conroller";

const router = Router()

router.get("/get-weights", auth("patient"), WeightController.getWeights);
router.post("/create", auth("patient"), WeightController.createUser);



export const WeightRoute = router