import { Elysia } from 'elysia';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';

config();

const app = new Elysia()
    .use(authRoutes)
    .use(eventRoutes)
    .listen(4000);

console.log(`ElysiaJS server running at http://localhost:4000`);
