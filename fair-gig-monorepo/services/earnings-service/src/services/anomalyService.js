const axios = require('axios');
const Earning = require('../models/Earning');

/**
 * Service to communicate with the Python-based Anomaly Detection Service.
 */
const detectAnomaly = async (earningId) => {
  try {
    const earning = await Earning.findById(earningId);
    if (!earning) return;

    const ANOMALY_SERVICE_URL = process.env.ANOMALY_SERVICE_URL || 'http://localhost:8000';
    
    // REST call to FastAPI service
    const response = await axios.post(`${ANOMALY_SERVICE_URL}/v1/detect-anomalies`, {
      earning_id: earning._id,
      worker_id: earning.workerId,
      gross_amount: earning.grossAmount,
      platform: earning.platform,
      duration_hours: (new Date(earning.shiftEnd) - new Date(earning.shiftStart)) / (1000 * 60 * 60)
    });

    const { score, is_anomaly } = response.data;

    // Update the earning record with anomaly results
    await Earning.findByIdAndUpdate(earningId, {
      anomalyScore: score,
      verificationStatus: is_anomaly ? 'flagged' : 'pending'
    });

    console.log(`[Anomaly Detection] Processed earning ${earningId}. Score: ${score}, Is Anomaly: ${is_anomaly}`);
  } catch (error) {
    console.error(`[Anomaly Detection Error] Service call failed for earning ${earningId}:`, error.message);
    // In a production app, we might queue this for retry
  }
};

module.exports = {
  detectAnomaly
};
