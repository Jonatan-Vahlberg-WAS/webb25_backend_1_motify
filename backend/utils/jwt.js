import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const ACCESS_EXPIRY = '1d';
const REFRESH_EXPIRY = '30d';

export const createAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
};

export const createRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
};

const verifyToken = (token, expectedType) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== expectedType) return null;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyAccessToken = (token) => verifyToken(token, 'access');
export const verifyRefreshToken = (token) => verifyToken(token, 'refresh');
