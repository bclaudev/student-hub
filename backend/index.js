import { Hono } from 'hono';
import { createServer } from 'http';
import { URL } from 'url';
import { cors } from 'hono/cors';
import { getCookie, setCookie} from 'hono/cookie'
import { verifyToken } from './middleware/authMiddleware.js';


import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import emailRoutes from './routes/email.js';
import loginRoutes from './routes/login.js';
import {classesRoute} from './routes/classes.js';

console.log("Hono is starting...");

const app = new Hono();

app.use('*', cors({
  origin: "http://localhost:3000",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use('*', async (c, next) => {
  console.log("Applying global middleware...");
  return next();
});

app.use('/api/classes', verifyToken);
app.route('/api/classes', classesRoute);
app.route('/api/auth', authRoutes);
app.route('/api/events', eventsRoutes);
app.route('/api/email', emailRoutes);
app.route('/api', loginRoutes);

console.log("Registered Routes:");
console.log(app.routes);

const port = 4000;


const server = createServer(async (req, res) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);

  try {
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    const honoRequestInit = {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : null,
      duplex: 'half', 
    };

    const honoRequest = new Request(url, honoRequestInit);

    const honoResponse = await app.fetch(honoRequest);

    if (honoResponse.status === 404) {
      console.log("Route not found in Hono.");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Not Found" }));
      return;
    }


    res.writeHead(honoResponse.status, Object.fromEntries(honoResponse.headers));
    const body = await honoResponse.text();
    console.log("Sending response body:", body);
    res.end(body);
  } catch (error) {
    console.error("Fatal Error Processing Request:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
});


server.listen(port, () => {
  console.log(`Hono server running at http://localhost:${port}`);
});
