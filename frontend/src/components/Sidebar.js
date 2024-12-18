import React from "react";
import { Menu, Home, Calendar, User } from "react-feather";
import { Link } from "react-router-dom";
import "../Sidebar.css";

const Sidebar = ({ isSidebarMinimized, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isSidebarMinimized && <span className="text-lg font-bold">Menu</span>}
        <button onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        <li className="flex items-center px-4 py-2 hover:bg-gray-700">
          <Home size={20} />
          {!isSidebarMinimized && <span className="ml-4">Home</span>}
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700">
          <Calendar size={20} />
          {!isSidebarMinimized && <span className="ml-4">Calendar</span>}
        </li>
        <li className="flex items-center px-4 py-2 hover:bg-gray-700">
          <User size={20} />
          {!isSidebarMinimized && <span className="ml-4">Profile</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
