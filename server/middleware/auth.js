// server/middleware/auth.js
import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ error: 'No token' });
  const token = hdr.replace(/^Bearer\s+/, '');
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: data.id };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
