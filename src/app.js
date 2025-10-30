import { useUserStore } from './stores/user.js'
import { APP_MODULES, canAccessModule } from './utils/constants.js'

export default {
  name: 'TLBErpApp',
  
  template: `
    <div>
      <!-- Company Login Screen -->
      <div v-if="!isAuthenticated" class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>TLB<span> ERP</span></h1>
            <p class="login-subtitle">Multi-Company Enterprise Resource Planning</p>
          </div>

          <form @submit.prevent="handleCompanyLogin">
            <div class="form-group">
              <label>Company Code</label>
              <input 
                type="text" 
                v-model="credentials.companyCode" 
                placeholder="Enter your company code"
                required
              >
              <small class="form-hint">Demo codes: ABC123, DEF456</small>
            </div>

            <div class="form-group">
              <label>Username</label>
              <input 
                type="text" 
                v-model="credentials.username" 
                placeholder="Enter your username"
                required
              >
            </div>

            <div class="form-group">
              <label>Password</label>
              <input 
                type="password" 
                v-model="credentials.password" 
                placeholder="Enter your password"
                required
              >
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              <i class="fas fa-sign-in-alt"></i> 
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </form>

          <div class="demo-accounts">
            <p><strong>Demo Accounts:</strong></p>
            <div class="demo-company">
              <strong>Company: ABC123</strong>
              <p>Admin: admin / admin123</p>
              <p>User: user / user123</p>
            </div>
            <div class="demo-company">
              <strong>Company: DEF456</strong>
              <p>Admin: admin / admin123</p>
              <p>User: user / user123</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Application -->
      <div v-else class="app-container">
        <!-- Header -->
        <header class="header">
          <div class="header-brand">
            <div class="header-logo">TLB<span> ERP</span></div>
            <div class="company-info">
              <div class="company-name">{{ currentCompany.name }}</div>
              <div class="company-code">{{ currentCompany.code }}</div>
            </div>
          </div>
          
          <div class="user-menu">
            <div class="user-info">
              <div class="user-name">{{ currentUser.fullName }}</div>
              <div class="user-details">
                <span class="user-role">{{ currentUser.role }}</span>
                <span class="user-company">{{ currentCompany.code }}</span>
              </div>
            </div>
            <button class="btn btn-secondary" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Sidebar -->
          <nav class="sidebar">
            <div class="sidebar-header">
              <h3>Business Modules</h3>
            </div>
            
            <ul class="module-list">
              <li 
                v-for="module in availableModules" 
                :key="module.id"
                :class="{ 
                  active: currentModule === module.id
                }"
                @click="switchModule(module.id)"
              >
                <i :class="['fas', module.icon]"></i>
                <span>{{ module.name }}</span>
              </li>
            </ul>

            <div class="sidebar-footer">
              <div class="module-count">
                {{ availableModules.length }} modules available
              </div>
            </div>
          </nav>

          <!-- Content Area -->
          <main class="content-area">
            <div v-if="currentModule === 'dashboard'" class="module-content">
              <div class="module-header">
                <h2><i class="fas fa-tachometer-alt"></i> Dashboard</h2>
                <p>Welcome back, {{ currentUser.fullName }}! You're logged into {{ currentCompany.name }}</p>
              </div>
              
              <div class="company-overview">
                <div class="overview-card">
                  <h3>Company Overview</h3>
                  <div class="overview-details">
                    <div><strong>Industry:</strong> {{ currentCompany.industry }}</div>
                    <div><strong>Employees:</strong> {{ currentCompany.employee_count || 'N/A' }}</div>
                    <div><strong>Status:</strong> <span class="status-active">{{ currentCompany.status }}</span></div>
                  </div>
                </div>
              </div>

              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">156</div>
                  <div class="stat-label">Total Customers</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">$45,230</div>
                  <div class="stat-label">Monthly Revenue</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">89</div>
                  <div class="stat-label">Pending Orders</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">24</div>
                  <div class="stat-label">Employees</div>
                </div>
              </div>
            </div>

            <div v-else-if="currentModule === 'finance'" class="module-content">
              <div class="module-header">
                <h2><i class="fas fa-file-invoice-dollar"></i> Finance & Invoicing</h2>
                <p>Manage your finances and create invoices.</p>
              </div>
              <div class="module-placeholder">
                <i class="fas fa-coins fa-3x"></i>
                <p>Finance module content</p>
              </div>
            </div>

            <div v-else-if="currentModule === 'crm'" class="module-content">
              <div class="module-header">
                <h2><i class="fas fa-users"></i> Customer Management</h2>
                <p>Manage your customer relationships.</p>
              </div>
              <div class="module-placeholder">
                <i class="fas fa-users fa-3x"></i>
                <p>CRM module content</p>
              </div>
            </div>

            <div v-else-if="currentModule === 'hr'" class="module-content">
              <div class="module-header">
                <h2><i class="fas fa-user-tie"></i> Human Resources</h2>
                <p>Manage employees and payroll.</p>
              </div>
              <div class="module-placeholder">
                <i class="fas fa-user-tie fa-3x"></i>
                <p>HR module content</p>
              </div>
            </div>

            <div v-else class="module-content">
              <div class="module-header">
                <h2><i :class="['fas', getModuleIcon(currentModule)]"></i> {{ getModuleName(currentModule) }}</h2>
                <p>{{ getModuleDescription(currentModule) }}</p>
              </div>
              <div class="module-placeholder">
                <i :class="['fas', getModuleIcon(currentModule), 'fa-3x']"></i>
                <p>{{ getModuleName(currentModule) }} module content</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      loading: false,
      currentModule: 'dashboard',
      credentials: {
        companyCode: 'ABC123',
        username: 'admin',
        password: 'admin123'
      },
      error: ''
    }
  },

  computed: {
    isAuthenticated() {
      return this.userStore.isAuthenticated
    },
    
    currentUser() {
      return this.userStore.currentUser
    },
    
    currentCompany() {
      return this.userStore.currentCompany
    },
    
    availableModules() {
      return this.userStore.availableModules
    },
    
    userStore() {
      return useUserStore()
    }
  },

  methods: {
    async handleCompanyLogin() {
      this.loading = true
      this.error = ''

      try {
        const { authService } = await import('./services/authService.js')
        
        // Initialize demo data for the company
        authService.initializeDemoData(this.credentials.companyCode)
        
        const result = await authService.login(
          this.credentials.companyCode,
          this.credentials.username,
          this.credentials.password
        )

        if (result.success) {
          this.userStore.setUser(result.user, result.company)
          this.error = ''
        } else {
          this.error = result.error
        }
      } catch (error) {
        this.error = 'Login failed. Please try again.'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },

    handleLogout() {
      this.userStore.logout()
      this.credentials = { companyCode: '', username: '', password: '' }
    },

    switchModule(moduleId) {
      if (this.canAccessModule(this.currentUser, this.currentCompany, moduleId)) {
        this.currentModule = moduleId
      } else {
        this.error = 'You do not have permission to access this module'
      }
    },

    getModuleName(moduleId) {
      return APP_MODULES[moduleId]?.name || moduleId
    },

    getModuleIcon(moduleId) {
      return APP_MODULES[moduleId]?.icon || 'cog'
    },

    getModuleDescription(moduleId) {
      return APP_MODULES[moduleId]?.description || 'Module description'
    },

    canAccessModule(user, company, module) {
      return canAccessModule(user, company, module)
    }
  },

  mounted() {
    // Load user from session
    this.userStore.loadFromSession()
    
    // Set demo credentials based on URL or default
    const urlParams = new URLSearchParams(window.location.search)
    const demoCompany = urlParams.get('demo')
    if (demoCompany === 'premium') {
      this.credentials.companyCode = 'DEF456'
    }
  }
}
