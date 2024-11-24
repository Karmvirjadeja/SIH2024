import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';

const OptimizedRoute = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <ProgressBar currentStep={3} />

      <div className="p-8 max-w-6xl mx-auto">
        {/* Location Inputs Section */}
        <div className="flex justify-center items-center space-x-16 my-8">
          {/* Vishakhapatnam Section */}
          <div className="flex flex-col items-center">
            <input
              className="border-b-2 border-blue-500 text-center mb-2 w-48 py-2 text-gray-800 font-semibold focus:border-blue-700 outline-none transition-all"
              type="text"
              value="Vishakhapatnam"
              readOnly
            />
            <input
              className="border-b-2 border-gray-300 text-center mb-2 w-48 py-2 text-gray-600 outline-none"
              type="text"
              value="17°56'32.6\N"
              readOnly
            />
            <input
              className="border-b-2 border-gray-300 text-center w-48 py-2 text-gray-600 outline-none"
              type="text"
              value="83°28'34.9\E"
              readOnly
            />
          </div>

          {/* Location Icon */}
          <div className="flex items-center">
            <IoLocationSharp className="text-blue-500" size={32} />
          </div>

          {/* Indonesia Section */}
          <div className="flex flex-col items-center">
            <input
              className="border-b-2 border-red-500 text-center mb-2 w-48 py-2 text-red-600 font-semibold focus:border-red-700 outline-none transition-all"
              type="text"
              value="Indonesia"
              readOnly
            />
            <input
              className="border-b-2 border-red-300 text-center mb-2 w-48 py-2 text-red-500 outline-none"
              type="text"
              value="1°35'05.3\N"
              readOnly
            />
            <input
              className="border-b-2 border-red-300 text-center w-48 py-2 text-red-500 outline-none"
              type="text"
              value="98°45'52.3\E"
              readOnly
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-4 flex justify-center">
  <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29483844.347761072!2d76.13923545146208!3d-1.2618664253716902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699e4edc69fffd%3A0x401576d14d2d6c0!2sIndonesia!5e0!3m2!1sen!2sin!4v1602061244774!5m2!1sen!2sin"
            width="600"
            height="450"
            className="border-0 rounded-lg shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        </div>
        </div>
  );
};

export default OptimizedRoute;
