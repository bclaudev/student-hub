import { Hono } from 'hono';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getCookie, deleteCookie } from 'hono/cookie';

// Create a new Hono instance for auth routes
const authRoutes = new Hono();

// Login route
authRoutes.post('/login', async (c) => {
  // Handle login request
  return await login(c);
});

// Register route
authRoutes.post('/register', async (c) => {
  // Parse request body
  const body = await c.req.json();
  if (!body) {
    // Return error if request body is missing
    return c.json({ message: "Request body is required." }, 400);
  }

  // Handle user registration
  return await registerUser(c);
});

// Get current logged-in user
authRoutes.get('/me', verifyToken, (c) => {
  // Retrieve user data from the request context
  const user = c.get('user');
  return c.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

// Logout route
authRoutes.post('/logout', (c) => {
  // Delete the token cookie to log out the user
  deleteCookie(c, 'token');
  return c.json({ message: "Logged out successfully" });
});

export default authRoutes;
