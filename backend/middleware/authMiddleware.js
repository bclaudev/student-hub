export const verifyToken = () => ({
  beforeHandle: async ({ request, set }) => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      set.status = 401;
      return { message: 'Unauthorized' };
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      request.user = decoded; // ✅ Attach user to request properly
      return {}; // ✅ Always return an object
    } catch (error) {
      set.status = 401;
      return { message: 'Invalid token' };
    }
  }
});
