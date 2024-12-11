import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';
import backgroundImage from '../assets/Sea.jpg'; // Import the image from your local assets folder

const OptimizedRoute = () => {
  return (
    <div
      className="bg-gradient-to-r from-blue-100 to-blue-400 min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      <ProgressBar currentStep={3} />

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 md:px-16">
        {/* Location Inputs Section */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 w-full max-w-6xl mx-auto">
          {/* Source (Chennai) Section */}
          <div className="flex flex-col items-center w-full md:w-1/3 bg-white shadow-lg rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Source</h2>
            <input
              className="border-b-2 border-blue-500 text-center mb-4 w-full py-4 text-2xl font-semibold text-gray-800 focus:outline-none"
              type="text"
              value="Chennai"
              readOnly
            />
            <input
              className="border-b-2 border-gray-300 text-center mb-4 w-full py-3 text-gray-600 text-xl focus:outline-none"
              type="text"
              value="13°05'15.2\N"
              readOnly
            />
            <input
              className="border-b-2 border-gray-300 text-center w-full py-3 text-gray-600 text-xl focus:outline-none"
              type="text"
              value="80°17'56.6\E"
              readOnly
            />
          </div>

          {/* Location Icon */}
          <div className="flex items-center">
            <IoLocationSharp className="text-blue-500" size={50} />
          </div>

          {/* Destination (Perth) Section */}
          <div className="flex flex-col items-center w-full md:w-1/3 bg-white shadow-lg rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Destination</h2>
            <input
              className="border-b-2 border-red-500 text-center mb-4 w-full py-4 text-2xl font-semibold text-red-600 focus:outline-none"
              type="text"
              value="Perth"
              readOnly
            />
            <input
              className="border-b-2 border-red-300 text-center mb-4 w-full py-3 text-red-500 text-xl focus:outline-none"
              type="text"
              value="31°57'45.2\N"
              readOnly
            />
            <input
              className="border-b-2 border-red-300 text-center w-full py-3 text-red-500 text-xl focus:outline-none"
              type="text"
              value="115°51'30.5\E"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Footer (optional) */}
      {/* <footer className="bg-blue-500 text-white text-center py-4">Optimized Route - Chennai to Perth</footer> */}
    </div>
  );
};

export default OptimizedRoute;
