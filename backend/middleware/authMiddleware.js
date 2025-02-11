import jwt from 'jsonwebtoken';

export const verifyToken = ({ request, set }) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    set.status = 401;
    return { message: 'Authentication token missing' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (error) {
    set.status = 401;
    return { message: 'Invalid token' };
  }
};
