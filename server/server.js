// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // loads MONGODB_URI

// 1) Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Mongo connected'))
.catch(err => {
  console.error('❌ Mongo connection error:', err);
  process.exit(1);
});

const app = express();
app.use(cors());
app.use(express.json());

// 2) Define a simple Donation model
const Donation = mongoose.model('Donation', new mongoose.Schema({
  details: String,
  createdAt: { type: Date, default: Date.now },
}));

// 3) POST /donations → create & return an ID
app.post('/donations', async (req, res) => {
  const { details } = req.body;
  const doc = await Donation.create({ details });
  res.json({ donationId: doc._id.toString() });
});

// 4) POST /scan → record a scan
const Scan = mongoose.model('Scan', new mongoose.Schema({
  donationId: String,
  scannedAt: { type: Date, default: Date.now },
}));
app.post('/scan', async (req, res) => {
  const { donationId } = req.body;
  await Scan.create({ donationId });
  res.sendStatus(204);
});

// 5) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
