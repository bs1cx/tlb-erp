export default {
  name: 'SettingsPage',
  template: `
    <div class="settings">
      <div class="page-header">
        <h1><i class="fas fa-cog"></i> System Settings</h1>
      </div>

      <div class="settings-tabs">
        <div class="tab-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i> {{ tab.name }}
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'company'" class="tab-pane">
            <h3>Company Information</h3>
            <form class="settings-form">
              <div class="form-group">
                <label>Company Name</label>
                <input type="text" v-model="company.name" placeholder="Enter company name">
              </div>
              <div class="form-group">
                <label>Tax ID</label>
                <input type="text" v-model="company.taxId" placeholder="Enter tax ID">
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>

          <div v-if="activeTab === 'users'" class="tab-pane">
            <h3>User Management</h3>
            <p>Manage system users and permissions.</p>
            <button class="btn btn-primary" @click="addUser">
              <i class="fas fa-user-plus"></i> Add User
            </button>
          </div>

          <div v-if="activeTab === 'billing'" class="tab-pane">
            <h3>Billing & Subscription</h3>
            <div class="subscription-card">
              <h4>Premium Plan</h4>
              <p>10 users  $99/month</p>
              <button class="btn btn-primary">Upgrade Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      activeTab: 'company',
      tabs: [
        { id: 'company', name: 'Company', icon: 'fas fa-building' },
        { id: 'users', name: 'Users', icon: 'fas fa-users' },
        { id: 'billing', name: 'Billing', icon: 'fas fa-credit-card' }
      ],
      company: {
        name: 'TLB Solutions Inc.',
        taxId: '123456789'
      }
    }
  },

  methods: {
    addUser() {
      alert('Add user functionality coming soon!')
    }
  },

  mounted() {
    const user = localStorage.getItem('tlb_user')
    if (!user) {
      this.$router.push('/login')
    }
  }
}
