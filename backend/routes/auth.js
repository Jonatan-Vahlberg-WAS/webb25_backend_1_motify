import { Router } from 'express';
import User from '../models/User.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.create({ email, password });
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const newAccessToken = createAccessToken(user._id);
    const newRefreshToken = createRefreshToken(user._id);
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user._id, email: req.user.email } });
});

export default router;
