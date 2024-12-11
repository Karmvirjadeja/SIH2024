import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header"; // Adjust the path as necessary
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DivIcon } from 'leaflet';

const piracyIcon = new DivIcon({
  className: 'piracy-icon',
  html: '🏴‍☠️',
  iconSize: [50, 50], // increased icon size
  iconAnchor: [25, 50], // adjusted icon anchor
  popupAnchor: [0, -60], // adjusted popup anchor
  style: {
    fontSize: '50px',
    textAlign: 'center'
  }
});
// Generate nodes based on route segments
function generateRouteNodes(route, segmentLength = 111) {
  const nodes = [route[0]]; // Always add the first point
  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i];
    const end = route[i + 1];
    const totalDistance = haversine(start[0], start[1], end[0], end[1]);
    const numSegments = Math.ceil(totalDistance / segmentLength);
    for (let j = 1; j < numSegments; j++) {
      const fraction = j / numSegments;
      const lat = start[0] + fraction * (end[0] - start[0]);
      const lon = start[1] + fraction * (end[1] - start[1]);
      nodes.push([lat, lon]);
    }
  }
  nodes.push(route[route.length - 1]); // Always add the last point
  return nodes;
}

// Haversine formula to calculate distance between two points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const RouteTracker = () => {
  const [userLocation, setUserLocation] = useState(null);

  // Example routes with latitudes and longitudes
  const routes = [
    [
    //   { latitude: 13.07, longitude: 80.29 },
    //   { latitude: 11.35, longitude: 81.82 },
    //   { latitude: 9.45, longitude: 83.23 },
    //   { latitude: 6.4, longitude: 85.42 },
    //   { latitude: 2.55, longitude: 87.8 },
    //   { latitude: -1.5, longitude: 90.7 },
    //   { latitude: -5.43, longitude: 92.42 },
    //   { latitude: -10.48, longitude: 97.55 },
    //   { latitude: -14.51, longitude: 101.42 },
    //   { latitude: -18.81, longitude: 104.67 },
    //   { latitude: -23.48, longitude: 108.1 },
    //   { latitude: -27.2, longitude: 111.0 },
    //   { latitude: -30.9, longitude: 114.72 },
    //   { latitude: -32.07, longitude: 115.65 }
    // ],
    // [
    //   { latitude: 13.07, longitude: 80.29 },
    //   { latitude: 11.52, longitude: 84.37 },
    //   { latitude: 8.7, longitude: 88.85 },
    //   { latitude: 5.13, longitude: 94.87 },
    //   { latitude: -2.8, longitude: 100.98 },
    //   { latitude: -7.27, longitude: 105.86 },
    //   { latitude: -8.36, longitude: 109.77 },
    //   { latitude: -13.19, longitude: 110.3 },
    //   { latitude: -18.6, longitude: 110.96 },
    //   { latitude: -24.56, longitude: 111.79 },
    //   { latitude: -28.65, longitude: 113.64 },
    //   { latitude: -30.9, longitude: 114.43 },
    //   { latitude: -32.07, longitude: 115.65 }


    {
      "latitude": 12.983683022674901,
      "longitude": 80.70556640625001
},
{
      "latitude": 11.09270498052075,
      "longitude": 81.89208984375001
},
{
      "latitude": -7.9498927650376405,
      "longitude": 98.21777343750001
},
{
      "latitude": -17.85224431942475,
      "longitude": 104.45800781250001
},
{
      "latitude": -20.590623612561537,
      "longitude": 108.23730468750001
},
{
      "latitude": -22.227073362856476,
      "longitude": 109.42382812500001
}
    ]
  ];

  const colors = ["blue", "green"];

  // Piracy locations with 💀 markers
  const piracyLocations = [
    { latitude: 22.30183, longitude: 91.70650 }, // Chattogram Anchorage
    { latitude: 22.28283, longitude: 91.71000 },
    { latitude: 22.23333, longitude: 91.70000 },
    { latitude: 22.16333, longitude: 91.77333 },
    { latitude: 21.92900, longitude: 91.71133 },
    { latitude: 21.92000, longitude: 91.74300 },
    { latitude: 21.84750, longitude: 91.69733 },
    { latitude: 21.83200, longitude: 91.71400 },
    { latitude: 21.81167, longitude: 91.78500 },
    { latitude: 21.39067, longitude: 91.81067 }, // Chattogram Anchorage
    { latitude: 17.05533, longitude: 82.41033 }, // Kakinada Anchorage
    { latitude: 17.03233, longitude: 82.36067 },
    { latitude: 3.79768, longitude: 98.71800 }, // Belawan Port
    { latitude: 3.89850, longitude: 98.80000 },
    { latitude: 1.71850, longitude: 101.40833 }, // Dumai Anchorage
    { latitude: 1.70700, longitude: 101.47167 },
    { latitude: 1.70000, longitude: 101.48333 },
    { latitude: 1.70885, longitude: 101.49383 },
    { latitude: 1.17775, longitude: 103.47667 }, // Singapore Straits
    { latitude: 1.15667, longitude: 103.46225 },
    { latitude: 1.13833, longitude: 103.48250 },
    { latitude: 1.13333, longitude: 103.48333 },
    { latitude: 1.12667, longitude: 103.49167 },
    { latitude: 12.75517, longitude: 63.77033 }, // Arabian Sea
    { latitude: 12.64375, longitude: 48.40100 }, // Gulf of Aden
    { latitude: 6.35000, longitude: 50.10000 }, // Around Somalia
    { latitude: 5.86667, longitude: 57.23333 },
    { latitude: 0.58333, longitude: 61.31667 },
    { latitude: -1.26667, longitude: 51.11667 }
  ];

  // Handle SOS button click
  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .post("http://localhost:8000/api/v1/savelocation", { latitude, longitude })
          .then((response) => {
            console.log("Location saved:", response.data);
            toast.success("Your location has been sent successfully!");
          })
          .catch((error) => {
            console.error("Error saving location:", error);
            toast.error("Error sending location!");
          });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to retrieve your location!");
      }
    );
  };

  const handleNearestPort = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .post("http://localhost:8000/api/v1/nearest-port", { latitude, longitude })
          .then((response) => {
            console.log("Location saved:", response.data);
            toast.success("Here is your nearest PORT!");
          })
          .catch((error) => {
            console.error("Error saving location:", error);
            toast.error("Error sending location!");
          });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to retrieve your location!");
      }
    );
  };


  // Get current location of the user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });
    }
  }, []);

  return (
    <>
      <Header />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

      <div className="h-screen flex flex-col lg:flex-row relative">
        {/* Controls */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
          {["GPS", "Pause", "Route"].map((control, idx) => (
            <button
              key={idx}
              className={`p-2 rounded-full shadow-lg ${["bg-green-500", "bg-red-500", "bg-blue-500"][idx]} text-white`}
            >
              {control}
            </button>
          ))}
        </div>

        {/* SOS Button */}
        <div className="absolute bottom-20 left-5 z-50">
          <button onClick={handleSOS} className="p-4 bg-red-500 text-white rounded-full shadow-lg">
            SOS
          </button>
        </div>

        {/* NearestPort Button */}
        <div className="absolute bottom-20 left-80 z-50">
          <button onClick={handleNearestPort} className="p-4 bg-red-500 text-white rounded-full shadow-lg">
           Nearest PORT 
          </button>
        </div>
        {/* Map Section */}
        <div className="lg:w-2/3 relative h-2/3 lg:h-full z-10">
          <MapContainer
            center={userLocation ? [userLocation.lat, userLocation.lon] : [0, 100]}
            zoom={4}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {routes.map((route, index) => {
              const routeNodes = generateRouteNodes(route.map(r => [r.latitude, r.longitude]));
              return (
                <React.Fragment key={index}>
                  <Polyline
                    positions={routeNodes}
                    color={colors[index]}
                    weight={3}
                    dashArray="10, 5"
                  />
                  {/* Only render marker for first and last node */}
                  <Marker position={routeNodes[0]}>
                    <Popup>Source</Popup>
                  </Marker>
                  <Marker position={routeNodes[routeNodes.length - 1]}>
                    <Popup>Destination</Popup>
                  </Marker>
                </React.Fragment>
              );
            })}

            {/* Piracy Location Markers */}
            // Piracy Location Markers
{piracyLocations.map((location, index) => (
  <Marker key={index} position={[location.latitude, location.longitude]} icon={piracyIcon}>
    <Popup> Piracy Zone - 
    Latitude: {location.latitude}
    Longitude: {location.longitude}
    </Popup>
  </Marker>
))}
          </MapContainer>
        </div>
        <div className="lg:w-1/3 bg-gray-100 p-4 overflow-y-auto relative z-20">
          <h3 className="text-lg font-bold mb-4">Route Details</h3>
          <div className="border-t pt-4">
            <ul className="space-y-4">
              {["Chennai", "Sri Lanka", "Perth"].map((location, idx) => (
                <li key={idx} className="border p-2 rounded-lg flex justify-between items-center">
                  <span>{location}</span>
                  <span>Time</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteTracker;
