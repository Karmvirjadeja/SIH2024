import express from 'express';
import { createVesselData,getVesselData } from '../controller/vessel.js';

const router = express.Router();

router.post('/create', createVesselData);
router.get('/get/:name', getVesselData);

export default router;