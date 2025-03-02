import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie'; // ✅ Use `getCookie`

export const verifyToken = async (c, next) => {
  try {
    console.log("🛠 Verifying token...");
    
    if (!c || !c.req) {  // ✅ Ensure `c.req` is defined before using `getCookie()`
      console.log("❌ Context (c) is missing request data");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = getCookie(c, 'token'); // ✅ Extract token from cookies

    if (!token) {
      console.log("❌ Missing or invalid token");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified:", decoded);

    c.set('user', decoded); // ✅ Set user data in request context
    return next();
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    return c.json({ message: "Unauthorized" }, 401);
  }
};
