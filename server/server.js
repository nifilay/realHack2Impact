import 'dotenv/config';
import express  from 'express';
import mongoose from 'mongoose';
import cors     from 'cors';

import donationsRouter from './routes/donations.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Mongo connected'))
.catch(err => {
  console.error('❌ Mongo connection error:', err);
  process.exit(1);
});

// mount at /api/donations
app.use('/api/donations', donationsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
