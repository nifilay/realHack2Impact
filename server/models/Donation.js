// server/models/Donation.js
import mongoose from 'mongoose';

const STATUS_STEPS = [
  'created',
  'scanned',
  'in_transit',
  'delivered',
  'archived'
];

const DonationSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details:     { type: String, required: true },
  statusIndex: { type: Number, default: 0 },               // which step we’re on
  status:      { type: String, default: STATUS_STEPS[0] }, // human-readable
  history: [
    {
      status: { type: String, enum: STATUS_STEPS },
      at:     { type: Date, default: Date.now }
    }
  ],
  createdAt:   { type: Date, default: Date.now },
  scannedAt:   Date
});

DonationSchema.statics.STATUS_STEPS = STATUS_STEPS;

export default mongoose.model('Donation', DonationSchema);
