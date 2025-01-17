import bcrypt from 'bcrypt'; // For password comparison
import { db } from '../config/db.js';
import { users } from '../schema/users.js'; // Import your Drizzle schema for the users table

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Find user by email
    const user = await db
      .select()
      .from(users)
      .where(users.email.eq(email))
      .limit(1);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    //Compare password
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user[0].id,
        email: user[0].email,
        name: `${user[0].firstName} ${user[0].lastName}`,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};
