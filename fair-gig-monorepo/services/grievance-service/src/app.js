require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const grievanceRoutes = require('./routes/grievanceRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/grievances', grievanceRoutes);
app.use('/api/community', communityRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Grievance' });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Grievance Service running on port ${PORT}`);
});

module.exports = app;
