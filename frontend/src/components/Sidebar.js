import React from "react";
import { Clipboard, Calendar, Book, Edit, LogOut } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";
import "../Sidebar.css";
import UserAvatar from "./UserAvatar.js";

const Sidebar = ({ isSidebarMinimized, toggleSidebar, user }) => {
  console.log("Sidebar user prop:", user); // Debugging

  const location = useLocation();
  const navigate = useNavigate();
  const userName = user?.name?.split(" ")[0] || "User";

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    { label: "Timetable", icon: Clipboard, path: "/timetable" },
    { label: "Calendar", icon: Calendar, path: "/calendar" },
    { label: "Resources", icon: Book, path: "/resources" },
    { label: "Notebooks", icon: Edit, path: "/notebooks" },
    { label: "Logout", icon: LogOut, action: handleLogout },
  ];

  return (
    <div className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>
      <div className="profile-section flex items-center space-x-4 p-4 border-b border-gray-300">
        <UserAvatar name={userName} size={64} />
        {!isSidebarMinimized && (
          <div>
            <p className="text-lg font-semibold">Hello, {userName}</p>
          </div>
        )}
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
              onClick={item.action ? item.action : undefined}
            >
              <Icon size={20} className={`${isActive ? "icon-active" : "icon-inactive"}`} />
              {!isSidebarMinimized && (
                <span className={`ml-4 ${isActive ? "text-active" : "text-inactive"}`}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
