import { Elysia } from 'elysia';
import { login } from '../controllers/loginController.js';
import { registerUser } from '../controllers/registerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

console.log("🟢 Loading auth routes...");

const authRoutes = new Elysia()
  .post('/login', async (ctx) => {
    console.log("🛠 Incoming request to /login");
    return await login(ctx);
  })
  .post('/register', async (ctx) => {
    console.log("🛠 Incoming request to /register");

    if (!ctx.body) {
      console.log("❌ Request body is missing!");
      ctx.set.status = 400;
      return { message: "Request body is required." };
    }

    return await registerUser(ctx);
  })
  .get('/me', verifyToken, ({ user }) => {
    console.log("🛠 /me endpoint hit for user:", user.email);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  })
  .post('/logout', () => {
    console.log("🛠 User logged out");
    return { message: "Logged out successfully" };
  });

export default authRoutes;
