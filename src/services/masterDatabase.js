import { createClient } from '@supabase/supabase-js'
import { API_CONFIG } from '../utils/constants.js'

// Create Supabase client
const supabaseUrl = API_CONFIG.supabase.url || import.meta.env.VITE_SUPABASE_URL
const supabaseKey = API_CONFIG.supabase.key || import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export class MasterDatabase {
  constructor() {
    this.supabase = supabase
    this.isConnected = false
    this.checkConnection()
  }

  // Check database connection
  async checkConnection() {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('count')
        .limit(1)

      this.isConnected = !error
      console.log(this.isConnected ? ' Master database connected' : ' Master database offline')
      return this.isConnected
    } catch (error) {
      console.error(' Master database connection failed:', error)
      this.isConnected = false
      return false
    }
  }

  // Create new company in master database
  async createCompany(companyData) {
    if (!this.isConnected) {
      throw new Error('Master database is not connected')
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

      if (error) {
        console.error(' Company creation error:', error)
        throw new Error(`Company creation failed: ${error.message}`)
      }

      console.log(' Company created in master database:', data.code)
      return data
    } catch (error) {
      console.error(' Master database error:', error)
      throw error
    }
  }

  // Get company by code from master database
  async getCompanyByCode(companyCode) {
    if (!this.isConnected) {
      return this.getCompanyFromLocalStorage(companyCode)
    }

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('code', companyCode)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error(' Company fetch error:', error)
        return this.getCompanyFromLocalStorage(companyCode)
      }

      return data
    } catch (error) {
      console.error(' Master database error:', error)
      return this.getCompanyFromLocalStorage(companyCode)
    }
  }

  // Get all active companies from master database
  async getAllCompanies() {
    if (!this.isConnected) {
      return this.getAllCompaniesFromLocalStorage()
    }

    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('status', 'active')
        .order('name')

      if (error) {
        console.error(' Companies fetch error:', error)
        return this.getAllCompaniesFromLocalStorage()
      }

      return data
    } catch (error) {
      console.error(' Master database error:', error)
      return this.getAllCompaniesFromLocalStorage()
    }
  }

  // Update company in master database
  async updateCompany(companyId, updates) {
    if (!this.isConnected) {
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

      if (error) {
        console.error(' Company update error:', error)
        throw new Error(`Company update failed: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error(' Master database error:', error)
      return this.updateCompanyInLocalStorage(companyId, updates)
    }
  }

  // ==================== LOCALSTORAGE FALLBACK METHODS ====================

  getCompanyFromLocalStorage(companyCode) {
    const companies = JSON.parse(localStorage.getItem('tlb_erp_companies') || '[]')
    return companies.find(c => c.code === companyCode && c.status === 'active')
  }

  getAllCompaniesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tlb_erp_companies') || '[]')
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
      localStorage.setItem('tlb_erp_companies', JSON.stringify(companies))
      return companies[companyIndex]
    }
    return null
  }

  // ==================== UTILITY METHODS ====================

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Initialize demo data in master database
  async initializeDemoData() {
    if (!this.isConnected) {
      console.log(' Master database offline, using localStorage for demo data')
      return this.initializeDemoDataInLocalStorage()
    }

    try {
      const demoCompanies = [
        {
          code: 'ABC123',
          name: 'Demo Corporation',
          industry: 'Technology',
          employee_count: 50,
          plan: 'enterprise'
        },
        {
          code: 'DEF456',
          name: 'Test Enterprises', 
          industry: 'Manufacturing',
          employee_count: 25,
          plan: 'premium'
        }
      ]

      for (const companyData of demoCompanies) {
        const existing = await this.getCompanyByCode(companyData.code)
        if (!existing) {
          await this.createCompany(companyData)
        }
      }

      console.log(' Demo data initialized in master database')
    } catch (error) {
      console.error(' Demo data initialization failed:', error)
      this.initializeDemoDataInLocalStorage()
    }
  }

  initializeDemoDataInLocalStorage() {
    const demoCompanies = [
      {
        id: 'demo_abc123',
        code: 'ABC123',
        name: 'Demo Corporation',
        industry: 'Technology',
        employee_count: 50,
        plan: 'enterprise',
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo_def456',
        code: 'DEF456',
        name: 'Test Enterprises',
        industry: 'Manufacturing', 
        employee_count: 25,
        plan: 'premium',
        status: 'active',
        created_at: new Date().toISOString()
      }
    ]

    localStorage.setItem('tlb_erp_companies', JSON.stringify(demoCompanies))
    console.log(' Demo data initialized in localStorage')
  }
}

// Create and export singleton instance
export const masterDatabase = new MasterDatabase()

export default masterDatabase
