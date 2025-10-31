import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

export class AuthService {
  constructor() {
    this.currentCompany = null
    this.currentUser = null
    this.supabase = null
    this.failedAttempts = new Map()
    this.initializeSupabase()
  }

  // Supabase baðlantýsýný baþlat
  initializeSupabase() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables not found')
      throw new Error('Sunucu yapýlandýrmasý eksik. Lütfen sistem yöneticinizle iletiþime geçin.')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase baþarýyla baþlatýldý')
  }

  // Þirket giriþi + kullanýcý giriþi
  async login(companyCode, username, password) {
    try {
      console.log('Giriþ denemesi:', { companyCode, username })

      // Rate limiting kontrolü
      const attemptKey = `${companyCode}-${username}`
      const attempts = this.failedAttempts.get(attemptKey) || 0
      
      if (attempts >= 5) {
        throw new Error('Çok fazla baþarýsýz giriþ denemesi. Lütfen 15 dakika sonra tekrar deneyin.')
      }

      // Validasyon
      if (!companyCode?.trim() || !username?.trim() || !password) {
        throw new Error('Tüm alanlar zorunludur')
      }

      // 1. Þirketi Supabase'den kontrol et
      const company = await this.getCompanyFromSupabase(companyCode.toUpperCase())
      if (!company) {
        throw new Error('Þirket bulunamadý - Geçersiz þirket kodu')
      }

      console.log('Þirket bulundu:', company.company_name)

      // 2. Kullanýcýyý þirket içinde bul
      const user = await this.authenticateUser(company.id, username, password)
      if (!user) {
        this.failedAttempts.set(attemptKey, attempts + 1)
        setTimeout(() => {
          this.failedAttempts.delete(attemptKey)
        }, 15 * 60 * 1000) // 15 dakika
        
        throw new Error('Kullanýcý bulunamadý veya þifre hatalý')
      }

      // 3. Baþarýlý giriþ - rate limiting'i temizle
      this.failedAttempts.delete(attemptKey)

      // 4. Son giriþ tarihini güncelle
      await this.updateLastLogin(user.id)

      // 5. JWT token oluþtur
      const authToken = this.generateAuthToken(user)

      // 6. Giriþ baþarýlý
      this.currentCompany = company
      this.currentUser = user
      
      // Session storage'a kaydet
      sessionStorage.setItem('current_company', JSON.stringify(company))
      sessionStorage.setItem('current_user', JSON.stringify(user))
      sessionStorage.setItem('company_id', company.id)
      sessionStorage.setItem('user_id', user.id)
      sessionStorage.setItem('auth_token', authToken)

      console.log('Giriþ baþarýlý:', user.full_name)

      return {
        success: true,
        company: company,
        user: user,
        token: authToken
      }

    } catch (error) {
      console.error('Giriþ hatasý:', error)
      
      // Hassas hata mesajlarýný filtrele
      const safeMessage = error.message.includes('þifre') || 
                         error.message.includes('kullanýcý') || 
                         error.message.includes('Þirket bulunamadý')
        ? 'Kullanýcý adý veya þifre hatalý' 
        : error.message
      
      return {
        success: false,
        error: safeMessage
      }
    }
  }

  // JWT token oluþturma
  generateAuthToken(user) {
    // Basit bir token oluþturma (production'da JWT kütüphanesi kullanýn)
    const tokenData = {
      userId: user.id,
      companyId: user.company_id,
      role: user.role,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 saat
    }
    
    const token = btoa(JSON.stringify(tokenData))
    return token
  }

  // Token doðrulama
  verifyToken(token) {
    try {
      const tokenData = JSON.parse(atob(token))
      
      if (tokenData.expires < Date.now()) {
        return null // Token süresi dolmuþ
      }
      
      return tokenData
    } catch (error) {
      console.error('Token doðrulama hatasý:', error)
      return null
    }
  }

  // Supabase'den þirket bul
  async getCompanyFromSupabase(companyCode) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('company_code', companyCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Þirket sorgu hatasý:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Þirket sorgu hatasý:', error)
      return null
    }
  }

  // Kullanýcý doðrulama (Supabase)
  async authenticateUser(companyId, username, password) {
    try {
      // Kullanýcýyý þirket içinde bul
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .eq('username', username)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Kullanýcý sorgu hatasý:', error)
        return null
      }

      if (!user) {
        return null
      }

      // Þifre doðrulama (bcrypt ile)
      const isValidPassword = await this.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        return null
      }

      return this.formatUserFromSupabase(user)

    } catch (error) {
      console.error('Kullanýcý doðrulama hatasý:', error)
      return null
    }
  }

  // Þifre doðrulama (bcrypt ile güvenli)
  async verifyPassword(inputPassword, storedHash) {
    try {
      return await bcrypt.compare(inputPassword, storedHash)
    } catch (error) {
      console.error('Þifre doðrulama hatasý:', error)
      return false
    }
  }

  // Þifre hashleme (bcrypt ile güvenli)
  async hashPassword(password) {
    try {
      const saltRounds = 12
      return await bcrypt.hash(password, saltRounds)
    } catch (error) {
      console.error('Þifre hashleme hatasý:', error)
      throw new Error('Þifre iþleme hatasý')
    }
  }

  // Supabase kullanýcý formatýný uygulama formatýna çevir
  formatUserFromSupabase(supabaseUser) {
    return {
      id: supabaseUser.id,
      username: supabaseUser.username,
      email: supabaseUser.email,
      full_name: supabaseUser.full_name,
      role: supabaseUser.role,
      company_id: supabaseUser.company_id,
      is_active: supabaseUser.is_active,
      created_at: supabaseUser.created_at,
      last_login: supabaseUser.last_login
    }
  }

  // Son giriþ tarihini güncelle
  async updateLastLogin(userId) {
    try {
      const { error } = await this.supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Son giriþ güncelleme hatasý:', error)
      }
    } catch (error) {
      console.error('Son giriþ güncelleme hatasý:', error)
    }
  }

  // Çýkýþ
  logout() {
    this.currentCompany = null
    this.currentUser = null
    sessionStorage.removeItem('current_company')
    sessionStorage.removeItem('current_user')
    sessionStorage.removeItem('company_id')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('auth_token')
  }

  // Giriþ kontrolü
  isLoggedIn() {
    const token = sessionStorage.getItem('auth_token')
    if (!token) return false

    const tokenData = this.verifyToken(token)
    if (!tokenData) {
      this.logout()
      return false
    }

    const company = sessionStorage.getItem('current_company')
    const user = sessionStorage.getItem('current_user')
    return !!(company && user)
  }

  // Mevcut kullanýcýyý getir
  getCurrentUser() {
    if (this.currentUser) return this.currentUser
    
    const userStr = sessionStorage.getItem('current_user')
    if (userStr) {
      this.currentUser = JSON.parse(userStr)
      return this.currentUser
    }
    return null
  }

  // Mevcut þirketi getir
  getCurrentCompany() {
    if (this.currentCompany) return this.currentCompany
    
    const companyStr = sessionStorage.getItem('current_company')
    if (companyStr) {
      this.currentCompany = JSON.parse(companyStr)
      return this.currentCompany
    }
    return null
  }

  // Token'ý getir
  getCurrentToken() {
    return sessionStorage.getItem('auth_token')
  }

  // Demo data oluþtur (ilk kurulum için)
  async initializeDemoData() {
    try {
      // Demo þirketleri oluþtur
      const demoCompanies = [
        {
          company_code: 'ABC123',
          company_name: 'Demo Corporation',
          is_active: true
        },
        {
          company_code: 'DEF456',
          company_name: 'Test Enterprises', 
          is_active: true
        }
      ]

      for (const companyData of demoCompanies) {
        const { data: existingCompany } = await this.supabase
          .from('companies')
          .select('id')
          .eq('company_code', companyData.company_code)
          .single()

        if (!existingCompany) {
          const { data: newCompany, error } = await this.supabase
            .from('companies')
            .insert([companyData])
            .select()
            .single()

          if (error) {
            console.error('Demo þirket oluþturma hatasý:', error)
            continue
          }

          // Demo kullanýcýlar oluþtur
          const demoUsers = [
            {
              company_id: newCompany.id,
              username: 'admin',
              email: `admin@${companyData.company_code.toLowerCase()}.com`,
              password_hash: await this.hashPassword('admin123'),
              full_name: 'Demo Administrator',
              role: 'admin',
              is_active: true
            },
            {
              company_id: newCompany.id,
              username: 'user',
              email: `user@${companyData.company_code.toLowerCase()}.com`,
              password_hash: await this.hashPassword('user123'),
              full_name: 'Demo User',
              role: 'user',
              is_active: true
            }
          ]

          const { error: userError } = await this.supabase
            .from('users')
            .insert(demoUsers)

          if (userError) {
            console.error('Demo kullanýcý oluþturma hatasý:', userError)
          } else {
            console.log('Demo data oluþturuldu:', companyData.company_code)
          }
        }
      }
    } catch (error) {
      console.error('Demo data oluþturma hatasý:', error)
    }
  }

  // Þifre deðiþtirme
  async changePassword(currentPassword, newPassword) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('Kullanýcý bulunamadý')
      }

      // Mevcut þifreyi doðrula
      const userData = await this.supabase
        .from('users')
        .select('password_hash')
        .eq('id', currentUser.id)
        .single()

      if (!userData.data) {
        throw new Error('Kullanýcý verileri alýnamadý')
      }

      const isValid = await this.verifyPassword(currentPassword, userData.data.password_hash)
      if (!isValid) {
        throw new Error('Mevcut þifre hatalý')
      }

      // Yeni þifreyi hashle ve güncelle
      const newPasswordHash = await this.hashPassword(newPassword)
      
      const { error } = await this.supabase
        .from('users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)

      if (error) {
        throw new Error('Þifre güncellenemedi')
      }

      return { success: true, message: 'Þifre baþarýyla deðiþtirildi' }

    } catch (error) {
      console.error('Þifre deðiþtirme hatasý:', error)
      return { success: false, error: error.message }
    }
  }
}

export const authService = new AuthService()