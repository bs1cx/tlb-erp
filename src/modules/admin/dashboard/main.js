import { apiService } from '../../../../services/api.js'
import { COMPANY_PLANS_DETAILED, INDUSTRY_OPTIONS, COMPANY_STATUS } from '../../../../utils/admin-constants.js'

export default {
  name: 'AdminDashboard',
  
  template: `
    <div class="admin-dashboard">
      <!-- Admin Header -->
      <header class="admin-header">
        <div class="admin-header-content">
          <div class="admin-brand">
            <i class="fas fa-shield-alt"></i>
            <h1>TLB ERP Admin Panel</h1>
          </div>
          <div class="admin-user-menu">
            <div class="admin-user-info">
              <div class="admin-user-name">{{ adminUser.fullName }}</div>
              <div class="admin-user-role">{{ adminUser.role }}</div>
            </div>
            <button @click="handleLogout" class="btn btn-admin-outline">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="admin-main-content">
        <!-- Sidebar -->
        <nav class="admin-sidebar">
          <div class="admin-nav">
            <button 
              v-for="tab in adminTabs" 
              :key="tab.id"
              :class="['admin-nav-item', { active: currentTab === tab.id }]"
              @click="currentTab = tab.id"
            >
              <i :class="['fas', tab.icon]"></i>
              <span>{{ tab.name }}</span>
            </button>
          </div>
          
          <div class="admin-stats-sidebar">
            <div class="admin-stat">
              <div class="stat-value">{{ companies.length }}</div>
              <div class="stat-label">Total Companies</div>
            </div>
            <div class="admin-stat">
              <div class="stat-value">{{ activeCompanies.length }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="admin-stat">
              <div class="stat-value">{{ enterpriseCompanies.length }}</div>
              <div class="stat-label">Enterprise</div>
            </div>
          </div>
        </nav>

        <!-- Content Area -->
        <main class="admin-content-area">
          <!-- Companies Management Tab -->
          <div v-if="currentTab === 'companies'" class="admin-tab-content">
            <div class="admin-tab-header">
              <h2><i class="fas fa-building"></i> Companies Management</h2>
              <button @click="showCreateCompany = true" class="btn btn-admin">
                <i class="fas fa-plus"></i> Create New Company
              </button>
            </div>

            <!-- Companies Table -->
            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Company Code</th>
                    <th>Name</th>
                    <th>Industry</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="company in companies" :key="company.id">
                    <td>
                      <strong>{{ company.code }}</strong>
                    </td>
                    <td>{{ company.name }}</td>
                    <td>
                      <span class="industry-badge">{{ company.industry }}</span>
                    </td>
                    <td>
                      <span class="plan-badge" :class="company.plan">{{ company.plan }}</span>
                    </td>
                    <td>
                      <span class="status-badge" :class="company.status">
                        {{ COMPANY_STATUS[company.status]?.label || company.status }}
                      </span>
                    </td>
                    <td>
                      {{ formatDate(company.created_at) }}
                    </td>
                    <td>
                      <div class="admin-actions">
                        <button 
                          @click="editCompany(company)"
                          class="btn-icon btn-edit"
                          title="Edit Company"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          @click="changePlan(company)"
                          class="btn-icon btn-plan"
                          title="Change Plan"
                        >
                          <i class="fas fa-crown"></i>
                        </button>
                        <button 
                          v-if="company.status === 'active'"
                          @click="suspendCompany(company.id)"
                          class="btn-icon btn-suspend"
                          title="Suspend Company"
                        >
                          <i class="fas fa-pause"></i>
                        </button>
                        <button 
                          v-if="company.status === 'suspended'"
                          @click="activateCompany(company.id)"
                          class="btn-icon btn-activate"
                          title="Activate Company"
                        >
                          <i class="fas fa-play"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="currentTab === 'analytics'" class="admin-tab-content">
            <div class="admin-tab-header">
              <h2><i class="fas fa-chart-bar"></i> System Analytics</h2>
            </div>
            
            <div class="analytics-grid">
              <div class="analytics-card">
                <h3>Plan Distribution</h3>
                <div class="plan-stats">
                  <div v-for="plan in planStats" :key="plan.name" class="plan-stat">
                    <span class="plan-name">{{ plan.name }}</span>
                    <span class="plan-count">{{ plan.count }} companies</span>
                    <div class="plan-bar">
                      <div 
                        class="plan-bar-fill" 
                        :class="plan.name.toLowerCase()"
                        :style="{ width: plan.percentage + '%' }"
                      ></div>
                    </div>
                    <span class="plan-percentage">{{ plan.percentage }}%</span>
                  </div>
                </div>
              </div>

              <div class="analytics-card">
                <h3>Recent Activity</h3>
                <div class="activity-list">
                  <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
                    <i :class="['fas', activity.icon]"></i>
                    <div class="activity-content">
                      <div class="activity-title">{{ activity.title }}</div>
                      <div class="activity-time">{{ activity.time }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Create Company Modal -->
      <div v-if="showCreateCompany" class="admin-modal">
        <div class="admin-modal-content">
          <div class="admin-modal-header">
            <h3>Create New Company</h3>
            <button @click="showCreateCompany = false" class="btn-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form @submit.prevent="createNewCompany" class="admin-modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Company Code *</label>
                <input 
                  v-model="newCompany.code" 
                  type="text" 
                  required 
                  placeholder="Unique company code"
                >
              </div>
              <div class="form-group">
                <label>Company Name *</label>
                <input 
                  v-model="newCompany.name" 
                  type="text" 
                  required 
                  placeholder="Company display name"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Industry</label>
              <select v-model="newCompany.industry">
                <option value="">Select Industry</option>
                <option v-for="industry in INDUSTRY_OPTIONS" :key="industry" :value="industry">
                  {{ industry }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Employee Count</label>
                <input 
                  v-model="newCompany.employee_count" 
                  type="number" 
                  placeholder="Approximate employee count"
                >
              </div>
              <div class="form-group">
                <label>Plan *</label>
                <select v-model="newCompany.plan" required>
                  <option value="starter">Starter (Free)</option>
                  <option value="premium">Premium ($49/month)</option>
                  <option value="enterprise">Enterprise ($149/month)</option>
                </select>
              </div>
            </div>

            <div class="admin-modal-actions">
              <button type="button" @click="showCreateCompany = false" class="btn btn-cancel">
                Cancel
              </button>
              <button type="submit" class="btn btn-admin" :disabled="creatingCompany">
                <i class="fas" :class="creatingCompany ? 'fa-spinner fa-spin' : 'fa-plus'"></i>
                {{ creatingCompany ? 'Creating...' : 'Create Company' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      currentTab: 'companies',
      adminUser: {},
      companies: [],
      showCreateCompany: false,
      creatingCompany: false,
      newCompany: {
        code: '',
        name: '',
        industry: '',
        employee_count: null,
        plan: 'starter'
      },
      adminTabs: [
        { id: 'companies', name: 'Companies', icon: 'fa-building' },
        { id: 'analytics', name: 'Analytics', icon: 'fa-chart-bar' },
        { id: 'billing', name: 'Billing', icon: 'fa-credit-card' },
        { id: 'settings', name: 'Settings', icon: 'fa-cogs' }
      ]
    }
  },

  computed: {
    activeCompanies() {
      return this.companies.filter(c => c.status === 'active')
    },
    
    enterpriseCompanies() {
      return this.companies.filter(c => c.plan === 'enterprise')
    },
    
    planStats() {
      const plans = ['starter', 'premium', 'enterprise']
      return plans.map(plan => {
        const count = this.companies.filter(c => c.plan === plan).length
        const percentage = this.companies.length > 0 ? 
          Math.round((count / this.companies.length) * 100) : 0
        return {
          name: plan.charAt(0).toUpperCase() + plan.slice(1),
          count,
          percentage
        }
      })
    },
    
    recentActivity() {
      return [
        {
          id: 1,
          icon: 'fa-building',
          title: 'New company "TechCorp" created',
          time: '2 hours ago'
        },
        {
          id: 2,
          icon: 'fa-crown',
          title: 'Plan upgraded for "Global Solutions"',
          time: '5 hours ago'
        },
        {
          id: 3,
          icon: 'fa-user-plus',
          title: 'New user registered in "Startup Inc"',
          time: '1 day ago'
        }
      ]
    }
  },

  methods: {
    async loadCompanies() {
      try {
        this.companies = await apiService.getAllCompanies()
      } catch (error) {
        console.error('Failed to load companies:', error)
      }
    },

    async createNewCompany() {
      this.creatingCompany = true
      try {
        const company = await apiService.createCompany(this.newCompany)
        this.companies.push(company)
        this.showCreateCompany = false
        this.resetNewCompanyForm()
        
        // Show success message
        alert('Company created successfully!')
      } catch (error) {
        alert('Failed to create company: ' + error.message)
      } finally {
        this.creatingCompany = false
      }
    },

    resetNewCompanyForm() {
      this.newCompany = {
        code: '',
        name: '',
        industry: '',
        employee_count: null,
        plan: 'starter'
      }
    },

    editCompany(company) {
      alert('Edit company: ' + company.name)
      // Implement edit functionality
    },

    changePlan(company) {
      const newPlan = prompt(`Change plan for ${company.name} (current: ${company.plan}):`, company.plan)
      if (newPlan && ['starter', 'premium', 'enterprise'].includes(newPlan)) {
        this.updateCompanyPlan(company.id, newPlan)
      }
    },

    async updateCompanyPlan(companyId, newPlan) {
      try {
        await apiService.updateCompany(companyId, { plan: newPlan })
        const company = this.companies.find(c => c.id === companyId)
        if (company) {
          company.plan = newPlan
        }
        alert('Plan updated successfully!')
      } catch (error) {
        alert('Failed to update plan: ' + error.message)
      }
    },

    suspendCompany(companyId) {
      if (confirm('Are you sure you want to suspend this company?')) {
        this.updateCompanyStatus(companyId, 'suspended')
      }
    },

    activateCompany(companyId) {
      this.updateCompanyStatus(companyId, 'active')
    },

    async updateCompanyStatus(companyId, status) {
      try {
        await apiService.updateCompany(companyId, { status })
        const company = this.companies.find(c => c.id === companyId)
        if (company) {
          company.status = status
        }
      } catch (error) {
        alert('Failed to update company status: ' + error.message)
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },

    handleLogout() {
      sessionStorage.removeItem('tlb_admin_user')
      this.$router.push('/admin/login')
    }
  },

  async mounted() {
    // Check admin authentication
    const adminUser = sessionStorage.getItem('tlb_admin_user')
    if (!adminUser) {
      this.$router.push('/admin/login')
      return
    }

    this.adminUser = JSON.parse(adminUser)
    await this.loadCompanies()
  }
}
