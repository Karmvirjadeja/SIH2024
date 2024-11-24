import React, { useState } from 'react';
import { FaGasPump, FaRoad, FaCloudSun, FaClock } from 'react-icons/fa'; // Importing icons
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

const SelectPriorities = () => {
  const [priorities, setPriorities] = useState({
    fuel: false,
    distance: false,
    weather: false,
    time: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPriorities((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <>
    <Header/>
    <ProgressBar currentStep={4}/>
    <div className="my-8 p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-3xl font-bold mb-6 text-[#2563EB]">Select Your Priorities</h3>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 transition-all">
          <input
            type="checkbox"
            name="fuel"
            checked={priorities.fuel}
            onChange={handleCheckboxChange}
            className="hidden"
          />
          <FaGasPump className={`text-2xl mr-3 ${priorities.fuel ? 'text-[#2563EB]' : 'text-gray-400'}`} />
          <span className={`text-lg ${priorities.fuel ? 'font-semibold text-[#2563EB]' : 'text-gray-500'}`}>
            Fuel
          </span>
        </label>

        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 transition-all">
          <input
            type="checkbox"
            name="distance"
            checked={priorities.distance}
            onChange={handleCheckboxChange}
            className="hidden"
          />
          <FaRoad className={`text-2xl mr-3 ${priorities.distance ? 'text-[#2563EB]' : 'text-gray-400'}`} />
          <span className={`text-lg ${priorities.distance ? 'font-semibold text-[#2563EB]' : 'text-gray-500'}`}>
            Distance
          </span>
        </label>

        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 transition-all">
          <input
            type="checkbox"
            name="weather"
            checked={priorities.weather}
            onChange={handleCheckboxChange}
            className="hidden"
          />
          <FaCloudSun className={`text-2xl mr-3 ${priorities.weather ? 'text-[#2563EB]' : 'text-gray-400'}`} />
          <span className={`text-lg ${priorities.weather ? 'font-semibold text-[#2563EB]' : 'text-gray-500'}`}>
            Weather
          </span>
        </label>

        <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:bg-blue-50 transition-all">
          <input
            type="checkbox"
            name="time"
            checked={priorities.time}
            onChange={handleCheckboxChange}
            className="hidden"
          />
          <FaClock className={`text-2xl mr-3 ${priorities.time ? 'text-[#2563EB]' : 'text-gray-400'}`} />
          <span className={`text-lg ${priorities.time ? 'font-semibold text-[#2563EB]' : 'text-gray-500'}`}>
            Time
          </span>
        </label>
      </div>

      {/* Display selected priorities */}
      <div className="mt-6">
        <h4 className="text-xl font-semibold text-gray-700">Selected Priorities:</h4>
        <ul className="mt-2">
          {Object.keys(priorities)
            .filter((priority) => priorities[priority])
            .map((priority) => (
              <li key={priority} className="text-lg text-[#2563EB] font-medium">
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </li>
            ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default SelectPriorities;
