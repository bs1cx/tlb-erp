export default {
  name: 'CRMStats',
  props: ['stats'],
  template: `
    <div class="crm-stats">
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
          icon: 'fas fa-bullseye',
          iconClass: 'leads',
          value: this.stats.activeLeads,
          label: 'Active Leads',
          trend: '5 hot leads',
          trendClass: 'warning',
          trendIcon: 'fas fa-fire'
        },
        {
          icon: 'fas fa-chart-line',
          iconClass: 'conversion',
          value: this.stats.conversionRate + '%',
          label: 'Conversion Rate',
          trend: '+5% from last month',
          trendClass: 'positive',
          trendIcon: 'fas fa-arrow-up'
        },
        {
          icon: 'fas fa-heart',
          iconClass: 'satisfaction',
          value: this.stats.customerSatisfaction + '%',
          label: 'Customer Satisfaction',
          trend: 'Industry avg: 85%',
          trendClass: 'positive',
          trendIcon: 'fas fa-star'
        }
      ]
    }
  }
}
