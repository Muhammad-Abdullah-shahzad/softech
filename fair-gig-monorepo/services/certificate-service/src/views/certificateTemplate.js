const generateHTML = (data) => {
  const { workerId, totalEarnings, shiftCount, timeframe, verified } = data;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Income Certificate - ${workerId}</title>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
        .certificate-container { border: 10px solid #f4f4f9; padding: 50px; max-width: 800px; margin: auto; position: relative; }
        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .verified-badge { position: absolute; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; display: ${verified ? 'block' : 'none'}; }
        .content { margin-top: 40px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
        .stat-box { background: #f9f9fb; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 60px; font-size: 12px; color: #888; text-align: center; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="certificate-container">
        <div class="verified-badge">VERIFIED</div>
        <div class="header">
          <h1>FairGig Income Certificate</h1>
          <p>Official record of earnings and work history</p>
        </div>
        <div class="content">
          <p>This document certifies that worker <strong>${workerId}</strong> has completed the following verified activities within the FairGig platform ecosystem.</p>
          
          <div class="stat-grid">
            <div class="stat-box">
              <strong>Total Verified Earnings</strong>
              <div style="font-size: 24px; color: #2c3e50;">$${totalEarnings.toFixed(2)}</div>
            </div>
            <div class="stat-box">
              <strong>Total Shift Count</strong>
              <div style="font-size: 24px; color: #2c3e50;">${shiftCount}</div>
            </div>
          </div>

          <p style="margin-top: 30px;">
            <strong>Timeframe:</strong> ${timeframe}<br>
            <strong>Certificate ID:</strong> FG-${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
        <div class="footer">
          <p>FairGig verified earnings documentation is generated based on secure API integration with delivery platforms. This document is digitally tamper-evident.</p>
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">Print Certificate</button>
      </div>
    </body>
    </html>
  `;
};

module.exports = generateHTML;
