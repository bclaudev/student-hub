// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies.token; // Fallback to cookies

  console.log('Token:', token); // Debug: Log the token
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
      };
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
