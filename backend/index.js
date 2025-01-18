import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import authRoutes from './routes/auth.js';
import registerRoutes from './routes/register.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import { config } from 'dotenv';

config(); // Load environment variables

const { Pool } = pkg;
const app = express();
const port = 4000;

// Enable CORS and JSON parsing
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Ensure proper origin is set
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Initialize PostgreSQL pool and Drizzle
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(pool);

// Register and Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
