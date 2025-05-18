import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  locations: [{ type: String}],
  createdAt: { type: Date, default: Date.now },
  driver: {type: String}
});

export default mongoose.model('Donation', donationSchema);
