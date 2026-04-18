const dataFetcher = require('../services/dataFetcher');

exports.getAdvocateKPIs = async (req, res) => {
  try {
    // 1. Fetch raw data from sibling services
    const [earnings, grievances] = await Promise.all([
      dataFetcher.fetchAllEarnings(),
      dataFetcher.fetchAllGrievances()
    ]);

    // 2. Aggregate Platform Commission Trends
    const commissionMetrics = earnings.reduce((acc, curr) => {
      const platform = curr.platform || 'Other';
      const commission = curr.grossAmount - curr.netAmount;
      
      if (!acc[platform]) acc[platform] = { totalVolume: 0, totalCommission: 0 };
      acc[platform].totalVolume += curr.grossAmount;
      acc[platform].totalCommission += commission;
      return acc;
    }, {});

    // 3. Vulnerability Flags
    const vulnerabilityMetrics = {
      flaggedEarnings: earnings.filter(e => e.verificationStatus === 'flagged').length,
      unresolvedGrievances: grievances.filter(g => g.status !== 'resolved').length,
      activeClusters: [...new Set(grievances.map(g => g.clusterId?._id).filter(id => id))].length
    };

    // 4. Income Distribution (Simple Bins)
    const distribution = {
      under_100: earnings.filter(e => e.netAmount < 100).length,
      mid_100_500: earnings.filter(e => e.netAmount >= 100 && e.netAmount < 500).length,
      high_500_plus: earnings.filter(e => e.netAmount >= 500).length
    };

    res.status(200).json({
      success: true,
      data: {
        commissionTrends: commissionMetrics,
        vulnerability: vulnerabilityMetrics,
        incomeDistribution: distribution,
        timestamp: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkerStats = async (req, res) => {
  try {
    const { workerId } = req.params;
    const earnings = await dataFetcher.fetchWorkerEarnings(workerId);
    
    const totalEarnings = earnings.reduce((sum, e) => sum + (e.grossEarnings - e.deductions), 0);
    const grossEarnings = earnings.reduce((sum, e) => sum + e.grossEarnings, 0);
    const totalDeductions = earnings.reduce((sum, e) => sum + e.deductions, 0);
    const totalHours = earnings.reduce((sum, e) => sum + e.hours, 0);
    
    // Platform distribution
    const platforms = earnings.reduce((acc, e) => {
        acc[e.platform] = (acc[e.platform] || 0) + (e.grossEarnings - e.deductions);
        return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        grossEarnings,
        totalDeductions,
        hourlyRate: totalHours > 0 ? Math.round(totalEarnings / totalHours) : 0,
        earningsTrend: 12, // Mocked trend
        rateTrend: 5,     // Mocked trend
        platformBreakdown: Object.keys(platforms).map(p => ({ platform: p, earnings: platforms[p] }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrends = async (req, res) => {
  try {
    const { workerId } = req.params;
    const earnings = await dataFetcher.fetchWorkerEarnings(workerId);
    
    // Mocked trend data based on historical records
    const mockTrends = [
        { date: '2026-04-12', amount: 1200, rate: 210, cityAvg: 190 },
        { date: '2026-04-13', amount: 1500, rate: 230, cityAvg: 190 },
        { date: '2026-04-14', amount: 800, rate: 180, cityAvg: 190 },
        { date: '2026-04-15', amount: 2200, rate: 250, cityAvg: 190 },
        { date: '2026-04-16', amount: 1100, rate: 200, cityAvg: 192 },
        { date: '2026-04-17', amount: 1750, rate: 215, cityAvg: 192 },
    ];

    res.status(200).json({ success: true, data: mockTrends });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPlatformComparison = async (req, res) => {
    res.status(200).json({
        success: true,
        data: [
            { name: 'Uber', commissionRate: 25 },
            { name: 'Zomato', commissionRate: 20 },
            { name: 'Swiggy', commissionRate: 18 },
            { name: 'Ola', commissionRate: 22 },
        ]
    });
};

exports.getCityMedian = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            medianRate: 192,
            yourRate: 215
        }
    });
};

exports.getCommunityInsights = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            rateChanges: [
                { platform: 'Uber', city: 'Mumbai', change: -5 },
                { platform: 'Zomato', city: 'Delhi', change: 8 },
                { platform: 'Swiggy', city: 'Bangalore', change: 3 }
            ]
        }
    });
};
