//backend/controllers/loginController.js
import bcrypt from 'bcrypt'; // For password comparison
import jwt from 'jsonwebtoken'; // For creating JWT tokens
import { db } from '../config/db.js';
import { usersTable } from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Set the token as a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'Strict',
    });

    res.status(200).json({ 
      message: 'Login successful!',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};
