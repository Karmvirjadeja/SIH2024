import React, { useState } from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

const EnginePowerSpeed = () => {
  const [enginePower, setEnginePower] = useState(5000); // Engine power in horsepower
  const [speed, setSpeed] = useState(300); // Speed in knots

  const handlePowerChange = (e) => {
    setEnginePower(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <ProgressBar currentStep={2} />

      <div className="max-w-4xl mx-auto p-8">
        {/* Engine Power Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center mb-12">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Engine Power</h3>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={enginePower}
            onChange={handlePowerChange}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-6 text-gray-500 text-lg">
            <span>1,000 HP</span>
            <span>5,000 HP</span>
            <span>10,000 HP</span>
          </div>
          <p className="mt-4 text-lg text-gray-700">
            Selected Power: <span className="font-bold text-blue-600">{enginePower} HP</span>
          </p>
        </div>

        {/* Speed Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Speed</h3>
          <select
            value={speed}
            onChange={handleSpeedChange}
            className="border border-blue-500 p-3 rounded-md w-full max-w-sm mx-auto text-lg text-gray-800 bg-gray-50 hover:bg-blue-50 transition duration-300"
          >
            <option value={100}>10 Knots</option>
            <option value={200}>20 Knots</option>
            <option value={300}>30 Knots</option>
            <option value={400}>40 Knots</option>
          </select>
          <p className="mt-4 text-lg text-gray-700">
            Selected Speed: <span className="font-bold text-blue-600">{speed} Knots</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnginePowerSpeed;
