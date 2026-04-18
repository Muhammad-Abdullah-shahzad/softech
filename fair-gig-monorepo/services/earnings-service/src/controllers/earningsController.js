const Earning = require('../models/Earning');
const anomalyService = require('../services/anomalyService');

exports.createEarning = async (req, res) => {
  try {
    const earningData = req.body;

    // Calculate net if not provided
    if (!earningData.netAmount) {
      const totalDeductions = (earningData.deductions || []).reduce((acc, curr) => acc + curr.amount, 0);
      earningData.netAmount = earningData.grossAmount - totalDeductions;
    }

    const earning = await Earning.create(earningData);

    // Async trigger anomaly detection (don't block the response)
    anomalyService.detectAnomaly(earning._id).catch(err => console.error('Anomaly check failed:', err));

    res.status(201).json({
      success: true,
      data: earning
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEarningsHistory = async (req, res) => {
  try {
    const { workerId, status, platform, sortBy, order } = req.query;
    
    let query = {};
    if (workerId) query.workerId = workerId;
    if (status) query.verificationStatus = status;
    if (platform) query.platform = platform;

    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy) {
        sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    }

    const earnings = await Earning.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: earnings.length,
      data: earnings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEarningById = async (req, res) => {
  try {
    const earning = await Earning.findById(req.params.id);
    if (!earning) {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }
    res.status(200).json({ success: true, data: earning });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVerificationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const earning = await Earning.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true, runValidators: true }
    );

    if (!earning) {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }

    res.status(200).json({ success: true, data: earning });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateEarning = async (req, res) => {
  try {
    const earning = await Earning.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!earning) {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }

    res.status(200).json({ success: true, data: earning });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getVerifierStats = async (req, res) => {
  try {
    const stats = await Earning.aggregate([
      {
        $group: {
          _id: "$verificationStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const dailyTrends = await Earning.aggregate([
      {
        $match: { verificationStatus: { $ne: 'unverified' } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    const platformStats = await Earning.aggregate([
      {
        $group: {
          _id: { platform: "$platform", status: "$verificationStatus" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: { stats, dailyTrends, platformStats }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
