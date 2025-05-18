// server/models/Donation.js
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['created', 'scanned', 'in_transit', 'delivered'],
    default: 'created',
  },
  statusIndex: {
    type: Number,
    default: 0,
  },
  history: [
    {
      status: String,
      city:   String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

// (Optional) if you want to reference steps elsewhere
donationSchema.statics.STATUS_STEPS = ['created','scanned','in_transit','delivered'];

export default mongoose.model('Donation', donationSchema);
