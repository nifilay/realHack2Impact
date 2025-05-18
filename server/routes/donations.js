// server/routes/donations.js
import express from 'express';
import Donation, { STATUS_STEPS } from '../models/Donation.js';
import auth     from '../middleware/auth.js';

const router = express.Router();

// • Create a new donation
router.post('/', auth, async (req, res) => {
  const donation = await Donation.create({
    userId:  req.user.id,
    details: req.body.details,
  });
  res.json(donation);
});

// • List all donations for the logged‐in user
router.get('/', auth, async (req, res) => {
  const list = await Donation
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });
  res.json(list);
});

// • Advance status & record city
router.post('/:id/scan', auth, async (req, res) => {
  const { city } = req.body;
  const d = await Donation.findOne({ _id: req.params.id, userId: req.user.id });
  if (!d) return res.status(404).json({ error: 'Donation not found' });

  // bump statusIndex but don’t overflow
  if (d.statusIndex < STATUS_STEPS.length - 1) {
    d.statusIndex += 1;
    d.status = STATUS_STEPS[d.statusIndex];
  }

  // push history entry
  d.history.push({
    status:    d.status,
    city:      city || 'unknown',
    scannedAt: new Date(),
  });

  await d.save();
  res.json(d);
});

export default router;
