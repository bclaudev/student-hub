const handleRegistration = async (e, formData, setNotification, navigate) => {
  e.preventDefault(); // Prevent form submission from reloading the page

  const { email, password, firstName, lastName, dateOfBirth } = formData; // Destructure form data

  // Check if all required fields are provided
  if (!email || !password || !firstName || !lastName || !dateOfBirth) {
    setNotification({
      message: 'Please provide all the required fields.',
      borderColor: '#8D0C0C',
      bgColor: '#E3D8D8',
      textColor: '#6A0202',
    });
    return;
  }

  try {
    // Format the date of birth to YYYY-MM-DD
    const formattedDateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];

    // Send registration request to the server
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
        dateOfBirth: formattedDateOfBirth, 
      }),
    });

    // Check if the registration was successful
    if (response.ok) {
      setNotification({
        message: 'Registration successful!',
        borderColor: '#47A447',
        bgColor: '#DFF0D8',
        textColor: '#3C763D',
      });

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } else {
      const errorData = await response.json();
      setNotification({
        message: errorData.message || 'Registration failed.',
        borderColor: '#8D0C0C',
        bgColor: '#E3D8D8',
        textColor: '#6A0202',
      });
    }
  } catch (error) {
    // Handle any errors that occur during the registration process
    setNotification({
      message: 'An error occurred. Please try again later.',
      borderColor: '#8D0C0C',
      bgColor: '#E3D8D8',
      textColor: '#6A0202',
    });
  }
};

export default handleRegistration;
