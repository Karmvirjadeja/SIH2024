import mongoose from "mongoose";

const coordinateSchema = new mongoose.Schema({
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    waveHeight: { type: Number, required: true },
    waveDirection: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    precipitation: { type: Number, required: true }
});

const Coordinate = mongoose.model("Coordinate", coordinateSchema);

export default Coordinate;
