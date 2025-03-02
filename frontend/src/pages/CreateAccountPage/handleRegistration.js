const handleRegistration = async (e, formData, setNotification, navigate) => {
  e.preventDefault();

  const { email, password, firstName, lastName, dateOfBirth } = formData; 

  if (!email || !password || !firstName || !lastName || !dateOfBirth) {
    console.log('Missing required fields:', { email, password, firstName, lastName, dateOfBirth });

    setNotification({
      message: 'Please provide all the required fields.',
      borderColor: '#8D0C0C',
      bgColor: '#E3D8D8',
      textColor: '#6A0202',
    });
    return;
  }

  console.log('🔍 Sending registration request...', { email, password, firstName, lastName, dateOfBirth });

  try {
    // ✅ Ensure date is formatted correctly before sending
    const formattedDateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];

    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName, 
        dateOfBirth: formattedDateOfBirth, // ✅ Send properly formatted date
      }),
    });

    console.log('🔍 Registration response status:', response.status);

    if (response.ok) {
      setNotification({
        message: 'Registration successful!',
        borderColor: '#47A447',
        bgColor: '#DFF0D8',
        textColor: '#3C763D',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      const errorData = await response.json();
      console.error("❌ Backend Error:", errorData);
      setNotification({
        message: errorData.message || 'Registration failed.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  } catch (error) {
    console.error('❌ Error during registration:', error);
    setNotification({
      message: 'An error occurred. Please try again later.',
      borderColor: '#8D0C0C',
      bgColor: '#E3D8D8',
      textColor: '#6A0202',
    });
  }
};

export default handleRegistration;
