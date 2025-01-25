import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { config } from 'dotenv';
import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import cookieParser from 'cookie-parser';
import eventsRouter from './routes/events.js';
import { db } from './db/db.js';

config(); 

const app = express();
const port = 4000;

app.use(cookieParser());

// Enable CORS and JSON parsing
app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true,
  })
);

app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api', eventsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
