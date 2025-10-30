import { defineStore } from 'pinia'
import { authService } from '../services/authService.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    currentCompany: null,
    permissions: [],
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.currentUser,
    getCompany: (state) => state.currentCompany,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isManager: (state) => state.currentUser?.role === 'manager',
    canAccess: (state) => (module) => {
      if (!state.currentUser) return false
      
      const accessMatrix = {
        admin: ['dashboard', 'finance', 'crm', 'hr', 'inventory', 'reports', 'settings'],
        manager: ['dashboard', 'crm', 'hr', 'inventory', 'reports'],
        user: ['dashboard', 'crm', 'inventory'],
        guest: ['dashboard']
      }

      const allowedModules = accessMatrix[state.currentUser.role] || accessMatrix.guest
      return allowedModules.includes(module)
    }
  },

  actions: {
    // Session'dan kullancy yükle
    loadFromSession() {
      try {
        const companyStr = sessionStorage.getItem('current_company')
        const userStr = sessionStorage.getItem('current_user')
        
        if (companyStr && userStr) {
          this.currentCompany = JSON.parse(companyStr)
          this.currentUser = JSON.parse(userStr)
          this.isAuthenticated = true
          return true
        }
      } catch (error) {
        console.error('Session load error:', error)
        this.logout()
      }
      return false
    },

    // Giri yap
    async login(companyCode, username, password) {
      try {
        const result = await authService.login(companyCode, username, password)
        
        if (result.success) {
          this.currentCompany = result.company
          this.currentUser = result.user
          this.isAuthenticated = true
          return { success: true }
        } else {
          return { success: false, error: result.error }
        }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: error.message }
      }
    },

    // Çk yap
    logout() {
      authService.logout()
      this.currentUser = null
      this.currentCompany = null
      this.isAuthenticated = false
      this.permissions = []
    },

    // Kullanc bilgilerini güncelle
    updateUserProfile(updates) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates }
        sessionStorage.setItem('current_user', JSON.stringify(this.currentUser))
      }
    }
  }
})
