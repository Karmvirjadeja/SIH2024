import React from "react";
import Header from "../components/Header";

const RouteTracker = () => {
  return (
    <>
      <Header />
      <div className="relative h-screen">
        {/* Map in the background */}
        <div className="absolute inset-0">
        <iframe
  title="map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29483844.347761072!2d76.13923545146208!3d-1.2618664253716902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699e4edc69fffd%3A0x401576d14d2d6c0!2sIndonesia!5e0!3m2!1sen!2sin!4v1602061244774&amp;output=embed&amp;z=5"
  width="600"
  height="450"
  className="w-full h-full border-0"
  allowFullScreen=""
  loading="lazy"
></iframe>

        </div>

        <div className="relative z-10 flex h-full">
          {/* Main Content Section */}
          <div className="w-2/3 relative p-6">
            {/* Weather Forecast Section */}
            <div className="absolute top-5 right-5 bg-blue-200 p-4 rounded-lg shadow-lg backdrop-blur-md z-20">
              <h4 className="font-bold mb-2 text-center">Weather Forecast</h4>
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center">
                  <p>8:00</p>
                  <p>☁️</p>
                  <p>21°C</p>
                </div>
                <div className="text-center">
                  <p>10:00</p>
                  <p>🌥️</p>
                  <p>22°C</p>
                </div>
                <div className="text-center">
                  <p>12:00</p>
                  <p>🌤️</p>
                  <p>24°C</p>
                </div>
                <div className="text-center">
                  <p>14:00</p>
                  <p>☀️</p>
                  <p>26°C</p>
                </div>
                <div className="text-center">
                  <p>Now</p>
                  <p>☀️</p>
                  <p>25°C</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
              <button className="bg-green-500 text-white p-2 rounded-full shadow-lg">GPS</button>
              <button className="bg-red-500 text-white p-2 rounded-full shadow-lg">Pause</button>
              <button className="bg-blue-500 text-white p-2 rounded-full shadow-lg">Route</button>
            </div>
          </div>

          {/* Route Details Sidebar */}
          <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto relative z-20">
            <h3 className="text-lg font-bold mb-4">Route Details</h3>
            <div className="border-t pt-4">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Ship"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-semibold">From Vishakhapatnam to Indonesia</h4>
                  <p>Saturday, 29 June</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>Port of Vishakhapatnam, India</span>
                  <span>16:09h</span>
                </li>
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>Bay of Bengal</span>
                  <span>17:09h</span>
                </li>
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>Andaman Sea</span>
                  <span>19:09h</span>
                </li>
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>Strait of Malacca</span>
                  <span>20:09h</span>
                </li>
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>South China Sea</span>
                  <span>20:09h</span>
                </li>
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>Strait of Singapore</span>
                  <span>20:09h</span>
                </li>
                <li className="border p-2 rounded-lg flex justify-between items-center">
                  <span>Port of Batam, Indonesia</span>
                  <span>20:09h</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteTracker;
