const axios = require('axios');

/**
 * Service to aggregate data from multiple microservices via REST.
 */
class DataFetcher {
  constructor() {
    this.urls = {
      earnings: process.env.EARNINGS_SERVICE_URL || 'http://localhost:5002',
      grievance: process.env.GRIEVANCE_SERVICE_URL || 'http://localhost:5003'
    };
  }

  async fetchAllEarnings() {
    try {
      const response = await axios.get(`${this.urls.earnings}/api/earnings`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch from Earnings Service:', error.message);
      return [];
    }
  }

  async fetchAllGrievances() {
    try {
      const response = await axios.get(`${this.urls.grievance}/api/grievances`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch from Grievance Service:', error.message);
      return [];
    }
  }
}

module.exports = new DataFetcher();
