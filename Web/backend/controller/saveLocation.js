// import {asyncHandler} from "../utils/asyncHandler.js";
// import Location from "../models/Location.js";

export const saveLocation = asyncHandler(async (req, res) => {
        const { latitude, longitude } = req.body;
        const location = new Location({ latitude, longitude });
        await location.save();
        res.status(201).json(location);
    });

import { asyncHandler } from "../utils/asyncHandler.js";
import Location from "../models/Location.js";
import portsData from "../utils/Ports_Chennai_To_Perth.json" assert { type: "json" };
 // Import the JSON file
import haversine from "haversine-distance"; // You can use this package or implement manually

// Controller to find the nearest port
export const findNearestPort = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    // Calculate the nearest port
    let nearestPort = null;
    let minDistance = Infinity;

    portsData.forEach((port) => {
        const portLocation = { lat: port.latitude, lon: port.longitude };
        const userLocation = { lat: latitude, lon: longitude };

        // Calculate distance using haversine formula
        const distance = haversine(userLocation, portLocation);

        if (distance < minDistance) {
            minDistance = distance;
            nearestPort = port;
        }
    });

    if (!nearestPort) {
        return res.status(404).json({ error: "No ports found." });
    }

    res.status(200).json({
        message: "Nearest port found",
        port: nearestPort,
        distance: `${(minDistance / 1000).toFixed(2)} km`, // Convert meters to kilometers
    });
});
