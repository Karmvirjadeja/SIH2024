import mongoose from "mongoose";
import express from "express";
import { saveLocation } from "../controller/saveLocation.js";


const router = express.Router();

router.post("/savelocation", saveLocation)

export default router