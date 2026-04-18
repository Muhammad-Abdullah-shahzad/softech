require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Analytics' });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Analytics Service running on port ${PORT}`);
});

module.exports = app;
