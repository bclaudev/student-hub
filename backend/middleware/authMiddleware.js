import jwt from 'jsonwebtoken';

export const verifyToken = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Missing or invalid token");
      return c.json({ message: "Unauthorized" }, 401);
    }

    //Extract JWT
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", decoded);

    //Set user data
    c.set('user', decoded);

    return next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return c.json({ message: "Unauthorized" }, 401);
  }
};
