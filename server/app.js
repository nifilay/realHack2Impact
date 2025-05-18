// server/app.js
import express      from 'express';
import cors         from 'cors';
import dotenv       from 'dotenv';
import authRouter       from './routes/auth.js';
import donationsRouter  from './routes/donations.js';  // only once!

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRouter);

// Donation routes
app.use('/api/donations', donationsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
