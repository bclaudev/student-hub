import { createServer } from 'http';

console.log("🟢 Starting Native Node.js server...");

const server = createServer((req, res) => {
    console.log(`🟢 Incoming Request: ${req.method} ${req.url}`);
    
    if (req.method === "POST" && req.url === "/test-json") {
        console.log("🛠 /test-json route hit! Manually extracting body...");

        let rawBody = "";
        
        req.on("data", (chunk) => {
            rawBody += chunk.toString();
        });

        req.on("end", () => {
            console.log("📌 Raw Body:", rawBody);

            if (!rawBody.trim()) {
                console.log("❌ Empty request body!");
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Request body is missing." }));
                return;
            }

            try {
                const body = JSON.parse(rawBody);
                console.log("📌 Parsed JSON:", body);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "JSON received", received: body }));
            } catch (error) {
                console.error("❌ JSON Parsing Failed:", error);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON body" }));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Not Found" }));
    }
});

server.listen(4000, () => {
    console.log("🚀 Native Node.js server running at http://localhost:4000");
});
