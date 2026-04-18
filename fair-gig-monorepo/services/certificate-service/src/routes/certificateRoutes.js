const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Route to get a printable HTML certificate
router.get('/:workerId', certificateController.renderCertificate);

// Route to generate certificate data
router.post('/generate', certificateController.generate);

module.exports = router;
