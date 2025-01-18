import express from 'express';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import { db } from '../config/db.js';
import { usersTable } from '../schema/users.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  // Your login logic here
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Route to get current user details
router.get('/me', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.id));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
