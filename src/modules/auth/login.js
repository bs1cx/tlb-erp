export default {
  name: 'LoginPage',
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1><i class="fas fa-chart-line"></i> TLB ERP</h1>
          <p class="subtitle">Enterprise Resource Planning for Canadian SMEs</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
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

          <button type="submit" class="btn btn-primary btn-login" :disabled="loading">
            <span v-if="loading">Signing In...</span>
            <span v-else><i class="fas fa-sign-in-alt"></i> Sign In</span>
          </button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <div class="demo-accounts">
          <h3>Demo Accounts</h3>
          <div class="account-list">
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>Accountant:</strong> accountant / accountant123</div>
            <div><strong>Sales:</strong> sales / sales123</div>
          </div>
        </div>

        <div class="login-footer">
          <p>&copy; 2023 TLB Solutions Inc.  All rights reserved</p>
          <p>GST/HST Compliant  PCI DSS Certified</p>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      loading: false,
      error: ''
    }
  },

  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''

      try {
        // Simple auth for now - we'll implement proper service later
        const users = {
          admin: { username: 'admin', password: 'admin123', role: 'admin', fullName: 'System Administrator' },
          accountant: { username: 'accountant', password: 'accountant123', role: 'accountant', fullName: 'Accountant User' },
          sales: { username: 'sales', password: 'sales123', role: 'sales', fullName: 'Sales Representative' }
        }

        const user = users[this.credentials.username]
        
        if (user && user.password === this.credentials.password) {
          localStorage.setItem('tlb_user', JSON.stringify(user))
          this.$router.push('/')
        } else {
          this.error = 'Invalid credentials'
        }
      } catch (error) {
        this.error = 'Login failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    // Check if already logged in
    const user = localStorage.getItem('tlb_user')
    if (user) {
      this.$router.push('/')
    }
  }
}
