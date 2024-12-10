// import mongoose from "mongoose";
import express from "express";
import { saveLocation } from "../controller/saveLocation.js";
import { findNearestPort } from "../controller/saveLocation.js";



const router = express.Router();

router.post("/savelocation", saveLocation)
router.post("/nearest-port", findNearestPort);

export default router