import bcrypt from 'bcrypt'; // For password comparison
import { db } from '../config/db.js'; // Import the database instance
import { usersTable } from '../schema/users.js'; // Import the users table
import { eq } from 'drizzle-orm'; // Import the `eq` operator

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email)); // Use eq for equality check

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};
