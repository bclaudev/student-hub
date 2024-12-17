import express from 'express';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg'; // Import 'pg' as a package
import authRoutes from './routes/auth.js';
import { config } from 'dotenv';

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

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
