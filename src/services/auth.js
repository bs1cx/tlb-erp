import { useUserStore } from '../stores/user.js'

export class AuthService {
  constructor() {
    this.userStore = useUserStore()
    this.apiBase = import.meta.env.VITE_API_URL || '/api'
  }

  async login(credentials) {
    try {
      // Simulate API call
      const user = await this.authenticate(credentials)
      
      if (user) {
        this.userStore.setUser(user)
        localStorage.setItem('tlb_token', 'simulated-jwt-token')
        localStorage.setItem('tlb_user', JSON.stringify(user))
        return { success: true, user }
      }
      
      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  async authenticate(credentials) {
    // Simulate database lookup
    const users = {
      admin: { 
        id: 1, 
        username: 'admin', 
        password: 'admin123', 
        role: 'admin', 
        fullName: 'System Administrator',
        email: 'admin@tlb-erp.com',
        company: 'TLB Solutions Inc.',
        avatar: '/src/assets/images/avatars/admin.png'
      },
      accountant: {
        id: 2,
        username: 'accountant', 
        password: 'accountant123',
        role: 'accountant',
        fullName: 'Financial Manager',
        email: 'accounting@tlb-erp.com',
        company: 'TLB Solutions Inc.'
      }
    }

    const user = users[credentials.username]
    if (user && user.password === credentials.password) {
      return user
    }
    return null
  }

  logout() {
    this.userStore.logout()
    localStorage.removeItem('tlb_token')
    localStorage.removeItem('tlb_user')
  }

  checkAuth() {
    const token = localStorage.getItem('tlb_token')
    const userData = localStorage.getItem('tlb_user')
    
    if (token && userData) {
      const user = JSON.parse(userData)
      this.userStore.setUser(user)
      return true
    }
    return false
  }
}
