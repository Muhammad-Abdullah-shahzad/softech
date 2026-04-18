const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/kpis', analyticsController.getAdvocateKPIs);

module.exports = router;
