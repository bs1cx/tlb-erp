import { defineStore } from 'pinia'
import { APP_MODULES, canAccessModule } from '../utils/constants.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    currentCompany: null,
    isAuthenticated: false,
    availableModules: [],
    userPermissions: []
  }),

  getters: {
    // Kullanc bilgileri
    getUser: (state) => state.currentUser,
    getCompany: (state) => state.currentCompany,
    
    // Yetki kontrolleri
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isManager: (state) => state.currentUser?.role === 'manager',
    
    // Mod�l eriim kontrolleri (sadece role-based)
    canAccessFinance: (state) => state.currentUser?.role === 'admin' || state.currentUser?.role === 'manager',
    canAccessHR: (state) => state.currentUser?.role === 'admin' || state.currentUser?.role === 'manager',
    canAccessReports: (state) => state.currentUser?.role === 'admin' || state.currentUser?.role === 'manager',
    canAccessSettings: (state) => state.currentUser?.role === 'admin'
  },

  actions: {
    // Kullanc ve irket bilgisini ayarla
    setUser(user, company) {
      this.currentUser = user
      this.currentCompany = company
      this.isAuthenticated = true
      this.updateAvailableModules()
      this.updateUserPermissions()
      
      // Session storage'a kaydet
      if (user && company) {
        sessionStorage.setItem('current_user', JSON.stringify(user))
        sessionStorage.setItem('current_company', JSON.stringify(company))
      }
    },

    // Session'dan kullancy y�kle
    loadFromSession() {
      try {
        const userData = sessionStorage.getItem('current_user')
        const companyData = sessionStorage.getItem('current_company')
        
        if (userData && companyData) {
          this.currentUser = JSON.parse(userData)
          this.currentCompany = JSON.parse(companyData)
          this.isAuthenticated = true
          this.updateAvailableModules()
          this.updateUserPermissions()
        }
      } catch (error) {
        console.error('Session y�kleme hatas:', error)
        this.logout()
      }
    },

    // Kullanc �k
    logout() {
      this.currentUser = null
      this.currentCompany = null
      this.isAuthenticated = false
      this.availableModules = []
      this.userPermissions = []
      
      // Session storage' temizle
      sessionStorage.removeItem('current_user')
      sessionStorage.removeItem('current_company')
    },

    // Kullanc bilgisini g�ncelle
    updateUser(updates) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates }
        sessionStorage.setItem('current_user', JSON.stringify(this.currentUser))
      }
    },

    // irket bilgisini g�ncelle
    updateCompany(updates) {
      if (this.currentCompany) {
        this.currentCompany = { ...this.currentCompany, ...updates }
        sessionStorage.setItem('current_company', JSON.stringify(this.currentCompany))
        this.updateAvailableModules()
      }
    },

    // Eriilebilir mod�lleri g�ncelle
    updateAvailableModules() {
      if (!this.currentUser || !this.currentCompany) {
        this.availableModules = []
        return
      }

      this.availableModules = Object.values(APP_MODULES).filter(module => 
        canAccessModule(this.currentUser, this.currentCompany, module.id)
      )
    },

    // Kullanc izinlerini g�ncelle
    updateUserPermissions() {
      if (!this.currentUser) {
        this.userPermissions = []
        return
      }

      // Basit izin sistemi - sadece role-based
      const basePermissions = ['dashboard'] // T�m kullanclar dashboard'a eriebilir
      
      if (this.currentUser.role === 'admin') {
        this.userPermissions = [...basePermissions, 'all']
      } else if (this.currentUser.role === 'manager') {
        this.userPermissions = [...basePermissions, 'crm', 'sales', 'reports']
      } else {
        this.userPermissions = [...basePermissions, 'crm']
      }
    },

    // Mod�l eriim kontrol�
    canAccess(module) {
      return canAccessModule(this.currentUser, this.currentCompany, module)
    },

    // Plan y�kseltme kontrol� KALDIRILDI
    // canUpgradePlan() {
    //   return this.currentCompany && this.currentCompany.plan !== 'enterprise'
    // },

    // Demo mod kontrol�
    isDemoMode() {
      return this.currentCompany?.code === 'ABC123' || this.currentCompany?.code === 'DEF456'
    }
  }
})
