import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailNotification = async ({ body, set }) => {
  const { email, subject, message } = body;

  const msg = {
    to: email,
    from: 'claudia_burcea@outlook.com',
    replyTo: 'claudia_burcea@outlook.com',
    subject: subject || 'Account created in StudentHub',
    text: message || 'Hello! Your account has been created!',
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
    return { message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    set.status = 500;
    return { message: 'Failed to send email' };
  }
};
