export default {
  name: 'DashboardStats',
  props: ['stats'],
  template: `
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in formattedStats" :key="stat.label">
        <div class="stat-icon" :class="stat.iconClass">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div v-if="stat.trend" class="stat-trend" :class="stat.trendClass">
            <i :class="stat.trendIcon"></i>
            {{ stat.trend }}
          </div>
        </div>
      </div>
    </div>
  `,

  computed: {
    formattedStats() {
      return [
        {
          icon: 'fas fa-users',
          iconClass: 'customers',
          value: this.stats.totalCustomers,
          label: 'Total Customers',
          trend: '+12 this month',
          trendClass: 'positive',
          trendIcon: 'fas fa-arrow-up'
        },
        {
          icon: 'fas fa-file-invoice-dollar',
          iconClass: 'revenue',
          value: '$' + this.stats.monthlyRevenue.toLocaleString(),
          label: 'Monthly Revenue',
          trend: '+5.2% from last month',
          trendClass: 'positive',
          trendIcon: 'fas fa-arrow-up'
        },
        {
          icon: 'fas fa-shopping-cart',
          iconClass: 'orders',
          value: this.stats.pendingOrders,
          label: 'Pending Orders',
          trend: 'Need attention',
          trendClass: 'warning',
          trendIcon: 'fas fa-exclamation'
        },
        {
          icon: 'fas fa-chart-line',
          iconClass: 'growth',
          value: '+' + this.stats.growthRate + '%',
          label: 'Growth Rate',
          trend: 'On track',
          trendClass: 'positive',
          trendIcon: 'fas fa-check'
        }
      ]
    }
  }
}
