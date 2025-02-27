import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';
import Sidebar from './components/Sidebar.js';
import { useNavigate } from 'react-router-dom';

function App() {
  const location = useLocation();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

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
      <div className={`flex-1 ${isSidebarMinimized ? 'ml-[64px]' : 'ml-[262px]'}`}>
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} fetchUser={fetchUser} />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route
            path="/calendar"
            element={
              <HomePage user={user} setUser={setUser} handleLogout={handleLogout} />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
