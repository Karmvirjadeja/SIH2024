import React, { useState } from 'react';
import { FaCheckCircle, FaShip } from 'react-icons/fa';
import { AiOutlineMenu } from 'react-icons/ai';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';

const ShipSelectionPage = () => {
  const [selectedShip, setSelectedShip] = useState('Containers');

  const ships = [
    { name: 'Containers', icon: <FaShip /> },
    { name: 'Tankers' },
    { name: 'FSO Tankers' },
    { name: 'Cargo' },
    { name: 'Car Carriers' },
    { name: 'Passenger' },
    { name: 'Military' },
    { name: 'Tug & Pilot' },
    { name: 'Fishing' },
    { name: 'Sailing Ships' },
    { name: 'Ferriers' },
    { name: 'Autonomous' },
    { name: 'Submarines' },
    { name: 'Icebreakers' },
    { name: 'Tall Ships' },
    { name: 'Superyachts' },
  ];

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <ProgressBar currentStep={0} />
        {/* Instruction Section */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-800">Select Your Ship Type</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Choose the type of ship from the options below to tailor the optimization algorithm for your ship’s specific needs.
            Different ships have varying characteristics such as speed, fuel efficiency, and cargo capacity. Make sure to choose
            the correct ship for accurate routing.
          </p>
        </div>

        {/* Ship Selection Section */}
        <div className="flex justify-center flex-wrap gap-6 py-8">
          {ships.map((ship) => (
            <button
              key={ship.name}
              onClick={() => setSelectedShip(ship.name)}
              className={`p-4 w-48 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-start space-x-4 ${
                selectedShip === ship.name
                  ? 'bg-blue-500 text-white shadow-lg ring ring-blue-200 ring-offset-2'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {ship.icon && selectedShip === ship.name && (
                <div className="text-white text-2xl">{ship.icon}</div>
              )}
              <span className="text-lg font-semibold">{ship.name}</span>
              {selectedShip === ship.name && (
                <FaCheckCircle className="text-white ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShipSelectionPage;
