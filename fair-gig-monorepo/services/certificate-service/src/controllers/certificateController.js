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

exports.generate = async (req, res) => {
  try {
    const { workerId, startDate, endDate } = req.body;
    const EARNINGS_URL = process.env.EARNINGS_SERVICE_URL || 'http://localhost:5002';

    console.log(`[Certificate] Generating for ${workerId} from ${startDate} to ${endDate}`);

    // Fetch verified earnings in range
    const url = `${EARNINGS_URL}/api/earnings?workerId=${workerId}&status=verified&startDate=${startDate}&endDate=${endDate}`;
    console.log(`[Certificate] Fetching from: ${url}`);
    
    const response = await axios.get(url);
    const earnings = response.data.data;

    if (!earnings || earnings.length === 0) {
      console.warn(`[Certificate] No verified records found for ${workerId} in period.`);
      return res.status(404).json({ success: false, message: 'No verified records in this period' });
    }

    const items = earnings.map(e => {
      const start = new Date(e.shiftStart);
      const end = new Date(e.shiftEnd);
      const hours = Math.max(0.5, (end - start) / (1000 * 60 * 60)).toFixed(1);
      
      const deductionTotal = Array.isArray(e.deductions) 
        ? e.deductions.reduce((acc, d) => acc + (d.amount || 0), 0)
        : 0;

      return {
        platform: e.platform,
        hours: hours,
        grossEarnings: e.grossAmount,
        deductions: deductionTotal
      };
    });

    const totalNet = items.reduce((acc, curr) => acc + (curr.grossEarnings - curr.deductions), 0);

    res.status(200).json({
      success: true,
      data: {
        _id: `CERT-${Date.now()}`,
        items,
        totalNet: totalNet.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Certificate Generation Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
