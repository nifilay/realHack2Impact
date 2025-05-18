import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// 🔐 Helper to issue JWT
const issueToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ✅ Shared register logic
const register = async (Model, req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await Model.create({ email, password: hash });
    const token = issueToken(user._id, Model.modelName); // Tag token with role
    res.status(201).json({ token, email: user.email });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Shared login logic
const login = async (Model, req, res) => {
  const { email, password } = req.body;
  const user = await Model.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = issueToken(user._id, Model.modelName);
  res.json({ token, email: user.email });
};

// 👤 User Routes
router.post('/register/user', (req, res) => register(User, req, res));
router.post('/login/user', (req, res) => login(User, req, res));

// 👨‍💼 Employee Routes
router.post('/register/employee', (req, res) => register(Employee, req, res));
router.post('/login/employee', (req, res) => login(Employee, req, res));

export default router;
