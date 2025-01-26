import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg"; // Import 'pg' as a default module
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { Pool } = pkg; // Destructure 'Pool' from the imported module

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the connection string from environment variables
});

// Test database connection
pool.query('SELECT 1', (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully.');
  }
});


export const db = drizzle(pool); // Initialize drizzle ORM with the pool
