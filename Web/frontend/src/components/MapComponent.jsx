import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  return (
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
  );
};

export default MapComponent;
