import { Router } from "express";
import auth from "../../middlewares/auth";
import { WeightControllers } from "./weight.conroller";

const router = Router()

router.get("/get-weights", auth("patient"), WeightControllers.getWeights);
router.post("/create", auth("patient"), WeightControllers.createWeight);



export const WeightRoutes = router