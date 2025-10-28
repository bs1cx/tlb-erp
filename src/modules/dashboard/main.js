export default {
  name: 'DashboardPage',
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p>Welcome back, {{ user.fullName }}!</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">156</div>
            <div class="stat-label">Total Customers</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-file-invoice-dollar"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">$45,230</div>
            <div class="stat-label">Monthly Revenue</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">89</div>
            <div class="stat-label">Pending Orders</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">+12.5%</div>
            <div class="stat-label">Growth Rate</div>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-activity">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item">
              <i class="fas fa-user-check"></i>
              <div class="activity-content">
                <strong>New customer registered</strong>
                <span>Acme Corporation signed up</span>
              </div>
              <span class="activity-time">2 hours ago</span>
            </div>
            <div class="activity-item">
              <i class="fas fa-file-invoice"></i>
              <div class="activity-content">
                <strong>Invoice paid</strong>
                <span>INV-2023-0456 marked as paid</span>
              </div>
              <span class="activity-time">4 hours ago</span>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button class="btn btn-primary" @click="$router.push('/finance')">
              <i class="fas fa-plus"></i> Create Invoice
            </button>
            <button class="btn btn-secondary" @click="$router.push('/crm')">
              <i class="fas fa-user-plus"></i> Add Customer
            </button>
            <button class="btn btn-secondary">
              <i class="fas fa-chart-bar"></i> View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      user: {}
    }
  },

  mounted() {
    const userData = localStorage.getItem('tlb_user')
    if (userData) {
      this.user = JSON.parse(userData)
    } else {
      this.$router.push('/login')
    }
  }
}
