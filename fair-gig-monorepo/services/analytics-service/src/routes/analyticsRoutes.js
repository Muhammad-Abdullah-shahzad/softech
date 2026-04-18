const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/kpis', analyticsController.getAdvocateKPIs);
router.get('/worker/:workerId', analyticsController.getWorkerStats);
router.get('/trends/:workerId', analyticsController.getTrends);
router.get('/comparison/:workerId', analyticsController.getPlatformComparison);
router.get('/city-median', analyticsController.getCityMedian);
router.get('/community-insights', analyticsController.getCommunityInsights);

module.exports = router;
