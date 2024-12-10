import React from 'react';
import Header from "../components/Header";
import ProgressBar from '../components/ProgressBar';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OptimzePath = () => {
    return (
      <>
        <div>
          <Header />
          <ProgressBar currentStep={6} />
        </div>

        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-8">TrailQuester</h1>

          {/* Map Component */}
          <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden">
            <MapContainer center={[20, 80]} zoom={4} className="w-full h-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[17.6868, 83.2185]}>
                <Popup>Start Point: Vishakhapatnam</Popup>
              </Marker>
              <Marker position={[-6.2088, 106.8456]}>
                <Popup>End Point: Indonesia</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </>
    );
};

export default OptimzePath;
