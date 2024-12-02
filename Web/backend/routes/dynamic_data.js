import { Router } from "express";
import { getWeatherData} from "../controller/dynamic_data.js";
import {  getDataByCoordinates } from "../controller/getAllData.js";

const router = Router();

router.get("/data", getWeatherData);
router.get("/alldata",getDataByCoordinates );
export default router;