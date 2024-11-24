import React from 'react'
import { Link  } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoLocationSharp } from 'react-icons/io5';
import ProgressBar from '../components/ProgressBar';
const Header = () => {
  return (
    <header className="bg-[#0076c8] p-4 flex justify-between items-center">
    {/* <div className="text-white text-lg font-bold">Logo</div> */}
    <div className="flex items-center">
      <Link to="/">
        <img
          src="/logo-quester.png" // Make sure the logo file is in the 'public' folder
          alt="Logo"
          className="h-10 w-auto" // Adjust height and width as needed
        />
        </Link>
      </div>
    <nav className="hidden md:flex space-x-8 text-white">
      <Link to="/" className="hover:text-blue-300">Home</Link>
      <Link to="/maps" className="hover:text-blue-300">Map</Link>
      <Link to="/about" className="hover:text-blue-300">About</Link>
      <Link to="/faqs" className="hover:text-blue-300">FAQ'S</Link>
    </nav>
    <button className="text-white md:hidden">
      <AiOutlineMenu size={24} />
    </button>
    <div className="hidden md:flex items-center">
      <a href="#contact" className="bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200">
        Contact Us
      </a>
    </div>
  </header>
  )
}

export default Header