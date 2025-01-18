import express from 'express';
import { sendEmailNotification } from '../controllers/emailController.js'; // Adjust path as needed

const router = express.Router();

// Define a route for sending emails
router.post('/send-email', sendEmailNotification);

export default router;