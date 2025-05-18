// server/models/Donation.js
import mongoose from 'mongoose';

export default mongoose.model('Donation', new mongoose.Schema({
  userId:    String,
  details:   String,
  status:    { type: String, default: 'created' },
  createdAt: { type: Date, default: Date.now },
  scannedAt: Date,
}));
