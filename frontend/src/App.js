// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';
import Sidebar from './components/Sidebar.js';

function App() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [user, setUser] = useState(null); // Initialize user state

  // Fetch user data when the app loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Update the user state
        } else {
          console.error('Failed to fetch user:', response.statusText);
          setUser(null); // Reset the user state on failure
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null); // Reset the user state on error
      }
    };

    fetchUser();
  }, []);

  const location = useLocation(); // Use location inside Router context

  // Sidebar should be displayed only on specific pages
  const showSidebar = user && location.pathname !== '/login' && location.pathname !== '/create-account';

  return (
    <div className="app flex">
      {showSidebar && (
        <Sidebar
          isSidebarMinimized={isSidebarMinimized}
          toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
          user={user} // Pass user data to the Sidebar
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarMinimized ? 'ml-[64px]' : 'ml-[256px]'}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/calendar" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
