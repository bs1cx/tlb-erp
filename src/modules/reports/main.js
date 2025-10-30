export default {
  name: 'ReportsPage',
  template: `
    <div class="reports-module">
      <div class="module-header">
        <h2><i class="fas fa-chart-bar"></i> Reports & Analytics</h2>
        <button class="btn btn-success" style="width: auto;">
          <i class="fas fa-download"></i> Export Report
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">15</div>
          <div>Available Reports</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">89%</div>
          <div>Data Accuracy</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">24/7</div>
          <div>Availability</div>
        </div>
      </div>

      <h3>Report Templates</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4><i class="fas fa-chart-line"></i> Sales Report</h4>
          <p>Monthly sales performance and trends</p>
          <button class="btn btn-sm" style="margin-top: 10px;">Generate</button>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4><i class="fas fa-truck"></i> Logistics Report</h4>
          <p>Shipping performance and delivery metrics</p>
          <button class="btn btn-sm" style="margin-top: 10px;">Generate</button>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4><i class="fas fa-boxes"></i> Inventory Report</h4>
          <p>Stock levels and turnover analysis</p>
          <button class="btn btn-sm" style="margin-top: 10px;">Generate</button>
        </div>
      </div>
    </div>
  `
}
