import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Coordinate from "../models/Fake/Coordinate.js";

export const getDataByCoordinates = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    // Validate latitude and longitude
    if (latitude === undefined || longitude === undefined) {
        throw new ApiError(400, "Latitude and Longitude are required.");
    }
    if (typeof latitude !== "number" || typeof longitude !== "number") {
        throw new ApiError(400, "Latitude and Longitude must be numbers.");
    }

    try {
        // Allow some tolerance for floating-point comparison
        const tolerance = 0.00001;
        const data = await Coordinate.findOne({
            latitude: { $gte: latitude - tolerance, $lte: latitude + tolerance },
            longitude: { $gte: longitude - tolerance, $lte: longitude + tolerance }
        });

        if (!data) {
            throw new ApiError(404, `No data found for coordinates: Latitude: ${latitude}, Longitude: ${longitude}`);
        }

        res.status(200).json(new ApiResponse(200, data));
    } catch (error) {
        throw new ApiError(500, `Failed to fetch data: ${error.message}`);
    }
});
