import React, { useEffect } from 'react'; // Ensure useEffect is imported
import { Clipboard, Calendar, Book, Edit, LogOut , ChevronRight , ChevronLeft} from "react-feather";
import { Link, useLocation } from "react-router-dom";
import "../Sidebar.css";
import UserAvatar from "./UserAvatar.js";


const Sidebar = ({ isSidebarMinimized, toggleSidebar, user, handleLogout }) => {
  useEffect(() => {
    console.log('Sidebar updated user:', user);
  }, [user]);
  const location = useLocation();
  console.log('setUser in Sidebar.js:', typeof handleLogout);
  console.log(user);

  const userName = user?.firstName || "User";

  const navItems = [
    { label: "Timetable", icon: Clipboard, path: "/timetable" },
    { label: "Calendar", icon: Calendar, path: "/calendar" },
    { label: "Resources", icon: Book, path: "/resources" },
    { label: "Notebooks", icon: Edit, path: "/notebooks" },
    { label: "Logout", icon: LogOut, action: handleLogout }, // Use prop handleLogout
  ];

  return (
    <div className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>

      <div className={`profile-section ${isSidebarMinimized ? "minimized-profile" : ""}`}>
        <UserAvatar name={userName} size={42} />
        {!isSidebarMinimized && (
          <div class="profile-details">
            <p className="text-lg font-semibold">Hello, {userName}</p>
            <button className="profile-settings">Change profile settings</button>
          </div>
        )}
      </div>
      <ul className={`nav-items ${isSidebarMinimized ? "centered-icons" : ""}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li
              key={item.label}
              className={`flex items-center ${
                isSidebarMinimized ? "justify-center" : "px-4"
              } py-2 ${isActive ? "active" : "inactive"}`}
              onClick={item.action ? item.action : undefined} 
            >
              <Link
                to={item.action ? "#" : item.path} 
                className={`flex justify-center items-center ${
                  isSidebarMinimized ? "icon-link-minimized" : "ml-4"
                }`}
                onClick={item.action ? item.action : undefined} 
              >
                <Icon
                  size={20}
                  className={`${isActive ? "icon-active" : "icon-inactive"}`}
                />
                {!isSidebarMinimized && (
                  <span className={`${isActive ? "text-active" : "text-inactive"}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Minimize Button at Bottom */}
      <div className="minimize-icon-container">
        {isSidebarMinimized ? (
          <ChevronRight
            size={24}
            onClick={toggleSidebar}
            className="minimize-icon"
            aria-label="Expand Sidebar"
          />
        ) : (
          <ChevronLeft
            size={24}
            onClick={toggleSidebar}
            className="minimize-icon"
            aria-label="Minimize Sidebar"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
