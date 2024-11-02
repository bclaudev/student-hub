document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const usernameOrPhone = document.getElementById("username").value;

    try {
        const response = await fetch('http://localhost:4000/api/auth/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrPhone })
        });
        
        const data = await response.json();

        if (response.ok) {
            // Display a success message and proceed to OTP input page
            localStorage.setItem('usernameOrPhone', usernameOrPhone);
            alert("OTP sent to your email or phone!");
            window.location.href = "input_otp.html"; // Redirect to OTP page
        } else {
            // Display the error message
            document.getElementById('error-msg').textContent = data.message || 'Failed to send OTP. Please try again.';
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        document.getElementById('error-msg').textContent = 'An error occurred. Please try again later.';
    }
});
