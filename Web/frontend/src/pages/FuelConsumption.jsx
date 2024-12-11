import React, { useState } from "react";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import backgroundImage from "../assets/Sea.jpg";

const FuelConsumption = () => {
  const [fuelCapacityTones, setFuelCapacityTones] = useState(""); // Initialize state as an empty string

  const handleFuelChange = (e) => {
    setFuelCapacityTones(e.target.value);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <ProgressBar currentStep={1} />

      {/* Fuel Consumption Section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white bg-opacity-90 shadow-xl rounded-lg p-12 mx-6 w-full max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">
            Fuel Capacity
          </h2>

          <form className="space-y-8">
            <label className="block text-xl font-medium text-gray-700">
              Enter Fuel Capacity (in tones):
            </label>
            <input
              type="number"
              min="1000"
              max="5000"
              step="100"
              value={fuelCapacityTones}
              onChange={handleFuelChange}
              placeholder="Enter the fuel capacity in tones"
              className="w-full px-6 py-4 border border-gray-300 rounded-md shadow-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-xl placeholder-gray-400"
            />

            <p className="text-lg text-gray-600 mt-6">
              <span className="font-semibold text-blue-600">
                Selected Capacity:
              </span>{" "}
              {fuelCapacityTones ? `${fuelCapacityTones} Tones` : "None entered"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FuelConsumption;
