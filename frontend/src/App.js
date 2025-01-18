import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import CreateAccountPage from "./pages/CreateAccountPage.js";
import HomePage from "./pages/HomePage.js";
import Sidebar from "./components/Sidebar.js";

function AppLayout({ user, setUser, isSidebarMinimized, toggleSidebar }) {
  const location = useLocation();
  const showSidebar =
    user && location.pathname !== "/login" && location.pathname !== "/create-account";

  return (
    <div className="app flex">
      {showSidebar && (
        <Sidebar
          isSidebarMinimized={isSidebarMinimized}
          toggleSidebar={toggleSidebar}
          user={user}
        />
      )}
      <div
        className={`main-content flex-1 ${
          showSidebar ? (isSidebarMinimized ? "ml-[64px]" : "ml-[256px]") : ""
        }`}
      >
        <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route
            path="/calendar"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set user if authenticated
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <AppLayout
        user={user}
        setUser={setUser}
        isSidebarMinimized={isSidebarMinimized}
        toggleSidebar={() => setIsSidebarMinimized(!isSidebarMinimized)}
      />
    </Router>
  );
}

export default App;
