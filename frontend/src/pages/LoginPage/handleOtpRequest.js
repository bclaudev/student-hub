// handleOtpRequest.js
export const handleOtpRequest = async (e, usernameOrPhone, setNotification, setOtpRequested) => {
    e.preventDefault();
    console.log("handleOtpRequest triggered with:", usernameOrPhone); // Log for debugging
  
    if (!usernameOrPhone.trim()) {
      setNotification({
        message: 'Please input a valid username or phone number.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrPhone }),
      });
  
      if (response.ok) {
        setOtpRequested(true);
        console.log(`OTP requested for ${usernameOrPhone}`);
        setNotification({
          message: 'Nice work! Please check your phone or email for a One-Time Password (OTP) to complete the login process.',
          borderColor: '#474747',
          bgColor: '#F2F2F2',
          textColor: '#2E2E2E',
        });
      } else {
        const data = await response.json();
        setNotification({
          message: data.message || "Invalid username or password, if you don't own an account please Register first",
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setNotification({
        message: 'An error occurred while sending OTP. Please try again.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  };
  