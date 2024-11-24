import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProgressBar = ({ currentStep }) => {
  const navigate = useNavigate();

  const steps = [
    { name: 'Ship Type Selection', path: '/select-ship' },
    { name: 'Fuel Consumption', path: '/fuel-consumption' },
    { name: 'Engine Power & Speed', path: '/engine-power-speed' },
    { name: 'Enter the Locations', path: '/enter-locations' },
    { name: 'Select Your Priorities', path: '/select-priorities' },
    { name: 'Optimized Route', path: '/optimize-path' },
  ];

  const handleStepClick = (path) => {
    navigate(path);
  };

  return (
    <div className="flex justify-center items-center py-4 space-x-4 bg-white shadow-md">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleStepClick(step.path)}
        >
          <FaCheckCircle
            className={index <= currentStep ? 'text-blue-600' : 'text-gray-400'}
            size={28}
          />
          <p className={`font-medium ${index <= currentStep ? '' : 'text-gray-400'}`}>
            {step.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
