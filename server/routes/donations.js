// server/routes/donations.js

import express from 'express';
import Donation from '../models/Donation.js';
import auth     from '../middleware/auth.js';

const router = express.Router();

// • Create a new donation
// POST /api/donations
router.post('/', auth, async (req, res) => {
  try {
    const donation = await Donation.create({
      userId:  req.user.id,
      details: req.body.details,
      // initialize history with the first status
      history: [{ status: Donation.STATUS_STEPS[0] }],
    });
    res.json(donation);
  } catch (err) {
    console.error('Error creating donation:', err);
    res.status(500).json({ error: 'Could not create donation' });
  }
});

// • List all donations for the logged‐in user
// GET /api/donations
router.get('/', auth, async (req, res) => {
  try {
    const list = await Donation
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Could not fetch donations' });
  }
});

// • Advance a donation to its next status
// POST /api/donations/:id/scan
router.post('/:id/scan', auth, async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const steps = Donation.STATUS_STEPS;
    // bump to next step if not already at the end
    if (donation.statusIndex < steps.length - 1) {
      donation.statusIndex += 1;
      donation.status      = steps[donation.statusIndex];
      donation.history.push({ status: donation.status, at: new Date() });
      donation.scannedAt    = new Date();
      await donation.save();
    }

    // return the updated donation
    res.json({
      _id:         donation._id,
      details:     donation.details,
      status:      donation.status,
      statusIndex: donation.statusIndex,
      history:     donation.history,
      createdAt:   donation.createdAt,
      scannedAt:   donation.scannedAt
    });
  } catch (err) {
    console.error('Error scanning donation:', err);
    res.status(500).json({ error: 'Could not update donation status' });
  }
});

export default router;
