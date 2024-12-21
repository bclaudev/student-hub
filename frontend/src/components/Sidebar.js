import React from "react";
import { Clipboard, Calendar, Book, Edit, LogOut } from "react-feather";
import { Link, useLocation } from "react-router-dom";
import "../Sidebar.css";
import UserAvatar from "./UserAvatar.js";


const Sidebar = ({ isSidebarMinimized, toggleSidebar }) => {
  const location = useLocation(); // Get current route
  const userName = "Claudia";

  const navItems = [
    { label: "Timetable", icon: Clipboard, path: "/timetable" },
    { label: "Calendar", icon: Calendar, path: "/calendar" },
    { label: "Resources", icon: Book, path: "/resources" },
    { label: "Notebooks", icon: Edit, path: "/notebooks" },
    { label: "Logout", icon: LogOut, path: "/logout" },
  ];

  return (
    <div className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>
      <div className="profile-section flex items-center space-x-4 p-4 border-b border-gray-300">
        <UserAvatar name={userName || "Anonymous"} size={64} />
        {!isSidebarMinimized && (
          <div>
            <p className="text-lg font-semibold">Hello, {userName || "User"}</p>
            <p className="text-sm cursor-pointer">
              Change profile settings
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isSidebarMinimized}
      </div>
      <ul className="mt-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li
              key={item.label}
              className={`flex items-center px-4 py-2 ${
                isActive ? "active" : "inactive"
              }`}
            >
              <Icon size={20} className={`${isActive ? "icon-active" : "icon-inactive"}`} />
              {!isSidebarMinimized && (
                <Link to={item.path} className={`ml-4 ${isActive ? "text-active" : "text-inactive"}`}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
