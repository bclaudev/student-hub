import { Elysia } from 'elysia';
import { login } from '../controllers/loginController.js';

const loginRoutes = new Elysia().post('/login', login);

export default loginRoutes; // ✅ Ensure this returns an instance of Elysia
