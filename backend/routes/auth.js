// backend/routes/auth.js
// backend/routes/auth.js
import express from 'express';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';

const router = express.Router();

// Define routes for login and registration
router.post('/login', login);
router.post('/register', registerUser);

export default router;
