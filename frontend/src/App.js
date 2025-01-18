// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';
import Sidebar from './components/Sidebar.js';
import { useNavigate } from 'react-router-dom'; 

function App() {
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
        console.error('Failed to fetch user:', response.statusText);
        setUser(null);
        navigate('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      navigate('/login'); // Redirect to login
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const location = useLocation();
  const showSidebar = user && location.pathname !== '/login' && location.pathname !== '/create-account';

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

  return (
    <div className="app flex">
      {showSidebar && user && (
        <Sidebar
          isSidebarMinimized={isSidebarMinimized}
          toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
          user={user}
          setUser={setUser}
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
