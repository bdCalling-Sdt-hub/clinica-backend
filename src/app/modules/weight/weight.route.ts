import { Router } from "express";
import auth from "../../middlewares/auth";
import { WeightControllers } from "./weight.controller";
const router = Router()
router.get("/get-weights", auth("patient"), WeightControllers.getWeights);
router.get("/last-weight", auth("patient"), WeightControllers.getLatestWeightData);
router.post("/create", auth("patient"), WeightControllers.createWeight);



export const WeightRoutes = router