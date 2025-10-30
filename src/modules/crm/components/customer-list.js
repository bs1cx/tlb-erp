export default {
  name: 'CustomerList',
  props: ['customers'],
  template: `
    <div class="customer-list">
      <div class="list-header">
        <h3>Customer Directory</h3>
        <div class="list-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search customers..." v-model="searchQuery">
          </div>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
          <select v-model="sourceFilter" class="filter-select">
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social">Social Media</option>
            <option value="event">Event</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Customer Value</th>
              <th>Last Contact</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td>
                <div class="company-info">
                  <strong>{{ customer.company }}</strong>
                  <div class="source-badge" :class="'source-' + customer.source">
                    {{ getSourceName(customer.source) }}
                  </div>
                </div>
              </td>
              <td>{{ customer.contact }}</td>
              <td>
                <div class="contact-info">
                  <div><i class="fas fa-envelope"></i> {{ customer.email }}</div>
                  <div><i class="fas fa-phone"></i> {{ customer.phone }}</div>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(customer.status)">
                  {{ getStatusText(customer.status) }}
                </span>
              </td>
              <td>
                <div class="value-info">
                  <strong>{{ formatCurrency(customer.value) }}</strong>
                </div>
              </td>
              <td>
                <div class="contact-date">
                  {{ formatDate(customer.lastContact) }}
                  <div class="days-ago" v-if="getDaysAgo(customer.lastContact) > 0">
                    {{ getDaysAgo(customer.lastContact) }} days ago
                  </div>
                </div>
              </td>
              <td>
                <div class="tags">
                  <span v-for="tag in customer.tags" :key="tag" class="tag" :class="'tag-' + tag.toLowerCase()">
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="$emit('view-customer', customer)" title="View Profile">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-icon" @click="$emit('edit-customer', customer)" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon" @click="$emit('add-activity', customer)" title="Add Activity">
                    <i class="fas fa-plus"></i>
                  </button>
                  <button class="btn-icon" title="Send Email">
                    <i class="fas fa-envelope"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="list-footer" v-if="filteredCustomers.length === 0">
        <div class="empty-state">
          <i class="fas fa-users"></i>
          <h4>No customers found</h4>
          <p>No customers match your current filters.</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      sourceFilter: ''
    }
  },

  computed: {
    filteredCustomers() {
      let filtered = this.customers

      // Apply search filter
      if (this.searchQuery) {
        filtered = filtered.filter(customer => 
          customer.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.contact.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(customer => customer.status === this.statusFilter)
      }

      // Apply source filter
      if (this.sourceFilter) {
        filtered = filtered.filter(customer => customer.source === this.sourceFilter)
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

    getDaysAgo(dateString) {
      const today = new Date()
      const lastDate = new Date(dateString)
      const diffTime = today - lastDate
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    },

    getStatusClass(status) {
      const statusClasses = {
        active: 'status-active',
        inactive: 'status-inactive',
        prospect: 'status-prospect'
      }
      return statusClasses[status] || 'status-active'
    },

    getStatusText(status) {
      const statusTexts = {
        active: 'Active',
        inactive: 'Inactive',
        prospect: 'Prospect'
      }
      return statusTexts[status] || status
    },

    getSourceName(source) {
      const sourceNames = {
        website: 'Website',
        referral: 'Referral',
        social: 'Social Media',
        event: 'Event'
      }
      return sourceNames[source] || source
    }
  }
}
