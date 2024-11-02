// GoogleAuthButton.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function GoogleAuthButton() {
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // Get the token from Google login

    try {
      const response = await fetch('http://localhost:4000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log('Backend response:', data); // You can handle this response to update UI, etc.
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={() => console.log('Google login failed')}
    />
  );
}

export default GoogleAuthButton;
