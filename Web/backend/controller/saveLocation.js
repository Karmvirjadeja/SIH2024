// import {asyncHandler} from "../utils/asyncHandler.js";
// import Location from "../models/Location.js";
import { sendOTPEmail } from "../utils/NodeMailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Location from "../models/Location.js";
import portsData from "../utils/Ports_Chennai_To_Perth.json" assert { type: "json" };
 // Import the JSON file
import haversine from "haversine-distance"; // You can use this package or implement manually

 // Ensure you have this import
 // Adjust the import according to your project structure

// Controller to save location and send email
export const saveLocation = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    // Validate input
    if (!latitude || !longitude) {
        res.status(400);
        throw new Error("Latitude and longitude are required.");
    }

    try {
        // Save location to the database
        const location = new Location({ latitude, longitude });
        await location.save();

        // Send email with the location details
        const response = await sendOTPEmail("choudharyumesh986@gmail.com", latitude, longitude);

        // Respond with success message
        res.status(201).json({
            message: "Location saved and email sent successfully.",
            data: response,
        });
    } catch (error) {
        // Handle errors for both saving location and sending email
        res.status(500);
        throw new Error("An error occurred: " + error.message);
    }
});



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
