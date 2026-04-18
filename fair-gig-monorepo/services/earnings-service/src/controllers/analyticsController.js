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
exports.getVerifierAnalytics = async (req, res) => {
  try {
    // 1. Verification Activity (Daily count of statuses changed from pending)
    const activity = await Earning.aggregate([
      { $match: { verificationStatus: { $ne: 'pending' } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } }
    ]);

    // 2. Decision Breakdown
    const decisionsRaw = await Earning.aggregate([
      { $group: { _id: "$verificationStatus", count: { $sum: 1 } } }
    ]);
    const decisions = {
      verified: decisionsRaw.find(d => d._id === 'verified')?.count || 0,
      flagged: decisionsRaw.find(d => d._id === 'flagged')?.count || 0,
      unverifiable: decisionsRaw.find(d => d._id === 'unverifiable')?.count || 0,
      pending: decisionsRaw.find(d => d._id === 'pending')?.count || 0
    };

    // 3. Platform Risk (Flagged counts per platform)
    const platformRisk = await Earning.aggregate([
      { $match: { verificationStatus: 'flagged' } },
      { $group: { _id: "$platform", flags: { $sum: 1 } } },
      { $sort: { flags: -1 } },
      { $project: { platform: "$_id", flags: 1, _id: 0 } }
    ]);

    // 4. Suspicious Patterns (Anomaly Types)
    const anomalyPatterns = await Earning.aggregate([
      { $match: { "anomalies.0": { $exists: true } } },
      { $unwind: "$anomalies" },
      { $group: { _id: "$anomalies.type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { type: "$_id", count: 1, _id: 0 } }
    ]);

    // 5. Workload
    const workload = {
      pending: decisions.pending,
      reviewed: decisions.verified + decisions.flagged + decisions.unverifiable
    };

    res.status(200).json({
      success: true,
      data: {
        activity,
        decisions,
        platformRisk,
        anomalyPatterns,
        workload
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAdvocateAnalytics = async (req, res) => {
  try {
    // 1. Commission Rate Trends (Deductions / Gross * 100)
    const commissionTrends = await Earning.aggregate([
      {
        $group: {
          _id: { 
            platform: "$platform", 
            date: { $dateToString: { format: "%Y-%m-%d", date: "$shiftStart" } } 
          },
          avgRate: { 
            $avg: {
              $cond: [
                { $gt: ["$grossAmount", 0] },
                { $multiply: [{ $divide: [{ $sum: "$deductions.amount" }, "$grossAmount"] }, 100] },
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id.date": 1 } },
      {
        $group: {
          _id: "$_id.platform",
          trends: { $push: { date: "$_id.date", rate: "$avgRate" } }
        }
      }
    ]);

    // 2. Vulnerability Flags (Workers with >20% month-on-month drop)
    // We'll calculate current month vs previous month
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    const startOfPrevMonth = new Date(startOfCurrentMonth);
    startOfPrevMonth.setMonth(startOfPrevMonth.getMonth() - 1);

    const vulnerabilityData = await Earning.aggregate([
      {
        $facet: {
          current: [
            { $match: { shiftStart: { $gte: startOfCurrentMonth } } },
            { $group: { _id: "$workerId", total: { $sum: "$netAmount" } } }
          ],
          previous: [
            { $match: { shiftStart: { $gte: startOfPrevMonth, $lt: startOfCurrentMonth } } },
            { $group: { _id: "$workerId", total: { $sum: "$netAmount" } } }
          ]
        }
      }
    ]);

    const vulnerableWorkers = [];
    const currMap = new Map(vulnerabilityData[0].current.map(i => [i._id, i.total]));
    vulnerabilityData[0].previous.forEach(p => {
        const c = currMap.get(p._id) || 0;
        if (c < p.total * 0.8) {
            vulnerableWorkers.push({
                workerId: p._id,
                prevIncome: p.total,
                currIncome: c,
                drop: ((p.total - c) / p.total * 100).toFixed(1)
            });
        }
    });

    // 3. Income Distribution by City (Profitability Heatmap Data)
    const distribution = await Earning.aggregate([
      {
        $group: {
          _id: "$city",
          avg: { $avg: "$netAmount" },
          avgHourly: { 
            $avg: { 
              $divide: ["$netAmount", { $cond: [ { $gt: ["$hoursWorked", 0] }, "$hoursWorked", 8 ] }] 
            } 
          },
          volatility: { $stdDevPop: "$netAmount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          avg: 1,
          avgHourly: 1,
          volatility: 1,
          count: 1,
          profitabilityScore: { $multiply: ["$avgHourly", { $subtract: [1, { $divide: ["$volatility", { $add: ["$avg", 1] }] }] }] }
        }
      }
    ]);

    // 4. Verification Stats
    const verificationStats = await Earning.aggregate([
      { $group: { _id: "$verificationStatus", count: { $sum: 1 } } }
    ]);

    // 5. Commission Spikes
    const spikes = [];
    const platformRates = await Earning.aggregate([
        {
            $group: {
                _id: { platform: "$platform", month: { $dateToString: { format: "%Y-%m", date: "$shiftStart" } } },
                rate: { $avg: { $multiply: [{ $divide: [{ $sum: "$deductions.amount" }, "$grossAmount"] }, 100] } }
            }
        }
    ]);
    const platMap = {};
    platformRates.forEach(r => {
        if (!platMap[r._id.platform]) platMap[r._id.platform] = [];
        platMap[r._id.platform].push(r);
    });
    for (const [platform, rates] of Object.entries(platMap)) {
        rates.sort((a,b) => b._id.month.localeCompare(a._id.month));
        if (rates.length >= 2) {
            const curr = rates[0].rate;
            const prev = rates[1].rate;
            if (curr > prev * 1.05) {
                spikes.push({
                    platform,
                    increase: ((curr - prev) / prev * 100).toFixed(1),
                    currentRate: curr.toFixed(1)
                });
            }
        }
    }

    // 7. Platform Fairness Score (Scorecard)
    // We'll combine: 
    // - Commission (Lower is better) [Max 40 pts]
    // - Volatility (Lower is better) [Max 30 pts]
    // - Verification/Community Flags [Max 30 pts]
    const platformFairness = await Earning.aggregate([
        {
            $group: {
                _id: "$platform",
                avgRate: { $avg: { $multiply: [{ $divide: [{ $sum: "$deductions.amount" }, "$grossAmount"] }, 100] } },
                avgIncome: { $avg: "$netAmount" },
                volatility: { $stdDevPop: "$netAmount" },
                flaggedCount: { $sum: { $cond: [{ $eq: ["$verificationStatus", "flagged"] }, 1, 0] } },
                totalCount: { $sum: 1 }
            }
        },
        {
            $project: {
                platform: "$_id",
                commissionScore: { $multiply: [{ $subtract: [1, { $divide: ["$avgRate", 30] }] }, 40] },
                stabilityScore: { $multiply: [{ $subtract: [1, { $divide: ["$volatility", { $add: ["$avgIncome", 1] }] }] }, 30] },
                honorScore: { $multiply: [{ $subtract: [1, { $divide: ["$flaggedCount", "$totalCount"] }] }, 30] }
            }
        },
        {
            $project: {
                platform: 1,
                score: { $floor: { $add: ["$commissionScore", "$stabilityScore", "$honorScore"] } }
            }
        },
        { $sort: { score: -1 } }
    ]);

    // 8. KPI Summary
    const totalWorkers = await Earning.distinct("workerId");
    const avgCommission = await Earning.aggregate([
        { $match: { grossAmount: { $gt: 0 } } },
        { $group: { _id: null, rate: { $avg: { $multiply: [{ $divide: [{ $sum: "$deductions.amount" }, "$grossAmount"] }, 100] } } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        commissionTrends,
        vulnerableWorkers: vulnerableWorkers.slice(0, 10),
        distribution,
        verificationStats,
        spikes,
        platformFairness,
        kpis: {
            totalWorkers: totalWorkers.length,
            vulnerableTotal: vulnerableWorkers.length,
            avgCommission: (avgCommission[0]?.rate || 0).toFixed(1),
            totalGrievances: 142 // Placeholder
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
