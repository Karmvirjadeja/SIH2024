import { Router } from "express";
import { getWeatherData} from "../controller/dynamic_data.js";

const router = Router();

router.get("/data", getWeatherData);

export default router;