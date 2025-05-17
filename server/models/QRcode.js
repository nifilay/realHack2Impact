import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  locations: [{ type: String}],
  scannedAt: { type: Date, default: Date.now },
  driver: {type: String}
});

export default mongoose.model('QR', qrSchema);
