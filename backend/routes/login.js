import { Hono } from 'hono';
import { login } from '../controllers/loginController.js';

const loginRoutes = new Hono();

loginRoutes.post('/login', login);

export default loginRoutes;
