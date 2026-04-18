require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const earningsRoutes = require('./routes/earningsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/earnings', earningsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Earnings' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Earnings Service running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app; // For testing
