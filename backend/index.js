import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
const port = 4000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});