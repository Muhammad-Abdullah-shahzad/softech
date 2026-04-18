const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');

router.post('/', grievanceController.createGrievance);
router.get('/', grievanceController.getGrievances);
router.get('/trending', grievanceController.getTrendingGrievances);

module.exports = router;
