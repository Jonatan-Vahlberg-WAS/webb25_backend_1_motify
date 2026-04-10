import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Runs on all API traffic: if Bearer token verifies, sets req.userId only (no DB).
 * Invalid/missing token: continues without req.userId.
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return next();
  }
  if (!decoded?.userId) {
    return next();
  }

  req.userId = decoded.userId;
  next();
};

/**
 * Requires optionalAuth to have set a valid req.userId from the same request’s token,
 * then confirms the user still exists and attaches req.user for handlers.
 */
export const requireAuth = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};
