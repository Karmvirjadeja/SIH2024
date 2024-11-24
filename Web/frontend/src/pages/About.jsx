import React from 'react';
import Header from '../components/Header';
const About = () => {
  return (
    <>
    <Header/>
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">About Our Company</h1>
          <p className="text-lg text-gray-700 mb-6">
            At [Your Ship Company Name], we are committed to providing the best maritime services in the industry.
            With decades of experience and a passion for innovation, our mission is to deliver
            reliable, efficient, and sustainable solutions to our clients around the globe.
          </p>
        </div>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To be the leading provider of maritime solutions, ensuring safe and efficient operations across the world's oceans.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h2>
              <p className="text-gray-700">
                To innovate and lead the maritime industry by setting standards in quality, safety, and environmental care.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Values</h2>
              <p className="text-gray-700">
                Integrity, innovation, and excellence are at the core of everything we do. We are committed to building a sustainable future for the maritime industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
};

export default About;
