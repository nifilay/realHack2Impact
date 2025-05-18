import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  donationID:    { type: String, required: true, unique: true },
  scannedAt: { type: Date, default: Date.now },
  driver: {type: String}
});

export default mongoose.model('QR', qrSchema);
