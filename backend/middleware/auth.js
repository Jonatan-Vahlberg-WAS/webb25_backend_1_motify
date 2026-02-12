import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Auth: Authorization required');
    return res.status(401).json({ error: 'Authorization required' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    console.error('Auth: Invalid or expired token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  const user = await User.findById(decoded.userId);
  if (!user) {
    console.error('Auth: User not found');
    return res.status(401).json({ error: 'User not found' });
  }
  req.user = user;
  next();
};
