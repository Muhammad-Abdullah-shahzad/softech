require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const certificateRoutes = require('./routes/certificateRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/certificates', certificateRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Certificate Renderer' });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Certificate Service running on port ${PORT}`);
});

module.exports = app;
