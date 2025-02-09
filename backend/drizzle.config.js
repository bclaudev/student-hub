import { config } from 'dotenv';
config();

export default {
  schema: "./schema/**/*.js", // Path to schema folder
  dialect: "postgresql",   // Add this line to specify PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL, // Ensure .env file has correct connection string
  },
};
