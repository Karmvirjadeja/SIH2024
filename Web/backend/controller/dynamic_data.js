// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";
// import { fetchWeatherApi } from "openmeteo";

// // Helper function to form time ranges
// const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// // Define the getWeatherData function
// export const getWeatherData = asyncHandler(async (req, res) => {
//     const { latitude, longitude } = req.body;

//     // Validate required fields
//     if (!latitude || !longitude) {
//         throw new ApiError(400, "Latitude and Longitude are required");
//     }

//     // Params for general weather data (Open Meteo API)
//     const weatherParams = {
//         latitude,
//         longitude,
//         hourly: ["temperature_2m", "wind_speed_10m", "wind_speed_80m", "wind_speed_120m", "wind_speed_180m", "wind_direction_10m", "wind_direction_80m", "wind_direction_120m", "wind_direction_180m"],
//         wind_speed_unit: "kn"
//     };

//     // Params for marine weather data (Marine Open Meteo API)
//     const marineParams = {
//         latitude,
//         longitude,
//         hourly: ["wave_height", "wave_direction"]
//     };

//     // Define the API URLs
//     const weatherUrl = "https://api.open-meteo.com/v1/forecast";
//     const marineUrl = "https://marine-api.open-meteo.com/v1/marine";

//     try {
//         // Fetch both weather and marine data concurrently using Promise.all
//         const [weatherResponse, marineResponse] = await Promise.all([
//             fetchWeatherApi(weatherUrl, weatherParams),
//             fetchWeatherApi(marineUrl, marineParams)
//         ]);

//         // Process general weather data
//         const weather = weatherResponse[0];
//         const utcOffsetSeconds = weather.utcOffsetSeconds();
//         const timezone = weather.timezone();
//         const timezoneAbbreviation = weather.timezoneAbbreviation();
//         const latitudeData = weather.latitude();
//         const longitudeData = weather.longitude();
//         const hourlyWeather = weather.hourly();

//         const weatherData = {
//             location: {
//                 latitude: latitudeData,
//                 longitude: longitudeData,
//                 timezone,
//                 timezoneAbbreviation,
//             },
//             hourly: {
//                 time: range(Number(hourlyWeather.time()), Number(hourlyWeather.timeEnd()), hourlyWeather.interval()).map(
//                     (t) => new Date((t + utcOffsetSeconds) * 1000)
//                 ),
//                 temperature2m: hourlyWeather.variables(0).valuesArray(),
//                 windSpeed10m: hourlyWeather.variables(1).valuesArray(),
//                 windSpeed80m: hourlyWeather.variables(2).valuesArray(),
//                 windSpeed120m: hourlyWeather.variables(3).valuesArray(),
//                 windSpeed180m: hourlyWeather.variables(4).valuesArray(),
//                 windDirection10m: hourlyWeather.variables(5).valuesArray(),
//                 windDirection80m: hourlyWeather.variables(6).valuesArray(),
//                 windDirection120m: hourlyWeather.variables(7).valuesArray(),
//                 windDirection180m: hourlyWeather.variables(8).valuesArray(),
//             },
//         };

//         // Process marine weather data
//         const marine = marineResponse[0];
//         const hourlyMarine = marine.hourly();

//         const marineData = {
//             hourly: {
//                 time: range(Number(hourlyMarine.time()), Number(hourlyMarine.timeEnd()), hourlyMarine.interval()).map(
//                     (t) => new Date((t + utcOffsetSeconds) * 1000)
//                 ),
//                 waveHeight: hourlyMarine.variables(0).valuesArray(),
//                 waveDirection: hourlyMarine.variables(1).valuesArray(),
//             },
//         };

//         // Combine weather and marine data
//         const combinedData = {
//             ...weatherData,
//             marine: marineData,
//         };

//         // Return the combined data in the response
//         return res.status(200).json(
//             new ApiResponse(200, combinedData, "Weather and Marine data fetched successfully")
//         );

//     } catch (error) {
//         // Handle any errors that occur during the fetch
//         throw new ApiError(500, `Failed to fetch weather and marine data: ${error.message}`);
//     }
// });
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { fetchWeatherApi } from "openmeteo";
import fs from "fs"; // Import the File System module

// Helper function to form time ranges
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Define the getWeatherData function
export const getWeatherData = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  // Validate required fields
  if (!latitude || !longitude) {
    throw new ApiError(400, "Latitude and Longitude are required");
  }

  // Params for general weather data (Open Meteo API) including precipitation and snow rate
  const weatherParams = {
    latitude,
    longitude,
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "precipitation",
      "snowfall",
      "wind_speed_10m",
      "wind_speed_80m",
      "wind_speed_120m",
      "wind_speed_180m",
      "wind_direction_10m",
      "wind_direction_80m",
      "wind_direction_120m",
      "wind_direction_180m",
    ],
    wind_speed_unit: "kn",
  };

  // Params for marine weather data (Marine Open Meteo API)
  const marineParams = {
    latitude,
    longitude,
    hourly: ["wave_height", "wave_direction"],
  };

  // Define the API URLs
  const weatherUrl = "https://api.open-meteo.com/v1/forecast";
  const marineUrl = "https://marine-api.open-meteo.com/v1/marine";

  try {
    // Fetch both weather and marine data concurrently using Promise.all
    const [weatherResponse, marineResponse] = await Promise.all([
      fetchWeatherApi(weatherUrl, weatherParams),
      fetchWeatherApi(marineUrl, marineParams),
    ]);

    // Process general weather data
    const weather = weatherResponse[0];
    const utcOffsetSeconds = weather.utcOffsetSeconds();
    const timezone = weather.timezone();
    const timezoneAbbreviation = weather.timezoneAbbreviation();
    const latitudeData = weather.latitude();
    const longitudeData = weather.longitude();
    const hourlyWeather = weather.hourly();

    const weatherData = {
      location: {
        latitude: latitudeData,
        longitude: longitudeData,
        timezone,
        timezoneAbbreviation,
      },
      hourly: {
        time: range(
          Number(hourlyWeather.time()),
          Number(hourlyWeather.timeEnd()),
          hourlyWeather.interval()
        ).map((t) => new Date(t + utcOffsetSeconds)),
        temperature2m: hourlyWeather.variables(0).valuesArray().slice(-1)[0],
        precipitationProbability: hourlyWeather
          .variables(1)
          .valuesArray()
          .slice(-1)[0],
        precipitation: hourlyWeather.variables(2).valuesArray().slice(-1)[0], // mm/hr
        snowfall: hourlyWeather.variables(3).valuesArray().slice(-1)[0], // mm/hr

        windSpeed180m: hourlyWeather.variables(7).valuesArray().slice(-1)[0],

        windDirection180m: hourlyWeather
          .variables(11)
          .valuesArray()
          .slice(-1)[0],
      },
    };

    // Process marine weather data
    const marine = marineResponse[0];
    const hourlyMarine = marine.hourly();

    const marineData = {
      hourly: {
        time: range(
          Number(hourlyMarine.time()),
          Number(hourlyMarine.timeEnd()),
          hourlyMarine.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        waveHeight: hourlyMarine.variables(0).valuesArray().slice(-1)[0],
        waveDirection: hourlyMarine.variables(1).valuesArray().slice(-1)[0],
      },
    };

    // Combine forecast (weather) and marine data into one response
    const combinedData = {
      ...weatherData,
      marine: marineData,
    };

    // Write combined data to a JSON file
    fs.writeFileSync(
      "weather_marine_data.json",
      JSON.stringify(combinedData, null, 2),
      "utf-8"
    );

    // Return the combined data in the response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          combinedData,
          "Weather and Marine data fetched successfully"
        )
      );
  } catch (error) {
    // Handle any errors that occur during the fetch
    throw new ApiError(
      500,
      `Failed to fetch weather and marine data: ${error.message}`
    );
  }
});
