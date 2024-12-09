import {asyncHandler} from "../utils/asyncHandler.js";
import Location from "../models/Location.js";

export const saveLocation = asyncHandler(async (req, res) => {
        const { latitude, longitude } = req.body;
        const location = new Location({ latitude, longitude });
        await location.save();
        res.status(201).json(location);
    });