import React, { useState } from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

const FuelConsumption = () => {
  const [fuelCapacity, setFuelCapacity] = useState(2);
  const [consumptionRate, setConsumptionRate] = useState(63000);

  const handleFuelChange = (e) => {
    setFuelCapacity(e.target.value);
  };

  const handleRateChange = (e) => {
    setConsumptionRate(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <ProgressBar currentStep={1} />

      {/* Fuel Consumption Section */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Fuel Capacity</h2>
          <h3 className="text-4xl font-bold text-blue-600 mb-4">{fuelCapacity} million gallons</h3>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={fuelCapacity}
            onChange={handleFuelChange}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex justify-between mt-6 text-gray-500 text-lg">
            <span>1 million</span>
            <span>2 million</span>
            <span>3 million</span>
            <span>4 million</span>
            <span>5 million</span>
          </div>
        </div>

        {/* Fuel Consumption Rate Section */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Fuel Consumption Rate</h3>
          <select
            value={consumptionRate}
            onChange={handleRateChange}
            className="border border-blue-500 p-3 rounded-md w-full max-w-sm mx-auto text-lg text-gray-800 bg-gray-50 hover:bg-blue-50 transition duration-300"
          >
            <option value={63000}>63,000 Gallons per day</option>
            <option value={70000}>70,000 Gallons per day</option>
            <option value={80000}>80,000 Gallons per day</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FuelConsumption;
