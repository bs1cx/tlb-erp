export default {
  name: 'InvoiceList',
  props: ['invoices'],
  template: `
    <div class="invoice-list">
      <div class="list-header">
        <h3>Recent Invoices</h3>
        <div class="list-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search invoices..." v-model="searchQuery">
          </div>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in filteredInvoices" :key="invoice.id">
              <td><strong>{{ invoice.id }}</strong></td>
              <td>{{ invoice.customer }}</td>
              <td>{{ formatDate(invoice.date) }}</td>
              <td>{{ formatDate(invoice.dueDate) }}</td>
              <td>{{ formatCurrency(invoice.amount) }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(invoice.status)">
                  {{ getStatusText(invoice.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="$emit('view-invoice', invoice)" title="View">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-icon" @click="$emit('edit-invoice', invoice)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  data() {
    return {
      searchQuery: '',
      statusFilter: ''
    }
  },

  computed: {
    filteredInvoices() {
      let filtered = this.invoices

      if (this.searchQuery) {
        filtered = filtered.filter(invoice => 
          invoice.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          invoice.customer.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      if (this.statusFilter) {
        filtered = filtered.filter(invoice => invoice.status === this.statusFilter)
      }

      return filtered
    }
  },

  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-CA')
    },

    getStatusClass(status) {
      const statusClasses = {
        paid: 'status-paid',
        pending: 'status-pending',
        overdue: 'status-overdue'
      }
      return statusClasses[status] || 'status-pending'
    },

    getStatusText(status) {
      const statusTexts = {
        paid: 'Paid',
        pending: 'Pending',
        overdue: 'Overdue'
      }
      return statusTexts[status] || status
    }
  }
}
