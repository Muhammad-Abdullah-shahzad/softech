const axios = require('axios');
const Earning = require('../models/Earning');

/**
 * Service to communicate with the Python-based Anomaly Detection Service.
 */
const detectAnomaly = async (earningId) => {
  try {
    const earning = await Earning.findById(earningId);
    if (!earning) return;

    // Fetch the LATEST 30 past earnings for the same worker to provide context to the detector
    let workerEarnings = await Earning.find({ workerId: earning.workerId })
      .sort({ shiftStart: -1 })
      .limit(30);
    
    // Sort chronological for the Python detector
    workerEarnings = workerEarnings.reverse();

    const ANOMALY_SERVICE_URL = process.env.ANOMALY_SERVICE_URL || 'http://localhost:8000';
    
    // Map to required python structure
    const payloadEarnings = workerEarnings.map(e => {
        const hours = (new Date(e.shiftEnd) - new Date(e.shiftStart)) / (1000 * 60 * 60) || 0;
        const totalDeds = (e.deductions || []).reduce((acc, curr) => acc + curr.amount, 0);
        return {
            date: new Date(e.shiftStart).toISOString().split('T')[0],
            hoursWorked: hours,
            grossAmount: e.grossAmount,
            deductions: totalDeds,
            netAmount: e.netAmount
        };
    });

    const payload = {
       workerId: earning.workerId,
       earnings: payloadEarnings
    };

    // REST call to FastAPI service
    const response = await axios.post(`${ANOMALY_SERVICE_URL}/detect-anomalies`, payload);

    const { anomalies } = response.data;
    
    if (anomalies && anomalies.length > 0) {
        // Update the earning record with anomaly results
        const isHighSeverity = anomalies.some(a => a.severity === 'high');
        const updateData = {
          anomalies: anomalies,
          anomalyScore: isHighSeverity ? 0.9 : 0.5
        };
        
        // ONLY overwrite status if it hasn't been manually processed yet
        if (earning.verificationStatus === 'unverified' || earning.verificationStatus === 'pending') {
            updateData.verificationStatus = 'flagged';
        }

        await Earning.findByIdAndUpdate(earningId, updateData);
        console.log(`[Anomaly Detection] Processed earning ${earningId}. ${anomalies.length} anomalies found.`);
    } else {
        const updateData = { anomalyScore: 0.1 };
        
        // If it was unverified, we can move it to pending for the human queue
        if (earning.verificationStatus === 'unverified') {
            updateData.verificationStatus = 'pending';
        }
        
        await Earning.findByIdAndUpdate(earningId, updateData);
    }

  } catch (error) {
    console.error(`[Anomaly Detection Error] Service call failed for earning ${earningId}:`, error.message);
  }
};

module.exports = {
  detectAnomaly
};
