import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import NotificationCard from "../components/NotificationCard.js";
import Header from "../components/Header.js";
import { useNavigate } from "react-router-dom";
import { User, Key } from "react-feather";
import { handleGoogleLoginSuccess } from "./LoginPage/handleGoogleLoginSuccess.js";

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setNotification({
        message: "Please provide both email and password.",
        borderColor: "#8D0C0C",
        bgColor: "#E3D8D8",
        textColor: "#6A0202",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are included
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Update user state in the parent component
        navigate("/calendar"); // Redirect to /calendar after successful login
      } else {
        const errorData = await response.json();
        setNotification({
          message: errorData.message || "Login failed. Please try again.",
          borderColor: "#8D0C0C",
          bgColor: "#E3D8D8",
          textColor: "#6A0202",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setNotification({
        message: "An error occurred. Please try again later.",
        borderColor: "#8D0C0C",
        bgColor: "#E3D8D8",
        textColor: "#6A0202",
      });
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <Header linkText="Create an account" linkUrl="/create-account" />
      <div className="login-page flex items-center justify-center min-h-screen bg-white">
        <div>
          <h2 className="text-[20px] font-bold text-center mb-6">Login</h2>

          {/* Google sign-in */}
          <div className="flex justify-center mt-6">
            <div style={{ width: "210px" }}>
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  handleGoogleLoginSuccess(credentialResponse, setNotification)
                }
                onError={() => console.log("Google login failed")}
                shape="rectangular"
                size="large"
                theme="outline"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-300 w-full" />

          {/* Email and Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User
                color="#A585FF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-[345px] pl-10 mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                placeholder="Email"
              />
            </div>
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
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
