import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your actual API key

// In-memory OTP store (for demonstration only; use a database in production)
const otpStore = new Map();

// Function to generate and send OTP
export const sendOtp = async (req, res) => {
  console.log('sendOtp function called');
  const { usernameOrPhone } = req.body;
  console.log('Request received to send OTP to:', usernameOrPhone); // Log email

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(usernameOrPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  const msg = {
    to: usernameOrPhone,
    from: 'claudia_burcea@outlook.com',
    replyTo: 'claudia_burcea@outlook.com',
    subject: 'StudentHub Login OTP code',
    text: `Your OTP is ${otp}`,
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP ${otp} sent to ${usernameOrPhone}`);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP email:', error.response ? error.response.body : error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Function to verify OTP
export const verifyOtp = (req, res) => {
  const { usernameOrPhone, otp } = req.body;

  // Retrieve the stored OTP for the user
  const storedOtpData = otpStore.get(usernameOrPhone);

  if (storedOtpData) {
    console.log('Stored OTP:', storedOtpData.otp);
    console.log('Provided OTP:', otp);
  }

  // Check if OTP exists and is not expired
  if (!storedOtpData || storedOtpData.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'OTP expired or not found', success: false });
  }

  // Check if the provided OTP matches the stored OTP
  if (storedOtpData.otp === otp) {
    otpStore.delete(usernameOrPhone); // Clear OTP after successful verification
    res.json({ message: 'OTP verified successfully', success: true });
  } else {
    res.status(400).json({ message: 'Invalid OTP', success: false });
  }
};
