import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Replace with your actual API key

// Function to send email notifications (e.g., account creation confirmation)
export const sendEmailNotification = async (req, res) => {
  const { email, subject, message } = req.body;

  const msg = {
    to: email,
    from: 'claudia_burcea@outlook.com', // Replace with your verified sender email
    replyTo: 'claudia_burcea@outlook.com',
    subject: subject || 'Account created in StudentHub',
    text: message || 'Hello! Your account has been created!',
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};
