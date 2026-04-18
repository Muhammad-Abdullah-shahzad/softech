import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

// Import Routes
import authRoutes from './routes/authRoute.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// CORS must be configured to allow credentials (cookies) to be sent from the client
app.use(cors({
  origin: 'http://localhost:5173', // Update this to match your frontend URL
  credentials: true
}));
app.use(cookieParser());

// Database connection (commented out until you provide a DB_URI)
/*
mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/softech')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
*/

// Routes
app.use('/api/auth', authRoutes);

// A protected route example
app.use('/api/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authorized to see this!` });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
