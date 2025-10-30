export default {
  name: 'InventoryStats',
  props: ['stats'],
  template: `
    <div class="inventory-stats">
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
          icon: 'fas fa-boxes',
          iconClass: 'total',
          value: this.stats.totalProducts.toLocaleString(),
          label: 'Total Products',
          trend: '+23 this month',
          trendClass: 'positive',
          trendIcon: 'fas fa-arrow-up'
        },
        {
          icon: 'fas fa-exclamation-triangle',
          iconClass: 'low-stock',
          value: this.stats.lowStockItems,
          label: 'Low Stock Items',
          trend: 'Need attention',
          trendClass: 'warning',
          trendIcon: 'fas fa-exclamation'
        },
        {
          icon: 'fas fa-times-circle',
          iconClass: 'out-of-stock',
          value: this.stats.outOfStock,
          label: 'Out of Stock',
          trend: 'Urgent reorder needed',
          trendClass: 'negative',
          trendIcon: 'fas fa-exclamation-triangle'
        },
        {
          icon: 'fas fa-dollar-sign',
          iconClass: 'value',
          value: this.formatCurrency(this.stats.totalValue),
          label: 'Total Inventory Value',
          trend: '+5.2% from last month',
          trendClass: 'positive',
          trendIcon: 'fas fa-chart-line'
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
