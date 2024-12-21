// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';
import Sidebar from './components/Sidebar.js';

function App() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <Router>
      <div className="app flex">
        {/* Sidebar displayed only on pages requiring it */}
        <Routes>
          <Route
            path="/calendar"
            element={
              <Sidebar
                isSidebarMinimized={isSidebarMinimized}
                toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
                userName="John Doe" // Example user name
              />
            }
          />
        </Routes>

        {/* Main Content */}
        <div className={`flex-1 ${isSidebarMinimized ? 'ml-[64px]' : 'ml-[256px]'}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/calendar" element={<HomePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
