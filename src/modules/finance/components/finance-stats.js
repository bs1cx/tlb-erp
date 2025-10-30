export default {
  name: 'FinanceStats',
  props: ['stats'],
  template: `
    <div class="finance-stats">
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
          icon: 'fas fa-chart-line',
          iconClass: 'revenue',
          value: this.formatCurrency(this.stats.totalRevenue),
          label: 'Total Revenue',
          trend: '+12.5% from last month',
          trendClass: 'positive',
          trendIcon: 'fas fa-arrow-up'
        },
        {
          icon: 'fas fa-clock',
          iconClass: 'outstanding',
          value: this.formatCurrency(this.stats.outstanding),
          label: 'Outstanding',
          trend: '5 invoices pending',
          trendClass: 'warning',
          trendIcon: 'fas fa-exclamation'
        },
        {
          icon: 'fas fa-exclamation-triangle',
          iconClass: 'overdue',
          value: this.formatCurrency(this.stats.overdue),
          label: 'Overdue',
          trend: '3 invoices overdue',
          trendClass: 'negative',
          trendIcon: 'fas fa-exclamation-triangle'
        },
        {
          icon: 'fas fa-percentage',
          iconClass: 'tax',
          value: this.formatCurrency(this.stats.taxCollected),
          label: 'Tax Collected',
          trend: 'HST/GST Collected',
          trendClass: 'info',
          trendIcon: 'fas fa-receipt'
        }
      ]
    }
  },

  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount)
    }
  }
}
