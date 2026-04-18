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
