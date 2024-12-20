// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import CreateAccountPage from './pages/CreateAccountPage.js';
import HomePage from './pages/HomePage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/calendar" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
