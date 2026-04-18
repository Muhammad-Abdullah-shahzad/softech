const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');

router.post('/', earningsController.createEarning);
router.get('/', earningsController.getEarningsHistory);
router.get('/:id', earningsController.getEarningById);
router.patch('/:id/verify', earningsController.updateVerificationStatus);

module.exports = router;
