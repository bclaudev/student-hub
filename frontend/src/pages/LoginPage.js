// src/pages/LoginPage.js

import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle OTP request
  const handleOtpRequest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrPhone })
      });

      if (response.ok) {
        setOtpRequested(true); // Show OTP input field
        setErrorMessage('');   // Clear any previous error message
        console.log(`OTP requested for ${usernameOrPhone}`);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setErrorMessage('An error occurred while sending OTP. Please try again.');
    }
  };

  // Function to handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrPhone, otp })
      });

      const data = await response.json();
      if (response.ok) {
        alert("OTP verified! Logging in...");
        window.location.href = "/dashboard"; // Redirect to the dashboard or main app page
      } else {
        setErrorMessage(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch('http://localhost:4000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="669883299394-msg0alvbmcq3neuc1tbusjmb283gl9c3.apps.googleusercontent.com">
      <div className="login-page flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

          {/* Username or Phone Number Form */}
          <form onSubmit={otpRequested ? handleOtpSubmit : handleOtpRequest} className="space-y-4">
            <div>
              <input
                type="text"
                id="usernameOrPhone"
                value={usernameOrPhone}
                onChange={(e) => setUsernameOrPhone(e.target.value)}
                className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none"
                placeholder="Enter username or phone number"
                required
              />
            </div>

            {/* OTP Input Field (only shows if OTP has been requested) */}
            {otpRequested && (
              <div>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {otpRequested ? 'Verify OTP' : 'Send OTP'}
            </button>
          </form>

          {/* Error Message Display */}
          {errorMessage && (
            <p id="error-msg" className="text-center text-red-500 mt-4">
              {errorMessage}
            </p>
          )}

          {/* Google Sign-In Button */}
          <div className="flex justify-center mt-6">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => console.log('Google login failed')}
              shape="rectangular"
              size="large"
              theme="outline"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
