import React, { useState } from "react";
import Header from "../components/Header";
import ProgressBar from "../components/ProgressBar";
import backgroundImage from "../assets/Sea.jpg";

const EnginePowerSpeed = () => {
  const [enginePower, setEnginePower] = useState(""); // Initialize as empty string
  const [speed, setSpeed] = useState(""); // Initialize as empty string

  const handlePowerChange = (e) => {
    const value = e.target.value;
    setEnginePower(value);
  };

  const handleSpeedChange = (e) => {
    const value = e.target.value;
    setSpeed(value);
  };

  return (
    <div
      className="bg-gray-50 min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      <ProgressBar currentStep={2} />

      <div className="max-w-4xl mx-auto p-8">
        {/* Engine Power Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center mb-12">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">
            Engine Power
          </h3>
          <input
            type="number"
            min="0"
            max="7457" // Maximum horsepower converted to kilowatts (10000 HP * 0.7457)
            step="10"
            value={enginePower}
            onChange={handlePowerChange}
            placeholder="Enter engine power in kilowatts"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-700 placeholder-gray-400"
          />
          <p className="mt-4 text-lg text-gray-700">
            Entered Power:{" "}
            <span className="font-bold text-blue-600">
              {enginePower
                ? `${enginePower} kW (${(enginePower / 0.7457).toFixed(2)} HP)`
                : "None entered"}
            </span>
          </p>
        </div>

        {/* Speed Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Speed</h3>
          <input
            type="number"
            min="0"
            max="50"
            step="1"
            value={speed}
            onChange={handleSpeedChange}
            placeholder="Enter speed in knots"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-700 placeholder-gray-400"
          />
          <p className="mt-4 text-lg text-gray-700">
            Entered Speed:{" "}
            <span className="font-bold text-blue-600">
              {speed ? `${speed} Knots` : "None entered"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnginePowerSpeed;
