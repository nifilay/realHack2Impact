// server/routes/auth.js
import express  from 'express';
import jwt      from 'jsonwebtoken';
import bcrypt   from 'bcryptjs';
import User     from '../models/User.js';
import 'dotenv/config';

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash }); // ✅ use hash

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid creds' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

export default router;
