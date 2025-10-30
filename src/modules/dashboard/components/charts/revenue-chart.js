export default {
  name: 'RevenueChart',
  props: ['data'],
  template: `
    <div class="chart-card">
      <div class="chart-header">
        <h3><i class="fas fa-chart-line"></i> Revenue Overview</h3>
        <select v-model="selectedPeriod" @change="updateChart">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div class="chart-container">
        <div class="chart-placeholder">
          <i class="fas fa-chart-bar" style="font-size: 48px; color: #e2e8f0; margin-bottom: 16px;"></i>
          <p style="color: #94a3b8;">Revenue chart will be displayed here</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      selectedPeriod: 'monthly'
    }
  },

  methods: {
    updateChart() {
      console.log('Updating chart for period:', this.selectedPeriod)
    }
  }
}
