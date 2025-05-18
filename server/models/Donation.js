import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  driver: {type: String}
});

export default mongoose.model('Donation', donationSchema);
