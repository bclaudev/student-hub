import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import { config } from 'dotenv';

config(); 

const { Pool } = pkg;

//PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//Drizzle instance
export const db = drizzle(pool);
