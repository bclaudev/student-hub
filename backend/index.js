import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg'; // Import 'pg' as a package
import authRoutes from './routes/auth.js';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import { usersTable } from "./schema/schema.js";

config(); // Load environment variables

const { Pool } = pkg; // Destructure Pool from the imported 'pg' package

const app = express();
const port = 4000;

// Google OAuth2 client setup
const CLIENT_ID = '669883299394-msg0alvbmcq3neuc1tbusjmb283gl9c3.apps.googleusercontent.com'; // Replace with your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL pool and Drizzle
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this exists in your .env file
});

export const db = drizzle(pool); // Export Drizzle instance for usage in other parts of the app

// Use auth routes
app.use('/api/auth', authRoutes);

// Route to register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body

    const { firstName, lastName, email, password } = req.body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the database
    await db.insert(usersTable).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log('User registered successfully!');
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

const result = await db.select().from(usersTable);
console.log('Users:', result);

// Route to verify Google token
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    // Get the user information from the payload
    const payload = ticket.getPayload();
    const userId = payload.sub; // Unique user ID
    const email = payload.email;
    const name = payload.name;

    // Here you can handle login or signup logic, such as inserting a user into the database
    console.log('Authenticated User:', { userId, email, name });

    res.status(200).json({ message: 'Google authentication successful', user: { userId, email, name } });
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    res.status(401).json({ message: 'Invalid Google ID token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
