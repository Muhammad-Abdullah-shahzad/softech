const axios = require('axios');
const generateHTML = require('../views/certificateTemplate');

exports.renderCertificate = async (req, res) => {
  try {
    const { workerId } = req.params;
    const EARNINGS_URL = process.env.EARNINGS_SERVICE_URL || 'http://localhost:5002';

    // 1. Fetch verified earnings from the EARNINGS service
    const response = await axios.get(`${EARNINGS_URL}/api/earnings?workerId=${workerId}`);
    const earnings = response.data.data;

    // 2. Aggregate data for the certificate
    const verifiedEarnings = earnings.filter(e => e.verificationStatus === 'verified');
    const totalEarnings = verifiedEarnings.reduce((acc, curr) => acc + curr.netAmount, 0);
    
    if (verifiedEarnings.length === 0) {
      return res.status(404).send('<h1>No verified earnings found for this worker.</h1>');
    }

    const certificateData = {
      workerId,
      totalEarnings,
      shiftCount: verifiedEarnings.length,
      timeframe: 'All Time (Verified)',
      verified: true
    };

    // 3. Generate HTML and send as response
    const html = generateHTML(certificateData);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('Certificate Generation Error:', error.message);
    res.status(500).send('<h1>Internal Server Error</h1><p>Could not generate certificate.</p>');
  }
};
