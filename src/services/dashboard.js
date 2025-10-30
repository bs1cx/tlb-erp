export const dashboardService = {
  async getDashboardData() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: {
            totalCustomers: 156,
            monthlyRevenue: 45230,
            pendingOrders: 23,
            growthRate: 12.5,
            activeShipments: 15,
            lowStockItems: 8
          },
          chartData: [
            { month: 'Jan', revenue: 40000 },
            { month: 'Feb', revenue: 42000 },
            { month: 'Mar', revenue: 38000 },
            { month: 'Apr', revenue: 45000 },
            { month: 'May', revenue: 45230 }
          ],
          recentActivities: [
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
            }
          ]
        })
      }, 1000)
    })
  },

  async exportDashboardReport(format = 'pdf') {
    // Export functionality
    console.log(`Exporting dashboard report as ${format}`)
    return { success: true, message: `Report exported as ${format}` }
  }
}
