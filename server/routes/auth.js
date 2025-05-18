import express from 'express';
import jwt     from 'jsonwebtoken';
import User    from '../models/User.js';
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const u = await User.create(req.body);
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !await u.comparePassword(password)) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;
