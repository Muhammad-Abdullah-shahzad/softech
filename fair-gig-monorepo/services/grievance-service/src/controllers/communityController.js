const CommunityPost = require('../models/CommunityPost');

exports.createPost = async (req, res) => {
  try {
    const { workerId, platform, category, title, description, city } = req.body;
    
    // Generate a consistent anonymous ID for this worker (e.g. Worker #abcd)
    // We take the first 4 chars of their ID to make it persistent but anonymous
    const anonymousId = `Worker #${workerId.substring(workerId.length - 4)}`;

    const post = await CommunityPost.create({
      workerId,
      anonymousId,
      platform,
      category,
      title,
      description,
      city
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { platform, category, city, search, sortBy } = req.query;
    
    let query = {};
    if (platform) query.platform = platform;
    if (category) query.category = category;
    if (city) query.city = city;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'upvotes') sort = { upvotes: -1 };

    // Select fields to ENSURE workerId is NEVER EXPOSED
    const posts = await CommunityPost.find(query)
      .select('-workerId')
      .sort(sort);

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    // 1. Most reported category this week
    const categoryStats = await CommunityPost.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // 2. Platform with most activity
    const platformStats = await CommunityPost.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        topCategories: categoryStats,
        topPlatforms: platformStats,
        mostReportedIssue: categoryStats[0]?._id || 'General Enquiries'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyPosts = async (req, res) => {
    try {
        const { workerId } = req.query;
        const posts = await CommunityPost.find({ workerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updatePostStatus = async (req, res) => {
  try {
    const { status, tags } = req.body;
    const update = {};
    if (status) update.status = status;
    if (tags) update.tags = tags;

    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const Broadcast = require('../models/Broadcast');

exports.getAdvocateStats = async (req, res) => {
  try {
    // 1. Most reported issue (Category)
    const categoryStats = await CommunityPost.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Rising Issue (Simplified: platform with most growth in last 7 days vs prev 7)
    // For now, just show Platform with highest count
    const platformStats = await CommunityPost.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 3. Mini Trend (last 7 days counts)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trend = await CommunityPost.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        mostReported: categoryStats[0],
        risingIssue: platformStats[0],
        trend
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBroadcast = async (req, res) => {
  try {
    const { content, author } = req.body;
    const broadcast = await Broadcast.create({ content, author });
    res.status(201).json({ success: true, data: broadcast });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getBroadcasts = async (req, res) => {
    try {
        const data = await Broadcast.find().sort({ createdAt: -1 }).limit(5);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
