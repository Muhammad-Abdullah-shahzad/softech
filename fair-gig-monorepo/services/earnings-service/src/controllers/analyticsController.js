const Earning = require('../models/Earning');
const anomalyService = require('../services/anomalyService');

exports.getWorkerAnalytics = async (req, res) => {
  try {
    const { workerId } = req.params;
    
    // Get all records for worker
    const allEarnings = await Earning.find({ workerId }).sort({ shiftStart: 1 });
    
    // Proactively trigger anomaly detection for any unprocessed legacy records
    const unprocessed = allEarnings.filter(e => e.anomalyScore === 0);
    if (unprocessed.length > 0) {
        console.log(`[Analytics] Found ${unprocessed.length} unprocessed records for worker ${workerId}. Triggering detection...`);
        unprocessed.forEach(e => {
            anomalyService.detectAnomaly(e._id).catch(console.error);
        });
    }

    // Use ONLY verified records for Dashboard charts and KPI calculations
    const earnings = allEarnings.filter(e => e.verificationStatus === 'verified');
    
    // 1. Earnings Trends
    const trends = earnings.reduce((acc, curr) => {
      if (!curr.shiftStart) return acc;
      const date = new Date(curr.shiftStart).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { amount: 0, gross: 0, deds: 0, hours: 0 };
      acc[date].amount += curr.netAmount;
      acc[date].gross += curr.grossAmount;
      acc[date].deds += (curr.deductions||[]).reduce((a,c)=>a+c.amount, 0);
      const hrs = (new Date(curr.shiftEnd) - new Date(curr.shiftStart)) / (1000 * 60 * 60) || 0;
      acc[date].hours += hrs;
      return acc;
    }, {});
    
    const earningsTrend = Object.keys(trends).map(date => ({ 
        date, 
        amount: trends[date].amount,
        gross: trends[date].gross,
        deds: trends[date].deds,
        hours: trends[date].hours 
    }));
    
    // 2. Hourly Rate Trend
    const hourlyRateTrend = earnings.map(e => {
        if (!e.shiftStart || !e.shiftEnd) return null;
        const hours = (new Date(e.shiftEnd) - new Date(e.shiftStart)) / (1000 * 60 * 60);
        return {
           date: new Date(e.shiftStart).toISOString().split('T')[0],
           rate: hours > 0 ? e.netAmount / hours : 0
        }
    }).filter(e => e !== null);

    // 3. Platform Comparison
    const platformGrouping = earnings.reduce((acc, curr) => {
       if (!acc[curr.platform]) acc[curr.platform] = 0;
       acc[curr.platform] += curr.netAmount;
       return acc;
    }, {});
    const platformComparison = Object.keys(platformGrouping).map(platform => ({ platform, amount: platformGrouping[platform] }));

    // 4. Totals and Stats for Dashboard
    let totalEarnings = 0;
    let grossEarnings = 0;
    let totalDeductions = 0;
    let totalHours = 0;
    earnings.forEach(e => {
       totalEarnings += e.netAmount;
       grossEarnings += e.grossAmount;
       totalDeductions += (e.deductions||[]).reduce((a,c)=>a+c.amount, 0);
       totalHours += (new Date(e.shiftEnd) - new Date(e.shiftStart)) / (1000 * 60 * 60) || 0;
    });
    
    const stats = {
      totalEarnings,
      grossEarnings,
      totalDeductions,
      hourlyRate: totalHours > 0 ? (totalEarnings / totalHours).toFixed(2) : 0,
      earningsTrend: 12.5, // Dummy visual trend
      rateTrend: 4.2
    };

    // 5. Gather Anomalies
    let anomalies = [];
    allEarnings.forEach(e => {
        if(e.anomalies && e.anomalies.length > 0) {
            anomalies = [...anomalies, ...e.anomalies];
        }
    });

    res.status(200).json({
      success: true,
      data: {
        earningsTrend,
        hourlyRateTrend,
        platformComparison,
        stats,
        anomalies
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAggregates = async (req, res) => {
  try {
    const platformCommTrends = await Earning.aggregate([
      {
        $group: {
          _id: "$platform",
          avgDeduction: { $avg: { $sum: "$deductions.amount" } },
          totalGross: { $sum: "$grossAmount" }
        }
      }
    ]);
    
    const anomalyCounts = await Earning.aggregate([
      { $match: { "anomalies.0": { $exists: true } } },
      { $unwind: "$anomalies" },
      { $group: { _id: "$anomalies.type", count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
       success: true,
       data: { platformCommTrends, anomalyCounts }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMedian = async (req, res) => {
  try {
    const { city } = req.query;
    
    // Aggregation to calculate hourly rate for every relevant record in the city
    const matchQuery = { 
      netAmount: { $exists: true }, 
      shiftStart: { $exists: true }, 
      shiftEnd: { $exists: true } 
    };
    if (city) matchQuery.city = city;

    const pipeline = [
      { $match: matchQuery },
      { 
        $addFields: { 
          // (ShiftEnd - ShiftStart) in hours
          hours: { 
            $divide: [
              { $subtract: ["$shiftEnd", "$shiftStart"] }, 
              1000 * 60 * 60 
            ] 
          } 
        } 
      },
      { $match: { hours: { $gt: 0 } } },
      { 
         $project: { 
           hourlyRate: { $divide: ["$netAmount", "$hours"] } 
         } 
      },
      { $sort: { hourlyRate: 1 } }
    ];

    const results = await Earning.aggregate(pipeline);
    
    let median = 0;
    if (results.length > 0) {
        const mid = Math.floor(results.length / 2);
        if (results.length % 2 !== 0) {
            median = results[mid].hourlyRate;
        } else {
            median = (results[mid - 1].hourlyRate + results[mid].hourlyRate) / 2;
        }
    }
    
    res.status(200).json({ success: true, data: { cityMedian: Math.round(median) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCommunityInsights = async (req, res) => {
  try {
    const rateChanges = [
      { platform: 'Uber', city: 'Karachi', change: 8.2 },
      { platform: 'Zomato', city: 'Lahore', change: -4.5 },
      { platform: 'Bykea', city: 'Islamabad', change: 12.1 },
      { platform: 'Careem', city: 'Lahore', change: 2.3 }
    ];

    res.status(200).json({
      success: true,
      data: {
        rateChanges,
        marketPulse: {
            uberAvailability: 88,
            zomatoIncentives: 45,
            swiggyVerification: 72
        },
        sentiment: { satisfied: 68, concerned: 22, neutral: 10 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
