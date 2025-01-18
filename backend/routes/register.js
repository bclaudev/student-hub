import express from 'express';
import { registerUser } from '../controllers/registerController.js';

const router = express.Router();

// Register route
router.post('/', registerUser);

export default router;
