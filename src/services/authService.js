import { MasterDatabase } from './masterDatabase.js'
import { createClient } from '@supabase/supabase-js'

export class AuthService {
  constructor() {
    this.masterDb = new MasterDatabase()
    this.currentCompany = null
    this.currentUser = null
    this.supabase = null
    this.initializeSupabase()
  }

  // Supabase balantsn balat
  initializeSupabase() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey)
      console.log('Supabase balants balatld')
    } else {
      console.warn('Supabase environment variables not found, using localStorage fallback')
    }
  }

  // irket girii + kullanc girii
  async login(companyCode, username, password) {
    try {
      console.log('Giri denemesi:', { companyCode, username })

      // 1. Önce localStorage'dan irket kontrolü (fallback)
      let company = this.getCompanyFromLocalStorage(companyCode)
      
      // 2. Eer Supabase balants varsa, gerçek veritabanndan kontrol et
      if (this.supabase && !company) {
        company = await this.getCompanyFromSupabase(companyCode)
      }

      if (!company) {
        throw new Error('irket bulunamad - Geçersiz irket kodu')
      }

      console.log('irket bulundu:', company.name)

      // 3. Kullancy bul
      const user = await this.findUser(companyCode, username, password)
      if (!user) {
        throw new Error('Kullanc bulunamad veya ifre hatal')
      }

      // 4. Giri baarl
      this.currentCompany = company
      this.currentUser = user
      
      // Session storage'a kaydet
      sessionStorage.setItem('current_company', JSON.stringify(company))
      sessionStorage.setItem('current_user', JSON.stringify(user))

      console.log('Giri baarl:', user.fullName)

      return {
        success: true,
        company: company,
        user: user
      }

    } catch (error) {
      console.error('Giri hatas:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // LocalStorage'dan irket bul
  getCompanyFromLocalStorage(companyCode) {
    const companies = JSON.parse(localStorage.getItem('tlb_erp_companies')) || []
    return companies.find(c => c.code === companyCode && c.status === 'active')
  }

  // Supabase'dan irket bul
  async getCompanyFromSupabase(companyCode) {
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
      console.error('Supabase irket sorgu hatas:', error)
      return null
    }
  }

  // Kullanc bul (localStorage fallback)
  async findUser(companyCode, username, password) {
    // Önce localStorage'dan kontrol et
    const users = JSON.parse(localStorage.getItem(`tlb_erp_${companyCode}_users`)) || []
    const passwordHash = this.hashPassword(password)
    
    const user = users.find(u => 
      u.username === username && 
      u.companyId === companyCode &&
      u.isActive === true &&
      u.password === passwordHash
    )

    if (user) return user

    // Supabase'dan kullanc kontrolü
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .eq('company_id', companyCode)
          .eq('status', 'active')
          .single()

        if (error) throw error
        
        // ifre kontrolü (pratikte bcrypt kullanlmal)
        if (data && this.verifyPassword(password, data.password_hash)) {
          return this.formatUserFromSupabase(data)
        }
      } catch (error) {
        console.error('Supabase kullanc sorgu hatas:', error)
      }
    }

    return null
  }

  // Supabase kullanc formatn uygulama formatna çevir
  formatUserFromSupabase(supabaseUser) {
    return {
      id: supabaseUser.id,
      username: supabaseUser.username,
      email: supabaseUser.email,
      password: supabaseUser.password_hash, // Hash'li ifre
      fullName: supabaseUser.name,
      role: supabaseUser.role,
      companyId: supabaseUser.company_id,
      isActive: supabaseUser.status === 'active',
      createdAt: supabaseUser.created_at,
      lastLogin: supabaseUser.last_login
    }
  }

  // ifre dorulama (basit hash karlatrma)
  verifyPassword(inputPassword, storedHash) {
    return this.hashPassword(inputPassword) === storedHash
  }

  // ifre hashleme
  hashPassword(password) {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString()
  }

  // Çk
  logout() {
    this.currentCompany = null
    this.currentUser = null
    sessionStorage.removeItem('current_company')
    sessionStorage.removeItem('current_user')
  }

  // Giri kontrolü
  isLoggedIn() {
    return !!(this.currentCompany && this.currentUser)
  }

  // Plan bazl özellik kontrolü
  canAccessFeature(feature) {
    if (!this.currentCompany) return false
    
    const planFeatures = {
      'starter': ['dashboard', 'crm', 'inventory'],
      'premium': ['dashboard', 'crm', 'inventory', 'finance', 'reports'],
      'enterprise': ['dashboard', 'crm', 'inventory', 'finance', 'reports', 'hr', 'sales', 'settings']
    }
    
    const features = planFeatures[this.currentCompany.plan] || planFeatures.starter
    return features.includes(feature)
  }

  // Demo data olutur (ilk giri için)
  initializeDemoData(companyCode) {
    const demoUsers = [
      {
        id: 'demo_admin_' + companyCode,
        username: 'admin',
        email: `admin@${companyCode}.com`,
        password: this.hashPassword('admin123'),
        fullName: 'Demo Administrator',
        role: 'admin',
        companyId: companyCode,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo_user_' + companyCode,
        username: 'user',
        email: `user@${companyCode}.com`,
        password: this.hashPassword('user123'),
        fullName: 'Demo User',
        role: 'user',
        companyId: companyCode,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]

    localStorage.setItem(`tlb_erp_${companyCode}_users`, JSON.stringify(demoUsers))
    localStorage.setItem(`tlb_erp_${companyCode}_settings`, JSON.stringify({
      companyName: companyCode === 'ABC123' ? 'Demo Corporation' : 'Test Enterprises',
      companyAddress: "123 Business Street",
      currency: "USD",
      language: "en"
    }))

    console.log('Demo data oluturuldu:', companyCode)
  }

  // Tüm irketleri getir
  async getAllCompanies() {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('companies')
          .select('*')
          .eq('status', 'active')
          .order('name')

        if (error) throw error
        return data
      } catch (error) {
        console.error('irket listeleme hatas:', error)
      }
    }
    
    // Fallback: localStorage
    return JSON.parse(localStorage.getItem('tlb_erp_companies')) || []
  }
}

export const authService = new AuthService()
