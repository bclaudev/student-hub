import bcrypt from 'bcrypt';
import { db } from '../db/db.js';
import { usersTable } from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, dateOfBirth, password, confirmPassword } = req.body;

  try {
    // Validate input fields
    if (!firstName || !lastName || !email || !dateOfBirth || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check if user already exists
    const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const newUser = {
      firstName,
      lastName,
      email,
      dateOfBirth,
      password: hashedPassword,
    };

    await db.insert(usersTable).values(newUser);

    // Respond with success
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
};
