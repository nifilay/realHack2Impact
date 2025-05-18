// server/routes/donations.js
import express  from 'express';
import Donation from '../models/Donation.js';
import auth     from '../middleware/auth.js';

const router = express.Router();

// create
router.post('/', auth, async (req, res) => {
  const d = await Donation.create({
    userId:  req.user.id,
    details: req.body.details,
  });
  res.json(d);
});

// list (read)
router.get('/', auth, async (req, res) => {
  const list = await Donation
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });
  res.json(list);
});

// scan → mark
router.post('/:id/scan', auth, async (req, res) => {
  const d = await Donation.findOne({ _id: req.params.id, userId: req.user.id });
  if (!d) return res.status(404).json({ error: 'Not found' });
  d.status    = 'scanned';
  d.scannedAt = new Date();
  await d.save();
  res.json({ success: true });
});

export default router;
