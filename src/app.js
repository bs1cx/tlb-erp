export default {
  name: 'TLBErpApp',
  
  template: `
    <div>
      <!-- Login Screen -->
      <div v-if="!isAuthenticated" class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>TLB<span> ERP</span></h1>
            <p class="login-subtitle">Enterprise Resource Planning for Canadian SMEs</p>
          </div>

          <form @submit.prevent="handleLogin">
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

            <button type="submit" class="btn">
              <i class="fas fa-sign-in-alt"></i> Sign In
            </button>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </form>

          <div class="demo-accounts">
            <p><strong>Demo Accounts:</strong></p>
            <p>Admin: admin / admin123</p>
            <p>Accountant: accountant / accountant123</p>
            <p>Sales: sales / sales123</p>
          </div>
        </div>
      </div>

      <!-- Main Application -->
      <div v-else class="app-container">
        <!-- Header -->
        <header class="header">
          <div class="header-logo">TLB<span> ERP</span></div>
          <div class="user-menu">
            <div class="user-info">
              <div class="user-name">{{ currentUser.fullName }}</div>
              <div class="user-role">{{ currentUser.role }}</div>
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
            <h3 style="margin-bottom: 20px;">Modules</h3>
            <ul class="module-list">
              <li 
                v-for="module in availableModules" 
                :key="module.id"
                :class="{ active: currentModule === module.id }"
                @click="switchModule(module.id)"
              >
                <i :class="module.icon"></i>
                <span>{{ module.name }}</span>
              </li>
            </ul>
          </nav>

          <!-- Content Area -->
          <main class="content-area">
            <div v-if="currentModule === 'dashboard'">
              <h2><i class="fas fa-tachometer-alt"></i> Dashboard</h2>
              <p>Welcome back, {{ currentUser.fullName }}!</p>
              
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

            <div v-else-if="currentModule === 'finance'">
              <h2><i class="fas fa-file-invoice-dollar"></i> Finance & Invoicing</h2>
              <p>Manage your finances and create invoices.</p>
            </div>

            <div v-else-if="currentModule === 'crm'">
              <h2><i class="fas fa-users"></i> Customer Management</h2>
              <p>Manage your customer relationships.</p>
            </div>

            <div v-else-if="currentModule === 'hr'">
              <h2><i class="fas fa-user-tie"></i> Human Resources</h2>
              <p>Manage employees and payroll.</p>
            </div>

            <div v-else>
              <h2>{{ getModuleName(currentModule) }}</h2>
              <p>Module content coming soon...</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      isAuthenticated: false,
      currentUser: null,
      currentModule: 'dashboard',
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      error: '',
      availableModules: [
        { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { id: 'finance', name: 'Finance', icon: 'fas fa-file-invoice-dollar' },
        { id: 'crm', name: 'CRM', icon: 'fas fa-users' },
        { id: 'hr', name: 'HR', icon: 'fas fa-user-tie' },
        { id: 'inventory', name: 'Inventory', icon: 'fas fa-boxes' },
        { id: 'reports', name: 'Reports', icon: 'fas fa-chart-bar' }
      ]
    }
  },

  methods: {
    handleLogin() {
      const users = {
        admin: { 
          username: 'admin', 
          password: 'admin123', 
          role: 'Administrator', 
          fullName: 'System Administrator' 
        },
        accountant: { 
          username: 'accountant', 
          password: 'accountant123', 
          role: 'Accountant', 
          fullName: 'Financial Manager' 
        },
        sales: { 
          username: 'sales', 
          password: 'sales123', 
          role: 'Sales Manager', 
          fullName: 'Sales Representative' 
        }
      }

      const user = users[this.credentials.username]
      
      if (user && user.password === this.credentials.password) {
        this.currentUser = user
        this.isAuthenticated = true
        this.error = ''
        
        // Save to localStorage
        localStorage.setItem('tlb_user', JSON.stringify(user))
      } else {
        this.error = 'Invalid username or password'
      }
    },

    handleLogout() {
      this.isAuthenticated = false
      this.currentUser = null
      this.credentials = { username: '', password: '' }
      localStorage.removeItem('tlb_user')
    },

    switchModule(moduleId) {
      this.currentModule = moduleId
    },

    getModuleName(moduleId) {
      const module = this.availableModules.find(m => m.id === moduleId)
      return module ? module.name : moduleId
    },

    checkExistingAuth() {
      const userData = localStorage.getItem('tlb_user')
      if (userData) {
        this.currentUser = JSON.parse(userData)
        this.isAuthenticated = true
      }
    }
  },

  mounted() {
    this.checkExistingAuth()
  }
}
