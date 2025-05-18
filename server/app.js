// server/app.js
import 'dotenv/config';               // pulls in .env
import express      from 'express';
import mongoose     from 'mongoose';
import cors         from 'cors';

import authRoutes      from './routes/auth.js';
import donationsRoutes from './routes/donations.js';

const app = express();
app.use(cors());
app.use(express.json());

// 1) Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Mongo connected'))
.catch(err => console.error('❌ Mongo connection error:', err));

// 2) Auth & Donations routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
