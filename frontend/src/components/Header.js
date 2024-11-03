// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = ({ linkText, linkUrl }) => {
  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center pt-[30px] px-[40px] w-full">
      <img 
        src={logo} 
        alt="Logo" 
        className="h-5" // Adjust height if necessary
      />
      <Link to={linkUrl} className="text-[#A585FF] hover:underline text-[12px]">
        {linkText}
      </Link>
    </header>
  );
};

export default Header;
