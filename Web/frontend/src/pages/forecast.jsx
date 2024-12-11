import React from 'react';
import Header from '../components/Header';
import backgroundImage from '../assets/Sea.jpg';
const About = () => {
  return (
    <>
    <Header/>
    <div className="bg-gray-100 min-h-screen py-12"
    style={{ backgroundImage: `url(${backgroundImage})` }}>

    </div></>
  );
};

export default About;

