import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';
import Sidebar from './components/Sidebar.js';
import TimetablePage from './pages/Timetable.js';
import Resources from './pages/Resources.js';
import { useNavigate } from 'react-router-dom';

function App() {
  const location = useLocation(); // Hook to get the current location
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // State to track if the sidebar is minimized
  const [user, setUser] = useState(null); // State to track the logged-in user
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to fetch the current user from the backend
  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      return null;
    }
  };

  // Effect to fetch the user when the location changes, except for login and create-account pages
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/create-account') {
      fetchUser();
    }
  }, [location.pathname]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
        setUser(null);
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Show loading message while fetching user data
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // Determine if the sidebar should be shown
  const showSidebar = user && !['/login', '/create-account'].includes(location.pathname);

  return (
    <div className="app flex">
      {showSidebar && (
        <Sidebar
          user={user}
          setUser={setUser}
          isSidebarMinimized={isSidebarMinimized}
          toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
          handleLogout={handleLogout}
        />
      )}
      <div className={`flex-1 ${showSidebar ? (isSidebarMinimized ? 'ml-[64px]' : 'ml-[262px]') : ''}`}>
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} fetchUser={fetchUser} />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route
            path="/calendar"
            element={
              <HomePage user={user} setUser={setUser} handleLogout={handleLogout} />
            }
          />
          <Route path="/resources" element={<Resources /> } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
