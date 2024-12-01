import mongoose from "mongoose";

// Define the schema for weather data
const weatherSchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timezone: { type: String, required: true },
    timezoneAbbreviation: { type: String, required: true },
  },
  hourly: {
    time: [Date],  // Array of Date objects
    temperature2m: [Number],
    precipitationProbability: [Number],
    windSpeed10m: [Number],
    windSpeed80m: [Number],
    windSpeed120m: [Number],
    windSpeed180m: [Number],
    windDirection10m: [Number],
    windDirection80m: [Number],
    windDirection120m: [Number],
    windDirection180m: [Number],
  },
});

// Define the schema for marine data
const marineSchema = new mongoose.Schema({
  hourly: {
    time: [Date],  // Array of Date objects
    waveHeight: [Number],
    waveDirection: [Number],
  },
});

// Define the combined schema for weather and marine data
const weatherMarineSchema = new mongoose.Schema({
  weatherData: weatherSchema,
  marineData: marineSchema,
  createdAt: { type: Date, default: Date.now },
});

// Create a model based on the schema
const WeatherMarine = mongoose.model("WeatherMarine", weatherMarineSchema);

export default WeatherMarine;
