import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { config } from 'dotenv';
import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import cookieParser from 'cookie-parser';

config(); // Load environment variables

const { Pool } = pkg; // Destructure Pool from the imported 'pg' package

const app = express();
const port = 4000;

app.use(cookieParser());

// Enable CORS and JSON parsing
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust this as needed for your frontend
    credentials: true, // Allow cookies
  })
);
app.use(express.json());

// Initialize PostgreSQL pool and Drizzle
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this exists in your .env file
});
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables.');
}
export const db = drizzle(pool); // Export Drizzle instance for usage in other parts of the app

// Use auth routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
