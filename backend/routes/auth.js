// backend/routes/auth.js
import express from 'express';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes for login and registration
router.post('/login', login);
router.post('/register', registerUser);

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    });
  });

export default router;
