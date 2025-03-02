import React, { useState } from 'react';
import NotificationCard from '../components/NotificationCard.js';
import Header from '../components/Header.js';
import { useNavigate } from 'react-router-dom';
import { User, Key } from 'react-feather';

function LoginPage({ setUser, fetchUser }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload

    if (!email || !password) {
      setNotification({
        message: 'Please provide both email and password.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
      return;
    }

    try {
      console.log("Sending login request...");
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response received:", response.status);

      if (response.ok) {
        console.log("✅ Login successful! Fetching user data...");
  
        if (!fetchUser) {
          console.error("❌ fetchUser() is not available as a prop.");
          return;
        }
  
        const userData = await fetchUser(); // ✅ Fetch user after login
  
        if (userData) {
          console.log("✅ User data fetched:", userData);
          navigate('/calendar'); // ✅ Redirect after user data is confirmed
          console.log("🚀 Navigating to /calendar");
        } else {
          console.error("❌ fetchUser() returned null, not redirecting.");
        }
      } else {
        const errorData = await response.json();
        setNotification({
          message: errorData.message || 'Login failed. Please try again.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
        console.error("❌ Login failed:", errorData.message);
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
      setNotification({
        message: 'An error occurred. Please try again later.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  };

  return (
    <>
      <Header linkText="Create an account" linkUrl="/create-account" />
      <div className="login-page flex items-center justify-center min-h-screen bg-white">
        <div>
          <h2 className="text-[20px] font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <User
                color="#A585FF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-[345px] pl-10 mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                placeholder="Email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Key
                color="#A585FF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-[345px] pl-10 mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                placeholder="Password"
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-[155px] bg-customPurple text-white py-2 px-4 rounded-[25px] hover:bg-[#8060DB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Notification Card */}
        {notification && (
          <NotificationCard
            message={notification.message}
            borderColor={notification.borderColor}
            bgColor={notification.bgColor}
            textColor={notification.textColor}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}

export default LoginPage;
