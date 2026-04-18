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
    const { workerId } = req.query;
    const query = workerId ? { workerId } : {};

    const earnings = await Earning.find(query).sort({ shiftStart: -1 });

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
