export const handleGoogleLoginSuccess = async (
    credentialResponse,
    setNotification
  ) => {
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
      setNotification({
        message: 'Google login failed. Please try again.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  };
  