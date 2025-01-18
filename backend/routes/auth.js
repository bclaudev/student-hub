// backend/routes/auth.js
import express from 'express';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes for login and registration
router.post('/login', login);
router.post('/register', registerUser);

router.get('/me', verifyToken, async (req, res) => {
    try {
      res.status(200).json({
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      });
    } catch (error) {
      console.error('Error in /me route:', error);
      res.status(500).json({ message: 'Failed to fetch user data' });
    }
  });

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });

export default router;
