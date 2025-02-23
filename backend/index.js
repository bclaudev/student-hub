import { Hono } from 'hono';
import { createServer } from 'http';
import { URL } from 'url';

console.log("🟢 Starting HonoJS server...");

// ✅ Create a new Hono app
const app = new Hono();

// ✅ Test route
app.get('/test', (c) => {
  console.log("✅ /test route hit!");
  return c.json({ message: "Hono is working!" });
});

// ✅ JSON body parsing
app.post('/test-json', async (c) => {
  console.log("🛠 /test-json route hit! Processing JSON...");
  
  try {
    const body = await c.req.json();
    console.log("📌 Parsed JSON:", body);
    return c.json({ message: "JSON received", received: body });
  } catch (error) {
    console.error("❌ JSON Parsing Failed:", error);
    return c.json({ message: "Invalid JSON body" }, 400);
  }
});

// ✅ Start Hono using Node.js `createServer()`
const port = 4000;

const server = createServer(async (req, res) => {
  console.log(`🟢 Incoming Request: ${req.method} ${req.url}`);

  try {
    // ✅ Convert Node.js request into Fetch API-compatible request
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    const honoRequestInit = {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : null,
      duplex: 'half',  // ✅ Fix: Required for streaming body in Node.js 20+
    };

    const honoRequest = new Request(url, honoRequestInit);

    // ✅ Process request using Hono
    const honoResponse = await app.fetch(honoRequest);

    // ✅ If route is not found, return 404
    if (honoResponse.status === 404) {
      console.log("❌ Route not found in Hono.");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Not Found" }));
      return;
    }

    // ✅ Send Hono's response back to the client
    res.writeHead(honoResponse.status, Object.fromEntries(honoResponse.headers));
    const body = await honoResponse.text();
    console.log("📌 Sending response body:", body);
    res.end(body);
  } catch (error) {
    console.error("❌ Fatal Error Processing Request:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
});

// ✅ Fix: Start Server **AFTER** Registering Routes
server.listen(port, () => {
  console.log(`🚀 Hono server running at http://localhost:${port}`);
});
