export default {
  name: 'DashboardPage',
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p>Welcome back, {{ user.fullName }}!</p>
        <div class="header-actions">
          <button class="btn btn-primary" @click="refreshData">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-secondary" @click="exportReport">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <dashboard-stats :stats="stats"></dashboard-stats>

      <!-- Charts & Analytics -->
      <div class="analytics-section">
        <div class="chart-container">
          <revenue-chart :data="chartData"></revenue-chart>
        </div>
        <div class="chart-container">
          <performance-chart :data="performanceData"></performance-chart>
        </div>
      </div>

      <!-- Recent Activities & Quick Actions -->
      <div class="dashboard-content">
        <recent-activities :activities="recentActivities"></recent-activities>
        <quick-actions @action="handleQuickAction"></quick-actions>
      </div>
    </div>
  `,

  components: {
    'dashboard-stats': () => import('./components/stats-cards.js'),
    'revenue-chart': () => import('./components/charts/revenue-chart.js'),
    'performance-chart': () => import('./components/charts/performance-chart.js'),
    'recent-activities': () => import('./components/recent-activities.js'),
    'quick-actions': () => import('./components/quick-actions.js')
  },

  data() {
    return {
      user: {},
      stats: {
        totalCustomers: 0,
        monthlyRevenue: 0,
        pendingOrders: 0,
        growthRate: 0,
        activeShipments: 0,
        lowStockItems: 0
      },
      chartData: [],
      performanceData: [],
      recentActivities: []
    }
  },

  async mounted() {
    const userData = localStorage.getItem('tlb_user')
    if (userData) {
      this.user = JSON.parse(userData)
      await this.loadDashboardData()
    } else {
      this.$router.push('/login')
    }
  },

  methods: {
    async loadDashboardData() {
      try {
        // Stats data
        this.stats = {
          totalCustomers: 156,
          monthlyRevenue: 45230,
          pendingOrders: 23,
          growthRate: 12.5,
          activeShipments: 15,
          lowStockItems: 8
        }

        // Chart data
        this.chartData = [
          { month: 'Jan', revenue: 40000 },
          { month: 'Feb', revenue: 42000 },
          { month: 'Mar', revenue: 38000 },
          { month: 'Apr', revenue: 45000 },
          { month: 'May', revenue: 45230 }
        ]

        // Performance data
        this.performanceData = [
          { metric: 'Delivery Rate', value: 89 },
          { metric: 'Customer Satisfaction', value: 92 },
          { metric: 'Order Accuracy', value: 98 }
        ]

        // Recent activities
        this.recentActivities = [
          {
            icon: 'fas fa-user-check',
            title: 'New customer registered',
            description: 'Acme Corporation signed up',
            time: '2 hours ago',
            type: 'customer'
          },
          {
            icon: 'fas fa-file-invoice',
            title: 'Invoice paid',
            description: 'INV-2023-0456 marked as paid',
            time: '4 hours ago',
            type: 'finance'
          },
          {
            icon: 'fas fa-shipping-fast',
            title: 'Shipment delivered',
            description: 'Order #7894 delivered to Toronto',
            time: '6 hours ago',
            type: 'logistics'
          }
        ]

      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    },

    async refreshData() {
      await this.loadDashboardData()
    },

    exportReport() {
      // Export functionality
      console.log('Exporting dashboard report...')
    },

    handleQuickAction(action) {
      switch (action) {
        case 'create_invoice':
          this.$router.push('/finance')
          break
        case 'add_customer':
          this.$router.push('/crm')
          break
        case 'new_shipment':
          this.$router.push('/logistics')
          break
      }
    }
  }
}
