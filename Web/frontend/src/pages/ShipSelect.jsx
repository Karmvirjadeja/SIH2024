import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaShip } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";
import backgroundImage from "../assets/Sea.jpg";

const ShipSelectionPage = () => {
  const [selectedShip, setSelectedShip] = useState(null); // Start with null to display options initially
  const navigate = useNavigate();

  const ships = [
    { name: "SCI Chennai", icon: <FaShip /> },
    { name: "SCI Bangalore" },
    { name: "SCI Kochi" },
    { name: "SCI Ganga" },
    { name: "SCI Saraswati" },
    { name: "SCI Kutch" },
    { name: "SCI Pawan" },
    { name: "SCI Pride" },
    { name: "SCI Vijay" },
    { name: "SCI Varuna" },
    { name: "FerriersSCI Yamuna" },
    { name: "Bulk Carriers" },
  ];

  const shipDetails = {
    "SCI Chennai": {
      length: "264 meters",
      beam: "32.2 meters",
      grossTonnage: "43,679 tons",
      deadweight: "57,813 tons",
      containerCapacity: "4,469 TEU",
      yearBuilt: "2008",
      hullDesign: "Optimized for cargo capacity and stability.",
    },
    // Add other ships' details as necessary
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && selectedShip) {
      navigate("/fuel-consumption", { state: { selectedShip } });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShip]);

  const handleNext = () => {
    navigate("/fuel-consumption", { state: { selectedShip } });
  };

  return (
    <>
      <Header />
      <div
        className="h-screen flex flex-col"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <ProgressBar currentStep={0} />
        <div className="flex flex-col overflow-hidden flex-grow justify-center items-center text-center">
          {/* Conditionally Render the Ship Selection or Ship Details */}
          {!selectedShip ? (
            <>
              <div className="px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Select Your Ship Type
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Choose the type of ship from the options below to tailor the
                  optimization algorithm for your ship’s specific needs.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {ships.map((ship) => (
                  <button
                    key={ship.name}
                    onClick={() => setSelectedShip(ship.name)}
                    className={`p-4 w-full max-w-xs rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-start space-x-4 ${
                      selectedShip === ship.name
                        ? "bg-blue-500 text-white shadow-lg ring ring-blue-200 ring-offset-2"
                        : "bg-white text-gray-700 border border-gray-300"
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
            </>
          ) : (
            <div
              className="mt-[-40px] p-6 max-w-md bg-white rounded-lg shadow-xl text-left flex flex-col  justify-center"
              style={{ position: "relative" }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedShip} Details
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Length:</strong> {shipDetails[selectedShip].length}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Beam:</strong> {shipDetails[selectedShip].beam}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Gross Tonnage:</strong>{" "}
                {shipDetails[selectedShip].grossTonnage}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Deadweight:</strong>{" "}
                {shipDetails[selectedShip].deadweight}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Container Capacity:</strong>{" "}
                {shipDetails[selectedShip].containerCapacity}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Year Built:</strong>{" "}
                {shipDetails[selectedShip].yearBuilt}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Hull Design:</strong>{" "}
                {shipDetails[selectedShip].hullDesign}
              </p>

              <div className="flex justify-center w-full mt-4">
                <button
                  onClick={handleNext}
                  className="py-2 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShipSelectionPage;
