document.getElementById("otpForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const otp = document.getElementById("otp").value;
    const usernameOrPhone = localStorage.getItem('usernameOrPhone'); // Retrieve from localStorage

    try {
        const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrPhone, otp })
        });

        const data = await response.json();
        if (response.ok) {
            alert("OTP verified! Logging in...");
            window.location.href = "dashboard.html";
        } else {
            document.getElementById('error-msg').textContent = data.message || 'Invalid OTP. Please try again.';
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        document.getElementById('error-msg').textContent = 'An error occurred. Please try again.';
    }
});
