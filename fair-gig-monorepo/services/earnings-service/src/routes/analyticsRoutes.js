const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/worker/:workerId', analyticsController.getWorkerAnalytics);
router.get('/aggregates', analyticsController.getAggregates);
router.get('/median', analyticsController.getMedian);
router.get('/community-insights', analyticsController.getCommunityInsights);

module.exports = router;
