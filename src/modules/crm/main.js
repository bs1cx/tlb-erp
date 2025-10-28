export default {
  name: 'CRMPage',
  template: `
    <div class="crm">
      <div class="page-header">
        <h1><i class="fas fa-users"></i> Customer Management</h1>
        <button class="btn btn-primary" @click="addCustomer">
          <i class="fas fa-user-plus"></i> Add Customer
        </button>
      </div>

      <div class="crm-stats">
        <div class="stat-card">
          <div class="stat-value">156</div>
          <div class="stat-label">Total Customers</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">23</div>
          <div class="stat-label">New This Month</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$125K</div>
          <div class="stat-label">Customer Value</div>
        </div>
      </div>

      <div class="customers-section">
        <h3>Customer List</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td>{{ customer.company }}</td>
              <td>{{ customer.contact }}</td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phone }}</td>
              <td>
                <span :class="['status-badge', customer.status]">
                  {{ customer.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm" @click="viewCustomer(customer)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm" @click="editCustomer(customer)">
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
      customers: [
        {
          id: 1,
          company: 'Acme Corporation',
          contact: 'John Smith',
          email: 'john@acme.com',
          phone: '+1-555-0123',
          status: 'active'
        },
        {
          id: 2,
          company: 'Global Tech Inc.',
          contact: 'Sarah Johnson', 
          email: 'sarah@globaltech.com',
          phone: '+1-555-0124',
          status: 'active'
        }
      ]
    }
  },

  methods: {
    addCustomer() {
      alert('Add customer functionality coming soon!')
    },
    viewCustomer(customer) {
      alert(`Viewing customer: ${customer.company}`)
    },
    editCustomer(customer) {
      alert(`Editing customer: ${customer.company}`)
    }
  },

  mounted() {
    const user = localStorage.getItem('tlb_user')
    if (!user) {
      this.$router.push('/login')
    }
  }
}
