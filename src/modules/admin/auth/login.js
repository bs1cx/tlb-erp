export default {
  name: 'AdminLoginPage',
  
  template: `
    <div class="admin-login-container">
      <div class="admin-login-card">
        <div class="admin-login-header">
          <div class="admin-logo">
            <i class="fas fa-shield-alt"></i>
            <h1>TLB ERP Admin</h1>
          </div>
          <p class="admin-subtitle">System Management Panel</p>
        </div>

        <form @submit.prevent="handleAdminLogin" class="admin-login-form">
          <div class="form-group">
            <label for="adminUsername">
              <i class="fas fa-user-cog"></i> Admin Username
            </label>
            <input 
              type="text" 
              id="adminUsername"
              v-model="credentials.username" 
              placeholder="Enter admin username"
              required
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="adminPassword">
              <i class="fas fa-key"></i> Admin Password
            </label>
            <input 
              type="password" 
              id="adminPassword"
              v-model="credentials.password" 
              placeholder="Enter admin password"
              required
              class="form-control"
            >
          </div>

          <button 
            type="submit" 
            class="btn btn-admin btn-login" 
            :disabled="loading"
          >
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-unlock'"></i>
            {{ loading ? 'Authenticating...' : 'Access Admin Panel' }}
          </button>

          <div v-if="error" class="alert alert-error admin-error">
            <i class="fas fa-exclamation-triangle"></i> {{ error }}
          </div>
        </form>

        <div class="admin-login-info">
          <div class="security-notice">
            <i class="fas fa-info-circle"></i>
            <p>This panel is restricted to authorized personnel only.</p>
          </div>
          
          <div class="quick-actions">
            <h4><i class="fas fa-bolt"></i> Quick Access</h4>
            <button @click="fillDemoCredentials" class="btn-link">
              Use Demo Admin Credentials
            </button>
          </div>
        </div>

        <div class="admin-login-footer">
          <p><i class="fas fa-lock"></i> Secure Admin Access</p>
          <p>&copy; 2024 TLB Solutions  System Management</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },

  methods: {
    async handleAdminLogin() {
      this.loading = true
      this.error = ''

      try {
        // Admin credentials check
        const adminConfig = {
          username: 'thelebois',
          password: 'thelebois2024',
          fullName: 'System Super Admin',
          role: 'super_admin'
        }

        if (this.credentials.username === adminConfig.username && 
            this.credentials.password === adminConfig.password) {
          
          // Set admin session
          const adminSession = {
            ...adminConfig,
            isAdmin: true,
            loginTime: new Date().toISOString()
          }
          
          sessionStorage.setItem('tlb_admin_user', JSON.stringify(adminSession))
          this.$router.push('/admin')
        } else {
          this.error = 'Invalid admin credentials'
        }
      } catch (error) {
        this.error = 'Authentication failed. Please try again.'
        console.error('Admin login error:', error)
      } finally {
        this.loading = false
      }
    },

    fillDemoCredentials() {
      this.credentials.username = 'thelebois'
      this.credentials.password = 'thelebois2024'
    }
  },

  mounted() {
    // Redirect if already authenticated as admin
    const adminUser = sessionStorage.getItem('tlb_admin_user')
    if (adminUser) {
      this.$router.push('/admin')
    }
  }
}
