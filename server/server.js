import express  from 'express';
import mongoose from 'mongoose';
import cors     from 'cors';
import dotenv   from 'dotenv';
import authRoutes from './routes/auth.js';
import qrRoutes from './routes/qr.js';

dotenv.config(); // 1) Load .env

// 2) Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Mongo connected'))
.catch(err => {
  console.error('❌ Mongo connection error:', err);
  process.exit(1);
});

// 3) Create Express app
const app = express();

// 4) Middleware
app.use(cors());
app.use(express.json());
app.use('/qr', qrRoutes);

// 5) Mount auth routes
app.use('/auth', authRoutes);

// 6) Simple Donation model & endpoint
const Donation = mongoose.model('Donation', new mongoose.Schema({
  details:   String,
  createdAt: { type: Date, default: Date.now },
}));
app.post('/donations', async (req, res) => {
  const { details } = req.body;
  const doc = await Donation.create({ details });
  res.json({ donationId: doc._id.toString() });
});

// 7) Simple Scan model & endpoint
const Scan = mongoose.model('Scan', new mongoose.Schema({
  donationId: String,
  scannedAt:  { type: Date, default: Date.now },
}));
app.post('/scan', async (req, res) => {
  const { donationId } = req.body;
  await Scan.create({ donationId });
  res.sendStatus(204);
});

// 8) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
