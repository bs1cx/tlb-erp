export default {
  name: 'FinancePage',
  template: `
    <div class="finance">
      <div class="page-header">
        <h1><i class="fas fa-file-invoice-dollar"></i> Finance & Invoicing</h1>
        <button class="btn btn-primary" @click="createInvoice">
          <i class="fas fa-plus"></i> New Invoice
        </button>
      </div>

      <div class="finance-stats">
        <div class="stat-card">
          <div class="stat-value">$45,230</div>
          <div class="stat-label">Total Revenue</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$12,540</div>
          <div class="stat-label">Outstanding</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">23</div>
          <div class="stat-label">Pending Invoices</div>
        </div>
      </div>

      <div class="invoices-section">
        <h3>Recent Invoices</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td>{{ invoice.number }}</td>
              <td>{{ invoice.customer }}</td>
              <td>{{ invoice.date }}</td>
              <td>{{ invoice.amount }}</td>
              <td>
                <span :class="['status-badge', invoice.status]">
                  {{ invoice.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm" @click="viewInvoice(invoice)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm" @click="editInvoice(invoice)">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  data() {
    return {
      invoices: [
        {
          id: 1,
          number: 'INV-2023-1001',
          customer: 'Acme Corporation',
          date: '2023-09-15',
          amount: '$2,500.00',
          status: 'paid'
        },
        {
          id: 2,
          number: 'INV-2023-1002', 
          customer: 'Global Tech Inc.',
          date: '2023-09-18',
          amount: '$1,800.00',
          status: 'pending'
        }
      ]
    }
  },

  methods: {
    createInvoice() {
      alert('Create invoice functionality coming soon!')
    },
    viewInvoice(invoice) {
      alert(`Viewing invoice: ${invoice.number}`)
    },
    editInvoice(invoice) {
      alert(`Editing invoice: ${invoice.number}`)
    }
  },

  mounted() {
    const user = localStorage.getItem('tlb_user')
    if (!user) {
      this.$router.push('/login')
    }
  }
}
