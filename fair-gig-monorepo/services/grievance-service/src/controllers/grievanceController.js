const Grievance = require('../models/Grievance');
const Cluster = require('../models/Cluster');
const axios = require('axios');

exports.createGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.create(req.body);
    
    // Logic: Look for existing clusters with the same issueType and platform
    // For simplicity, we assume 'platform' comes in req.body or we fetch it from Earnings
    let cluster = await Cluster.findOne({ 
      issueType: grievance.issueType, 
      status: 'active' 
    });

    if (cluster) {
      grievance.clusterId = cluster._id;
      grievance.status = 'clustered';
      await grievance.save();
      
      cluster.grievanceCount += 1;
      await cluster.save();

      // Notify worker via Notification Service (FastAPI)
      const NOTIF_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8001';
      axios.post(`${NOTIF_URL}/v1/notify`, {
        worker_id: grievance.workerId,
        message: `Your grievance has been added to an active cluster: ${cluster.title}`,
        type: 'cluster_update'
      }).catch(err => console.error('Notification failed:', err.message));

    } else {
      // Logic to create a new cluster if threshold met (e.g. 5 similar grievances)
      const count = await Grievance.countDocuments({ 
        issueType: grievance.issueType, 
        status: 'open' 
      });

      if (count >= 5) {
          const newCluster = await Cluster.create({
            title: `Systemic ${grievance.issueType} issue`,
            issueType: grievance.issueType,
            grievanceCount: count
          });
          
          await Grievance.updateMany(
            { issueType: grievance.issueType, status: 'open' },
            { clusterId: newCluster._id, status: 'clustered' }
          );
      }
    }

    res.status(201).json({ success: true, data: grievance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getGrievances = async (req, res) => {
  try {
    const data = await Grievance.find().populate('clusterId');
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
