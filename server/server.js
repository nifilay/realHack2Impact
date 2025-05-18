import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import qrRoutes from "./routes/qr.js";

dotenv.config(); // 1) Load .env

// 2) Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
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
app.use('/api/qr', qrRoutes);

// 5) Mount auth routes
app.use('/api/auth', authRoutes);

// 6) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API listening on http://localhost:${PORT}`);
});
