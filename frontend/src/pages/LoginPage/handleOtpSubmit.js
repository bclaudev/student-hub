// src/pages/LoginPage/handleOtpSubmit.js

export const handleOtpSubmit = async (event, usernameOrPhone, otp, setNotification) => {
    event.preventDefault(); // Prevents default button click behavior
  
    if (!otp.trim()) {
      setNotification({
        message: 'Please input an OTP.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrPhone, otp }), // Only send relevant data
      });
  
      const data = await response.json();
      if (response.ok) {
        setNotification({
          message: 'OTP verified successfully! Redirecting...',
          borderColor: '#474747',
          bgColor: '#F2F2F2',
          textColor: '#2E2E2E',
        });
        setTimeout(() => {
          window.location.href = '/homepage'; // Redirect after a short delay
        }, 2000);
      } else {
        setNotification({
          message: data.message || 'Incorrect OTP. Please try again.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setNotification({
        message: 'An error occurred. Please try again.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  };
  