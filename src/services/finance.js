export const financeService = {
  async getInvoices(filters = {}) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          invoices: [
            {
              id: 'INV-2023-1001',
              customer: 'Acme Corporation',
              date: '2023-09-15',
              dueDate: '2023-10-15',
              amount: 2500.00,
              tax: 325.00,
              total: 2825.00,
              status: 'paid',
              currency: 'CAD'
            },
            {
              id: 'INV-2023-1002',
              customer: 'Global Tech Inc.',
              date: '2023-09-18',
              dueDate: '2023-10-18',
              amount: 1800.00,
              tax: 234.00,
              total: 2034.00,
              status: 'pending',
              currency: 'CAD'
            }
          ],
          total: 125430,
          outstanding: 24500,
          overdue: 8500
        })
      }, 1000)
    })
  },

  async createInvoice(invoiceData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          invoice: {
            ...invoiceData,
            id: 'INV-' + Date.now()
          }
        })
      }, 1500)
    })
  },

  async recordPayment(paymentData) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payment: {
            ...paymentData,
            id: 'PAY-' + Date.now()
          }
        })
      }, 1000)
    })
  },

  async getTaxReport(period) {
    // Simulate tax report generation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          period: period,
          totalSales: 125430,
          taxCollected: 15670,
          hstCollected: 12536,
          gstCollected: 3134,
          breakdown: [
            { province: 'ON', taxRate: 13, amount: 8450 },
            { province: 'BC', taxRate: 12, amount: 3240 },
            { province: 'AB', taxRate: 5, amount: 1560 }
          ]
        })
      }, 2000)
    })
  },

  async exportFinancialData(format = 'pdf') {
    // Simulate export
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Financial data exported as ${format}`,
          downloadUrl: '/exports/finance-report.pdf'
        })
      }, 1000)
    })
  }
}
