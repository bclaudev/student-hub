import React, { useState } from 'react';
import NotificationCard from '../components/NotificationCard.js';
import Header from '../components/Header.js';
import { useNavigate } from 'react-router-dom';
import { User, Key } from 'react-feather';
import '../style.css';

function LoginPage({ setUser, fetchUser }) { 
  const [email, setEmail] = useState(''); // State to track the email input
  const [password, setPassword] = useState(''); // State to track the password input
  const [notification, setNotification] = useState(null); // State to track notifications
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handler for the login form submission
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload

    // Validate email and password fields
    if (!email || !password) {
      setNotification({
        message: 'Please provide both email and password.',
        variant: 'error',
      });
      return;
    }

    try {
      console.log("Sending login request...");
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password in the request body
      });

      console.log("Response received:", response.status);

      if (response.ok) {
        console.log("Login successful! Fetching user data...");
  
        if (!fetchUser) {
          console.error("fetchUser() is not available as a prop.");
          return;
        }
  
        const userData = await fetchUser(); // Fetch user data after successful login
  
        if (userData) {
          console.log("User data fetched:", userData);
          navigate('/calendar'); // Navigate to the calendar page
          console.log("Navigating to /calendar");
        } else {
          console.error("fetchUser() returned null, not redirecting.");
        }
      } else {
        const errorData = await response.json();
        setNotification({
          message: 'Login failed. Please check your credentials and try again.',
          variant: 'error', 
        });
        
        console.error("Login failed:", errorData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setNotification({
        message: 'Error during login. Please try again later.',
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Header linkText="Create an account" linkUrl="/create-account" />
      <div className="login-page">
        <div>
          <h2 className="login-title">Login</h2>

          <form onSubmit={handleLogin} className="login-form">
            {/* Email Field */}
            <div className="input-container">
              <User color="#A585FF" className="icon" size={16} />
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Email"
              />
            </div>

            {/* Password Field */}
            <div className="input-container">
              <Key color="#A585FF" className="icon" size={16} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Password"
              />
            </div>

            <div className="login-button-container">
              <button type="submit" className="loginBtn">
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Notification Card */}
        {notification && (
          <NotificationCard
            message={notification.message}
            variant={notification.variant}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}

export default LoginPage;
