const handleRegistration = async (e, formData, setNotification) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setNotification({
        message: 'Passwords do not match.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setNotification({
          message: 'Registration successful!',
          borderColor: '#474747',
          bgColor: '#F2F2F2',
          textColor: '#2E2E2E',
        });
        console.log('User registered:', data);
      } else {
        setNotification({
          message: data.message || 'Registration failed.',
          borderColor: '#8D0C0C',
          bgColor: '#E3D8D8',
          textColor: '#6A0202',
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setNotification({
        message: 'An error occurred. Please try again.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  };
  
  export default handleRegistration;
  