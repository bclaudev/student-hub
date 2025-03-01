import { Hono } from 'hono';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

console.log("Loading auth routes...");

const authRoutes = new Hono();

//Login route
authRoutes.post('/login', async (c) => {
  console.log("Incoming request to /login");
  return await login(c);
});

//Register route
authRoutes.post('/register', async (c) => {
  console.log("Incoming request to /register");

  const body = await c.req.json();
  if (!body) {
    console.log("Request body is missing!");
    return c.json({ message: "Request body is required." }, 400);
  }

  return await registerUser(c);
});

//Get current logged-in user
authRoutes.get('/me', verifyToken, (c) => {
  console.log("/me endpoint hit for user:", c.get('user').email);
  const user = c.get('user');
  return c.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

//Logout
authRoutes.post('/logout', (c) => {
  console.log("User logged out");
  return c.json({ message: "Logged out successfully" });
});

export default authRoutes;
