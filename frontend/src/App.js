// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';
import Sidebar from './components/Sidebar.js';
import { useNavigate } from 'react-router-dom';

function App() {
  const location = useLocation(); // Declare location at the top
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.warn('User not authenticated. Redirecting to login...');
        setUser(null);
        navigate('/login'); // Only redirect if not already on login
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login"); // Redirect to login
        setTimeout(() => setUser(null), 0); // Clear user state
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location.pathname]); // Use location.pathname safely after declaration

  const showSidebar = user && location.pathname !== '/login' && location.pathname !== '/create-account';

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

  console.log('setUser in App.js:', typeof setUser);

  return (
    <div className="app flex">
      {showSidebar && user && (
        <Sidebar
          user={user}
          setUser={setUser}
          isSidebarMinimized={isSidebarMinimized}
          toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
          handleLogout={handleLogout} // Pass handleLogout as a prop
        />
      )}
      <div className={`flex-1 ${isSidebarMinimized ? 'ml-[64px]' : 'ml-[256px]'}`}>
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/calendar" element={<ProtectedRoute element={<HomePage />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
