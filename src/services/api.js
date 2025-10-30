import { createClient } from '@supabase/supabase-js'
import { API_CONFIG, STORAGE_KEYS } from '../utils/constants.js'

// Supabase client instance
let supabase = null

// Initialize Supabase client
export const initializeSupabase = () => {
  if (API_CONFIG.supabase.url && API_CONFIG.supabase.key) {
    supabase = createClient(API_CONFIG.supabase.url, API_CONFIG.supabase.key)
    console.log(' Supabase API initialized')
    return true
  } else {
    console.warn(' Supabase environment variables not found, using localStorage fallback')
    return false
  }
}

// Get Supabase client
export const getSupabase = () => {
  if (!supabase) {
    initializeSupabase()
  }
  return supabase
}

// API Service Class
export class ApiService {
  constructor() {
    this.supabase = getSupabase()
    this.isOnline = !!this.supabase
  }

  // ==================== COMPANY API METHODS ====================

  // Get company by code
  async getCompanyByCode(companyCode) {
    if (!this.isOnline) {
      return this.getCompanyFromLocalStorage(companyCode)
    }

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('code', companyCode)
        .eq('status', 'active')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(' Company API error:', error)
      return this.getCompanyFromLocalStorage(companyCode)
    }
  }

  // Get all active companies
  async getAllCompanies() {
    if (!this.isOnline) {
      return this.getAllCompaniesFromLocalStorage()
    }

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error(' Companies API error:', error)
      return this.getAllCompaniesFromLocalStorage()
    }
  }

  // Create new company
  async createCompany(companyData) {
    if (!this.isOnline) {
      return this.createCompanyInLocalStorage(companyData)
    }

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .insert([
          {
            code: companyData.code,
            name: companyData.name,
            industry: companyData.industry,
            employee_count: companyData.employee_count,
            plan: companyData.plan || 'starter',
            status: 'active'
          }
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(' Create company API error:', error)
      return this.createCompanyInLocalStorage(companyData)
    }
  }

  // Update company
  async updateCompany(companyId, updates) {
    if (!this.isOnline) {
      return this.updateCompanyInLocalStorage(companyId, updates)
    }

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(' Update company API error:', error)
      return this.updateCompanyInLocalStorage(companyId, updates)
    }
  }

  // ==================== USER API METHODS ====================

  // Get user by credentials
  async getUserByCredentials(companyCode, username, password) {
    if (!this.isOnline) {
      return this.getUserFromLocalStorage(companyCode, username, password)
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('company_id', companyCode)
        .eq('status', 'active')
        .single()

      if (error) throw error

      // Verify password (in real app, use proper hashing)
      if (data && this.verifyPassword(password, data.password_hash)) {
        return this.formatUserForApp(data)
      }
      return null
    } catch (error) {
      console.error(' User API error:', error)
      return this.getUserFromLocalStorage(companyCode, username, password)
    }
  }

  // Get users by company
  async getUsersByCompany(companyCode) {
    if (!this.isOnline) {
      return this.getUsersFromLocalStorage(companyCode)
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('company_id', companyCode)
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      return data.map(user => this.formatUserForApp(user))
    } catch (error) {
      console.error(' Users API error:', error)
      return this.getUsersFromLocalStorage(companyCode)
    }
  }

  // Create user
  async createUser(userData) {
    if (!this.isOnline) {
      return this.createUserInLocalStorage(userData)
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([
          {
            company_id: userData.companyId,
            username: userData.username,
            password_hash: this.hashPassword(userData.password),
            name: userData.name,
            role: userData.role,
            status: 'active'
          }
        ])
        .select()
        .single()

      if (error) throw error
      return this.formatUserForApp(data)
    } catch (error) {
      console.error(' Create user API error:', error)
      return this.createUserInLocalStorage(userData)
    }
  }

  // ==================== LOCALSTORAGE FALLBACK METHODS ====================

  // Company fallback methods
  getCompanyFromLocalStorage(companyCode) {
    const companies = JSON.parse(localStorage.getItem(STORAGE_KEYS.companies) || '[]')
    return companies.find(c => c.code === companyCode && c.status === 'active')
  }

  getAllCompaniesFromLocalStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.companies) || '[]')
  }

  createCompanyInLocalStorage(companyData) {
    const companies = this.getAllCompaniesFromLocalStorage()
    const newCompany = {
      id: this.generateId(),
      ...companyData,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    companies.push(newCompany)
    localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies))
    return newCompany
  }

  updateCompanyInLocalStorage(companyId, updates) {
    const companies = this.getAllCompaniesFromLocalStorage()
    const companyIndex = companies.findIndex(c => c.id === companyId)
    if (companyIndex !== -1) {
      companies[companyIndex] = {
        ...companies[companyIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies))
      return companies[companyIndex]
    }
    return null
  }

  // User fallback methods
  getUserFromLocalStorage(companyCode, username, password) {
    const users = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.userPrefix}${companyCode}_users`) || '[]')
    const passwordHash = this.hashPassword(password)
    return users.find(u => 
      u.username === username && 
      u.companyId === companyCode &&
      u.password === passwordHash &&
      u.isActive === true
    )
  }

  getUsersFromLocalStorage(companyCode) {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEYS.userPrefix}${companyCode}_users`) || '[]')
  }

  createUserInLocalStorage(userData) {
    const users = this.getUsersFromLocalStorage(userData.companyId)
    const newUser = {
      id: this.generateId(),
      ...userData,
      password: this.hashPassword(userData.password),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    }
    users.push(newUser)
    localStorage.setItem(
      `${STORAGE_KEYS.userPrefix}${userData.companyId}_users`, 
      JSON.stringify(users)
    )
    return newUser
  }

  // ==================== UTILITY METHODS ====================

  // Format Supabase user for app
  formatUserForApp(supabaseUser) {
    return {
      id: supabaseUser.id,
      username: supabaseUser.username,
      email: supabaseUser.email,
      password: supabaseUser.password_hash,
      fullName: supabaseUser.name,
      role: supabaseUser.role,
      companyId: supabaseUser.company_id,
      isActive: supabaseUser.status === 'active',
      createdAt: supabaseUser.created_at,
      lastLogin: supabaseUser.last_login
    }
  }

  // Simple password hashing (for demo - use proper hashing in production)
  hashPassword(password) {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString()
  }

  // Password verification
  verifyPassword(inputPassword, storedHash) {
    return this.hashPassword(inputPassword) === storedHash
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Check API connectivity
  async checkConnection() {
    if (!this.isOnline) return false

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('count')
        .limit(1)

      return !error
    } catch (error) {
      return false
    }
  }

  // Sync local data with server
  async syncLocalData() {
    if (!this.isOnline) return false

    try {
      // Sync companies
      const localCompanies = this.getAllCompaniesFromLocalStorage()
      for (const company of localCompanies) {
        await this.createCompany(company)
      }

      // Sync users for each company
      for (const company of localCompanies) {
        const users = this.getUsersFromLocalStorage(company.code)
        for (const user of users) {
          await this.createUser(user)
        }
      }

      console.log(' Local data synced with server')
      return true
    } catch (error) {
      console.error(' Sync error:', error)
      return false
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService()

// Initialize API on import
initializeSupabase()

// Export default for convenience
export default apiService
