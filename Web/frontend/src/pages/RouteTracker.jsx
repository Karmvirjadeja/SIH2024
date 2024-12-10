// import React from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import Header from "../components/Header";

// function generateRouteNodes(route, segmentLength = 111) {
//   const nodes = [route[0]];
//   for (let i = 0; i < route.length - 1; i++) {
//     const start = route[i];
//     const end = route[i + 1];
//     const totalDistance = haversine(start[0], start[1], end[0], end[1]);
//     const numSegments = Math.ceil(totalDistance / segmentLength);
//     for (let j = 1; j < numSegments; j++) {
//       const fraction = j / numSegments;
//       const lat = start[0] + fraction * (end[0] - start[0]);
//       const lon = start[1] + fraction * (end[1] - start[1]);
//       nodes.push([lat, lon]);
//     }
//   }
//   nodes.push(route[route.length - 1]);
//   return nodes;
// }

// function haversine(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of Earth in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// const RouteTracker = () => {
//   const routes = [
//     [
//       [13.0827, 80.2707], // Chennai
//       [10.0, 98.0],       // Andaman Sea
//       [-6.0, 110.0],      // South Java Sea
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [12.0, 90.0],       // Bay of Bengal
//       [0.0, 100.0],       // Southern Indian Ocean
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [5.0, 90.0],        // Central Indian Ocean
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [8.0, 95.0],        // East Indian Ocean
//       [0.0, 105.0],       // South of Indonesia
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [10.0, 100.0],      // Bay of Bengal
//       [-5.0, 110.0],      // South Java Sea
//       [-35.0, 120.0],     // South of Australia
//       [-31.9505, 115.8605] // Perth
//     ]
//   ];

//   const colors = ["blue", "green", "red", "orange", "purple"];

// return (
//   <>
//   <Header/>
//   <div className="h-screen flex flex-col lg:flex-row">
//     {/* Map Section */}
//     <div className="lg:w-2/3 relative h-2/3 lg:h-full">
//       <MapContainer center={[0, 100]} zoom={4} className="w-full h-full">
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {routes.map((route, index) => {
//           const routeNodes = generateRouteNodes(route);
//           return (
//             <React.Fragment key={index}>
//               <Polyline
//                 positions={route}
//                 color={colors[index]}
//                 weight={3}
//                 dashArray="10, 5"
//               />
//               {routeNodes.map((node, idx) => (
//                 <Marker key={idx} position={node}>
//                   <Popup>Node {idx + 1}</Popup>
//                 </Marker>
//               ))}
//             </React.Fragment>
//           );
//         })}
//         <Marker position={[13.0827, 80.2707]}>
//           <Popup>Port of Chennai</Popup>
//         </Marker>
//         <Marker position={[-31.9505, 115.8605]}>
//           <Popup>Port of Perth</Popup>
//         </Marker>
//       </MapContainer>

//       {/* Weather Forecast */}
//       <div className="absolute top-5 right-5 bg-blue-200 p-4 rounded-lg shadow-lg backdrop-blur-md z-20">
//         <h4 className="font-bold mb-2 text-center">Weather Forecast</h4>
//         <div className="grid grid-cols-5 gap-2">
//           {/* Weather Items */}
//           {["8:00", "10:00", "12:00", "14:00", "Now"].map((time, idx) => (
//             <div className="text-center" key={idx}>
//               <p>{time}</p>
//               <p>{["☁️", "🌥️", "🌤️", "☀️", "☀️"][idx]}</p>
//               <p>{[21, 22, 24, 26, 25][idx]}°C</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
//         {["GPS", "Pause", "Route"].map((control, idx) => (
//           <button
//             key={idx}
//             className={`p-2 rounded-full shadow-lg ${
//               ["bg-green-500", "bg-red-500", "bg-blue-500"][idx]
//             } text-white`}
//           >
//             {control}
//           </button>
//         ))}
//       </div>
//     </div>

//     {/* Route Details Sidebar */}
//     <div className="lg:w-1/3 bg-gray-100 p-4 overflow-y-auto relative z-20">
//       <h3 className="text-lg font-bold mb-4">Route Details</h3>
//       <div className="border-t pt-4">
//         <div className="flex items-center gap-4 mb-4">
//           <img
//             src="https://via.placeholder.com/100"
//             alt="Ship"
//             className="w-20 h-20 object-cover rounded-md"
//           />
//           <div>
//             <h4 className="font-semibold">From Vishakhapatnam to Indonesia</h4>
//             <p>Saturday, 29 June</p>
//           </div>
//         </div>
//         <ul className="space-y-4">
//           {[
//             "Port of Vishakhapatnam, India",
//             "Bay of Bengal",
//             "Andaman Sea",
//             "Strait of Malacca",
//             "South China Sea",
//             "Strait of Singapore",
//             "Port of Batam, Indonesia",
//           ].map((location, idx) => (
//             <li
//               key={idx}
//               className="border p-2 rounded-lg flex justify-between items-center"
//             >
//               <span>{location}</span>
//               <span>16:09h</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   </div>
//   </>
// );
// };
// export default RouteTracker;
// import React from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import Header from "../components/Header"; // Adjust the path as necessary
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
// import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

// function generateRouteNodes(route, segmentLength = 111) {
//   const nodes = [route[0]];
//   for (let i = 0; i < route.length - 1; i++) {
//     const start = route[i];
//     const end = route[i + 1];
//     const totalDistance = haversine(start[0], start[1], end[0], end[1]);
//     const numSegments = Math.ceil(totalDistance / segmentLength);
//     for (let j = 1; j < numSegments; j++) {
//       const fraction = j / numSegments;
//       const lat = start[0] + fraction * (end[0] - start[0]);
//       const lon = start[1] + fraction * (end[1] - start[1]);
//       nodes.push([lat, lon]);
//     }
//   }
//   nodes.push(route[route.length - 1]);
//   return nodes;
// }

// function haversine(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of Earth in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// const RouteTracker = () => {
//   const routes = [
//     [
//       [13.0827, 80.2707], // Chennai
//       [10.0, 98.0],       // Andaman Sea
//       [-6.0, 110.0],      // South Java Sea
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [12.0, 90.0],       // Bay of Bengal
//       [0.0, 100.0],       // Southern Indian Ocean
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [5.0, 90.0],        // Central Indian Ocean
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [8.0, 95.0],        // East Indian Ocean
//       [0.0, 105.0],       // South of Indonesia
//       [-31.9505, 115.8605] // Perth
//     ],
//     [
//       [13.0827, 80.2707], // Chennai
//       [10.0, 100.0],      // Bay of Bengal
//       [-5.0, 110.0],      // South Java Sea
//       [-35.0, 120.0],     // South of Australia
//       [-31.9505, 115.8605] // Perth
//     ]
//   ];

//   const colors = ["blue", "green", "red", "orange", "purple"];

//   const handleSOS = () => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       axios.post('http://localhost:8000/api/v1/savelocation', { latitude, longitude })
//         .then(response => {
//           console.log('Location saved:', response.data);
//           toast.success('Your location has been sent successfully!'); // Show success toast
//         })
//         .catch(error => {
//           console.error('Error saving location:', error);
//           toast.error('Error sending location!'); // Show error toast
//         });
//     }, (error) => {
//       console.error('Error getting location:', error);
//       toast.error('Unable to retrieve your location!'); // Show error toast for geolocation failure
//     });
//   };

// return (
//     <>
//       <Header />
      
//       {/* Toast Container */}
//       <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

//       <div className="h-screen flex flex-col lg:flex-row">
//         {/* Map Section */}
//         <div className="lg:w-2/3 relative h-2/3 lg:h-full">
//           <MapContainer center={[0, 100]} zoom={4} className="w-full h-full">
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             {routes.map((route, index) => {
//               const routeNodes = generateRouteNodes(route);
//               return (
//                 <React.Fragment key={index}>
//                   <Polyline
//                     positions={route}
//                     color={colors[index]}
//                     weight={3}
//                     dashArray="10, 5"
//                   />
//                   {routeNodes.map((node, idx) => (
//                     <Marker key={idx} position={node}>
//                       <Popup>Node {idx + 1}</Popup>
//                     </Marker>
//                   ))}
//                 </React.Fragment>
//               );
//             })}
//             <Marker position={[13.0827, 80.2707]}>
//               <Popup>Port of Chennai</Popup>
//             </Marker>
//             <Marker position={[-31.9505, 115.8605]}>
//               <Popup>Port of Perth</Popup>
//             </Marker>
//           </MapContainer>

//           {/* Weather Forecast */}
//           <div className="absolute top-5 right-5 bg-blue-200 p-4 rounded-lg shadow-lg backdrop-blur-md z-20">
//             <h4 className="font-bold mb-2 text-center">Weather Forecast</h4>
//             <div className="grid grid-cols-5 gap-2">
//               {/* Weather Items */}
//               {["8:00", "10:00", "12:00", "14:00", "Now"].map((time, idx) => (
//                 <div className="text-center" key={idx}>
//                   <p>{time}</p>
//                   <p>{["☁️", "🌥️", "🌤️", "☀️", "☀️"][idx]}</p>
//                   <p>{[21, 22, 24, 26, 25][idx]}°C</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
//   {["GPS", "Pause", "Route"].map((control, idx) => (
//     <button
//       key={idx}
//       className={`p-3 rounded-full shadow-lg ${
//         ["bg-green-500", "bg-red-500", "bg-blue-500"][idx]
//       } text-white hover:scale-105 transition-transform`}
//     >
//       {control}
//     </button>
//   ))}
// </div>

//           {/* SOS Button */}
//           <div className="absolute top-5 left-5 z-50">
//   <button
//     onClick={handleSOS}
//     className="p-4 bg-red-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
//   >
//     SOS
//   </button>
// </div>

//         {/* Route Details Sidebar */}
//         <div className="lg:w-1/3 bg-gray-100 p-4 overflow-y-auto relative z-20">
//           <h3 className="text-lg font-bold mb-4">Route Details</h3>
//           <div className="border-t pt-4">
//             <div className="flex items-center gap-4 mb-4">
//               <img
//                 src="https://via.placeholder.com/100"
//                 alt="Ship"
//                 className="w-20 h-20 object-cover rounded-md"
//               />
//               <div>
//                 <h4 className="font-semibold">From Vishakhapatnam to Indonesia</h4>
//                 <p>Saturday, June XX</p> {/* Update date as needed */}
//               </div>
//             </div>
//             <ul className="space-y-4">
//               {[
//                 "Port of Vishakhapatnam, India",
//                 "Bay of Bengal",
//                 "Andaman Sea",
//                 "Strait of Malacca",
//                 "South China Sea",
//                 "Strait of Singapore",
//                 "Port of Batam, Indonesia",
//               ].map((location, idx) => (
//                 <li key={idx} className="border p-2 rounded-lg flex justify-between items-center">
//                   <span>{location}</span>
//                   <span>16:09h</span> {/* Update time as needed */}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </>
// );
// };

// export default RouteTracker;

import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header"; // Adjust the path as necessary
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function generateRouteNodes(route, segmentLength = 111) {
  const nodes = [route[0]];
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
  nodes.push(route[route.length - 1]);
  return nodes;
}

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
  const routes = [
    [
      [13.0827, 80.2707], // Chennai
      [10.0, 98.0], // Andaman Sea
      [-6.0, 110.0], // South Java Sea
      [-31.9505, 115.8605], // Perth
    ],
    [
      [13.0827, 80.2707], // Chennai
      [12.0, 90.0], // Bay of Bengal
      [0.0, 100.0], // Southern Indian Ocean
      [-31.9505, 115.8605], // Perth
    ],
  ];

  const colors = ["blue", "green"];

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
              className={`p-2 rounded-full shadow-lg ${
                ["bg-green-500", "bg-red-500", "bg-blue-500"][idx]
              } text-white`}
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

        {/* Map Section */}
        <div className="lg:w-2/3 relative h-2/3 lg:h-full z-10">
          <MapContainer center={[0, 100]} zoom={4} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {routes.map((route, index) => {
              const routeNodes = generateRouteNodes(route);
              return (
                <React.Fragment key={index}>
                  <Polyline
                    positions={route}
                    color={colors[index]}
                    weight={3}
                    dashArray="10, 5"
                  />
                  {routeNodes.map((node, idx) => (
                    <Marker key={idx} position={node}>
                      <Popup>Node {idx + 1}</Popup>
                    </Marker>
                  ))}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Route Details Sidebar */}
        <div className="lg:w-1/3 bg-gray-100 p-4 overflow-y-auto relative z-20">
          <h3 className="text-lg font-bold mb-4">Route Details</h3>
          <div className="border-t pt-4">
            <ul className="space-y-4">
              {["Port A", "Point B", "Destination"].map((location, idx) => (
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
