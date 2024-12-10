import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#0076c8] p-4 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/logo-quester.png"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center flex-grow space-x-8 text-white">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        <Link to="/maps" className="hover:text-blue-300">Map</Link>
        <Link to="/about" className="hover:text-blue-300">About</Link>
        <Link to="/faqs" className="hover:text-blue-300">FAQ'S</Link>
        <a
          href="#contact"
          className="bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200"
        >
          Contact Us
        </a>
      </nav>

      {/* Hamburger Menu Button */}
      <button
        className="text-white md:hidden ml-4"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0076c8] text-white md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link to="/" className="hover:text-blue-300" onClick={toggleMenu}>Home</Link>
            <Link to="/maps" className="hover:text-blue-300" onClick={toggleMenu}>Map</Link>
            <Link to="/about" className="hover:text-blue-300" onClick={toggleMenu}>About</Link>
            <Link to="/faqs" className="hover:text-blue-300" onClick={toggleMenu}>FAQ'S</Link>
            <a
              href="#contact"
              className="bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200"
              onClick={toggleMenu}
            >
              Contact Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
