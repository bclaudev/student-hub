// backend/routes/login.js
import express from 'express';
import { login } from '../controllers/loginController.js'; // Import the login logic

const router = express.Router();

// Login route

router.post('/login', login);

export default router;
