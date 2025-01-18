const handleRegistration = async (e, formData, setNotification) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        date_of_birth: formData.dateOfBirth, // Map camelCase to snake_case
      }),
    });

    if (response.ok) {
      setNotification({
        message: 'Registration successful!',
        borderColor: '#47A447',
        bgColor: '#DFF0D8',
        textColor: '#3C763D',
      });
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
    console.error('Error during registration:', error);
    setNotification({
      message: 'An error occurred. Please try again later.',
      borderColor: '#8D0C0C',
      bgColor: '#E3D8D8',
      textColor: '#6A0202',
    });
  }
};
  
  export default handleRegistration;
  