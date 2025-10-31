import { createClient } from '@supabase/supabase-js'

export class AuthService {
  constructor() {
    this.currentCompany = null
    this.currentUser = null
    this.supabase = null
    this.initializeSupabase()
  }

  initializeSupabase() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables not found')
      throw new Error('Server configuration missing')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase initialized successfully')
  }

  // Email ve password ile sign up
  async signUp(email, password, companyData) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyData.companyName,
            company_code: companyData.companyCode
          }
        }
      })

      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  // Email ve password ile sign in
  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Kullanc bilgilerini kaydet
      this.currentUser = data.user
      sessionStorage.setItem('current_user', JSON.stringify(data.user))
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  // Company code + email/password ile login
  async companyLogin(companyCode, email, password) {
    try {
      // Önce company kontrolü
      const company = await this.getCompanyFromSupabase(companyCode)
      if (!company) {
        throw new Error('Company not found - Invalid company code')
      }

      // Sonra sign in
      const result = await this.signIn(email, password)
      if (result.success) {
        this.currentCompany = company
        sessionStorage.setItem('current_company', JSON.stringify(company))
      }

      return result
    } catch (error) {
      console.error('Company login error:', error)
      return { success: false, error: error.message }
    }
  }

  // Company kontrolü
  async getCompanyFromSupabase(companyCode) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('company_code', companyCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) return null
      return data
    } catch (error) {
      console.error('Company query error:', error)
      return null
    }
  }

  // Oturum kontrolü
  async checkAuth() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      
      if (error) throw error
      
      if (session?.user) {
        this.currentUser = session.user
        sessionStorage.setItem('current_user', JSON.stringify(session.user))
        return true
      }
      return false
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    }
  }

  // Logout
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error

      this.currentUser = null
      this.currentCompany = null
      sessionStorage.removeItem('current_user')
      sessionStorage.removeItem('current_company')
      
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  // ifre sfrlama
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    }
  }

  isLoggedIn() {
    return !!this.currentUser
  }

  getCurrentUser() {
    return this.currentUser
  }

  getCurrentCompany() {
    return this.currentCompany
  }
}

export const authService = new AuthService()
