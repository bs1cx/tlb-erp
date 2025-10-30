import { useUserStore } from '../../../stores/user.js'

export default {
  name: 'CompanyLoginPage',
  
  template: `
    <div class="company-login-container">
      <div class="company-login-card">
        <div class="login-header">
          <h1><i class="fas fa-building"></i> TLB ERP</h1>
          <p class="company-subtitle">Multi-Company Enterprise System</p>
        </div>

        <form @submit.prevent="handleCompanyLogin" class="company-login-form">
          <div class="form-group">
            <label for="companyCode">
              <i class="fas fa-hashtag"></i> Company Code
            </label>
            <input 
              type="text" 
              id="companyCode"
              v-model="credentials.companyCode" 
              placeholder="Enter your company code"
              required
              class="form-control"
            >
            <small class="form-text">Demo: ABC123 (Enterprise) or DEF456 (Premium)</small>
          </div>

          <div class="form-group">
            <label for="username">
              <i class="fas fa-user"></i> Username
            </label>
            <input 
              type="text" 
              id="username"
              v-model="credentials.username" 
              placeholder="Enter your username"
              required
              class="form-control"
            >
            <small class="form-text">Demo: admin or user</small>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i> Password
            </label>
            <input 
              type="password" 
              id="password"
              v-model="credentials.password" 
              placeholder="Enter your password"
              required
              class="form-control"
            >
            <small class="form-text">Demo: admin123 or user123</small>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-login" 
            :disabled="loading"
          >
            <i class="fas" :class="loading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'"></i>
            {{ loading ? 'Signing In...' : 'Sign In to Company' }}
          </button>

          <div v-if="error" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>
        </form>

        <div class="company-demo-info">
          <h3><i class="fas fa-rocket"></i> Demo Access</h3>
          
          <div class="demo-company-card enterprise">
            <div class="demo-header">
              <h4>ABC123 - Enterprise Plan</h4>
              <span class="plan-badge enterprise">ENTERPRISE</span>
            </div>
            <div class="demo-accounts">
              <p><strong>Full access to all modules</strong></p>
              <p> Admin: admin / admin123</p>
              <p> User: user / user123</p>
            </div>
          </div>

          <div class="demo-company-card premium">
            <div class="demo-header">
              <h4>DEF456 - Premium Plan</h4>
              <span class="plan-badge premium">PREMIUM</span>
            </div>
            <div class="demo-accounts">
              <p><strong>Limited module access</strong></p>
              <p> Admin: admin / admin123</p>
              <p> User: user / user123</p>
            </div>
          </div>
        </div>

        <div class="login-footer">
          <p><i class="fas fa-shield-alt"></i> Secure Multi-Tenant System</p>
          <p>&copy; 2024 TLB Solutions Inc.  GST/HST Compliant</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      credentials: {
        companyCode: 'ABC123',
        username: 'admin',
        password: 'admin123'
      },
      loading: false,
      error: ''
    }
  },

  methods: {
    async handleCompanyLogin() {
      this.loading = true
      this.error = ''

      try {
        const { authService } = await import('../../../services/authService.js')
        
        // Initialize demo data for the company
        authService.initializeDemoData(this.credentials.companyCode)
        
        const result = await authService.login(
          this.credentials.companyCode,
          this.credentials.username,
          this.credentials.password
        )

        if (result.success) {
          const userStore = useUserStore()
          userStore.setUser(result.user, result.company)
          this.$router.push('/')
        } else {
          this.error = result.error
        }
      } catch (error) {
        this.error = 'Login failed. Please check your credentials and try again.'
        console.error('Company login error:', error)
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    const userStore = useUserStore()
    
    // Redirect if already authenticated
    if (userStore.isAuthenticated) {
      this.$router.push('/')
    }

    // Set demo company from URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const demoCompany = urlParams.get('demo')
    if (demoCompany === 'premium') {
      this.credentials.companyCode = 'DEF456'
    } else if (demoCompany === 'enterprise') {
      this.credentials.companyCode = 'ABC123'
    }
  }
}
