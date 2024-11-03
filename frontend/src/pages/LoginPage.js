import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import NotificationCard from '../components/NotificationCard.js';
import { handleOtpRequest } from './LoginPage/handleOtpRequest.js';
import { handleOtpSubmit } from './LoginPage/handleOtpSubmit.js';
import { handleGoogleLoginSuccess } from './LoginPage/handleGoogleLoginSuccess.js';
import Header from '../components/Header.js';
import { User } from 'react-feather';

function LoginPage() {
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <Header linkText="Create an account" linkUrl="/create-account" />
      <div className="login-page flex items-center justify-center min-h-screen bg-white">
        <div>
          <h2 className="text-[20px] font-bold text-center mb-6">Login</h2>

          {/* Google Sign-In Button */}
          <div className="flex justify-center mt-6">
            <div style={{ width: '210px' }}>
              <GoogleLogin
                onSuccess={(credentialResponse) =>
                  handleGoogleLoginSuccess(credentialResponse, setNotification)
                }
                onError={() => console.log('Google login failed')}
                shape="rectangular"
                size="large"
                theme="outline"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-300 w-full" />

          {/* Username or Phone Number Form */}
          <form className="space-y-4">
            <div className="relative">
              <User color="#A585FF" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  id="usernameOrPhone"
                  value={usernameOrPhone}
                  onChange={(e) => setUsernameOrPhone(e.target.value)}
                  className="block w-full pl-10 mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="Username or phone number"
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
                  className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-[12px] shadow-sm focus:ring-customPurple focus:ring-1 focus:border-customPurple focus:outline-none placeholder:text-placeholderGray placeholder:text-[12px]"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              {otpRequested ? (
                <button
                  onClick={(e) =>
                    handleOtpSubmit(e, usernameOrPhone, otp, setNotification)
                  }
                  className="w-[155px] bg-customPurple text-white py-2 px-4 rounded-[25px] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={(e) =>
                    handleOtpRequest(e, usernameOrPhone, setNotification, setOtpRequested)
                  }
                  className="w-[155px] bg-customPurple text-white py-2 px-4 rounded-[25px] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              )}
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
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
