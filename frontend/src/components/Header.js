// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../style.css';

const Header = ({ linkText, linkUrl }) => {
  return (
    <header className="header">
      <img 
        src={logo} 
        alt="Logo" 
        className="header-logo"
      />
      <Link to={linkUrl} className="header-link">
        {linkText}
      </Link>
    </header>
  );
};

export default Header;
