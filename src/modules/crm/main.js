export default {
  name: 'CRMPage',
  template: `
    <div class="crm-module">
      <!-- Header -->
      <div class="module-header">
        <div class="header-content">
          <h1><i class="fas fa-users"></i> Customer Relationship Management</h1>
          <p>Manage customer interactions, track leads, and grow your business</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="showAddCustomer">
            <i class="fas fa-user-plus"></i> Add Customer
          </button>
          <button class="btn btn-secondary" @click="exportCustomers">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <crm-stats :stats="crmStats"></crm-stats>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
        <div class="action-grid">
          <button class="action-card" @click="showAddCustomer">
            <div class="action-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <span>Add Customer</span>
          </button>
          <button class="action-card" @click="showAddLead">
            <div class="action-icon">
              <i class="fas fa-bullseye"></i>
            </div>
            <span>Add Lead</span>
          </button>
          <button class="action-card" @click="showScheduleActivity">
            <div class="action-icon">
              <i class="fas fa-calendar-plus"></i>
            </div>
            <span>Schedule Activity</span>
          </button>
          <button class="action-card" @click="showSendBulkEmail">
            <div class="action-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <span>Bulk Email</span>
          </button>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div class="crm-tabs">
        <div class="tab-headers">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-header', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
            <span class="tab-badge" v-if="tab.badge">{{ tab.badge }}</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- Customers Tab -->
          <div v-if="activeTab === 'customers'" class="tab-pane">
            <customer-list 
              :customers="customers"
              @edit-customer="editCustomer"
              @view-customer="viewCustomer"
              @add-activity="showAddActivity"
            ></customer-list>
          </div>

          <!-- Leads Tab -->
          <div v-if="activeTab === 'leads'" class="tab-pane">
            <lead-list 
              :leads="leads"
              @convert-lead="convertLead"
              @edit-lead="editLead"
            ></lead-list>
          </div>

          <!-- Activities Tab -->
          <div v-if="activeTab === 'activities'" class="tab-pane">
            <activity-timeline 
              :activities="recentActivities"
              @add-activity="showAddActivity"
            ></activity-timeline>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" class="tab-pane">
            <crm-analytics 
              :analyticsData="analyticsData"
              @generate-report="generateReport"
            ></crm-analytics>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <customer-modal 
        v-if="showCustomerModal"
        :customer="editingCustomer"
        @save="saveCustomer"
        @close="closeCustomerModal"
      ></customer-modal>

      <lead-modal 
        v-if="showLeadModal"
        :lead="editingLead"
        @save="saveLead"
        @close="closeLeadModal"
      ></lead-modal>
    </div>
  `,

  components: {
    'crm-stats': () => import('./components/crm-stats.js'),
    'customer-list': () => import('./components/customer-list.js'),
    'lead-list': () => import('./components/lead-list.js'),
    'activity-timeline': () => import('./components/activity-timeline.js'),
    'crm-analytics': () => import('./components/crm-analytics.js'),
    'customer-modal': () => import('./components/customer-modal.js'),
    'lead-modal': () => import('./components/lead-modal.js')
  },

  data() {
    return {
      activeTab: 'customers',
      tabs: [
        { id: 'customers', label: 'Customers', icon: 'fas fa-users', badge: 156 },
        { id: 'leads', label: 'Leads', icon: 'fas fa-bullseye', badge: 23 },
        { id: 'activities', label: 'Activities', icon: 'fas fa-history', badge: 45 },
        { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar' }
      ],
      showCustomerModal: false,
      showLeadModal: false,
      editingCustomer: null,
      editingLead: null,
      crmStats: {
        totalCustomers: 0,
        activeLeads: 0,
        conversionRate: 0,
        customerSatisfaction: 0
      },
      customers: [],
      leads: [],
      recentActivities: [],
      analyticsData: {}
    }
  },

  async mounted() {
    await this.loadCRMData()
  },

  methods: {
    async loadCRMData() {
      // Load CRM data from API
      this.crmStats = {
        totalCustomers: 156,
        activeLeads: 23,
        conversionRate: 68,
        customerSatisfaction: 92
      }

      this.customers = [
        {
          id: 1,
          company: 'Acme Corporation',
          contact: 'John Smith',
          email: 'john@acme.com',
          phone: '+1-555-0123',
          status: 'active',
          value: 125000,
          lastContact: '2023-09-20',
          source: 'referral',
          tags: ['VIP', 'Enterprise']
        },
        {
          id: 2,
          company: 'Global Tech Inc.',
          contact: 'Sarah Johnson',
          email: 'sarah@globaltech.com',
          phone: '+1-555-0124',
          status: 'active',
          value: 85000,
          lastContact: '2023-09-18',
          source: 'website',
          tags: ['SMB']
        }
      ]

      this.leads = [
        {
          id: 1,
          company: 'Startup XYZ',
          contact: 'Mike Wilson',
          email: 'mike@startupxyz.com',
          phone: '+1-555-0125',
          status: 'new',
          source: 'website',
          budget: 25000,
          nextFollowUp: '2023-09-25'
        }
      ]

      this.recentActivities = [
        {
          id: 1,
          type: 'call',
          customer: 'Acme Corporation',
          description: 'Product demo call',
          date: '2023-09-22 14:30',
          status: 'completed'
        },
        {
          id: 2,
          type: 'email',
          customer: 'Global Tech Inc.',
          description: 'Follow-up on proposal',
          date: '2023-09-21 10:15',
          status: 'completed'
        }
      ]
    },

    showAddCustomer() {
      this.editingCustomer = null
      this.showCustomerModal = true
    },

    editCustomer(customer) {
      this.editingCustomer = customer
      this.showCustomerModal = true
    },

    async saveCustomer(customerData) {
      // Save customer logic
      console.log('Saving customer:', customerData)
      this.showCustomerModal = false
      await this.loadCRMData()
    },

    closeCustomerModal() {
      this.showCustomerModal = false
      this.editingCustomer = null
    },

    showAddLead() {
      this.editingLead = null
      this.showLeadModal = true
    },

    async saveLead(leadData) {
      // Save lead logic
      console.log('Saving lead:', leadData)
      this.showLeadModal = false
      await this.loadCRMData()
    },

    closeLeadModal() {
      this.showLeadModal = false
      this.editingLead = null
    },

    viewCustomer(customer) {
      console.log('Viewing customer:', customer)
      // Navigate to customer detail view
    },

    convertLead(lead) {
      if (confirm(`Convert lead ${lead.company} to customer?`)) {
        console.log('Converting lead:', lead)
        this.loadCRMData()
      }
    },

    editLead(lead) {
      this.editingLead = lead
      this.showLeadModal = true
    },

    showScheduleActivity() {
      this.activeTab = 'activities'
    },

    showAddActivity(customer) {
      console.log('Add activity for:', customer)
      // Show add activity modal
    },

    showSendBulkEmail() {
      console.log('Send bulk email clicked')
    },

    async generateReport() {
      // Generate CRM report
      console.log('Generating CRM report...')
    },

    exportCustomers() {
      console.log('Exporting customer data...')
    }
  }
}
