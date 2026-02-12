import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  req.user = user;
  next();
};
