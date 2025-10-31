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

  // Supabase ba�lant�s�n� ba�lat
  initializeSupabase() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables not found')
      throw new Error('Sunucu yap�land�rmas� eksik. L�tfen sistem y�neticinizle ileti�ime ge�in.')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase ba�ar�yla ba�lat�ld�')
  }

  // �irket giri�i + kullan�c� giri�i
  async login(companyCode, username, password) {
    try {
      console.log('Giri� denemesi:', { companyCode, username })

      // Rate limiting kontrol�
      const attemptKey = `${companyCode}-${username}`
      const attempts = this.failedAttempts.get(attemptKey) || 0
      
      if (attempts >= 5) {
        throw new Error('�ok fazla ba�ar�s�z giri� denemesi. L�tfen 15 dakika sonra tekrar deneyin.')
      }

      // Validasyon
      if (!companyCode?.trim() || !username?.trim() || !password) {
        throw new Error('T�m alanlar zorunludur')
      }

      // 1. �irketi Supabase'den kontrol et
      const company = await this.getCompanyFromSupabase(companyCode.toUpperCase())
      if (!company) {
        throw new Error('�irket bulunamad� - Ge�ersiz �irket kodu')
      }

      console.log('�irket bulundu:', company.company_name)

      // 2. Kullan�c�y� �irket i�inde bul
      const user = await this.authenticateUser(company.id, username, password)
      if (!user) {
        this.failedAttempts.set(attemptKey, attempts + 1)
        setTimeout(() => {
          this.failedAttempts.delete(attemptKey)
        }, 15 * 60 * 1000) // 15 dakika
        
        throw new Error('Kullan�c� bulunamad� veya �ifre hatal�')
      }

      // 3. Ba�ar�l� giri� - rate limiting'i temizle
      this.failedAttempts.delete(attemptKey)

      // 4. Son giri� tarihini g�ncelle
      await this.updateLastLogin(user.id)

      // 5. JWT token olu�tur
      const authToken = this.generateAuthToken(user)

      // 6. Giri� ba�ar�l�
      this.currentCompany = company
      this.currentUser = user
      
      // Session storage'a kaydet
      sessionStorage.setItem('current_company', JSON.stringify(company))
      sessionStorage.setItem('current_user', JSON.stringify(user))
      sessionStorage.setItem('company_id', company.id)
      sessionStorage.setItem('user_id', user.id)
      sessionStorage.setItem('auth_token', authToken)

      console.log('Giri� ba�ar�l�:', user.full_name)

      return {
        success: true,
        company: company,
        user: user,
        token: authToken
      }

    } catch (error) {
      console.error('Giri� hatas�:', error)
      
      // Hassas hata mesajlar�n� filtrele
      const safeMessage = error.message.includes('�ifre') || 
                         error.message.includes('kullan�c�') || 
                         error.message.includes('�irket bulunamad�')
        ? 'Kullan�c� ad� veya �ifre hatal�' 
        : error.message
      
      return {
        success: false,
        error: safeMessage
      }
    }
  }

  // JWT token olu�turma
  generateAuthToken(user) {
    // Basit bir token olu�turma (production'da JWT k�t�phanesi kullan�n)
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

  // Token do�rulama
  verifyToken(token) {
    try {
      const tokenData = JSON.parse(atob(token))
      
      if (tokenData.expires < Date.now()) {
        return null // Token s�resi dolmu�
      }
      
      return tokenData
    } catch (error) {
      console.error('Token do�rulama hatas�:', error)
      return null
    }
  }

  // Supabase'den �irket bul
  async getCompanyFromSupabase(companyCode) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('company_code', companyCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('�irket sorgu hatas�:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('�irket sorgu hatas�:', error)
      return null
    }
  }

  // Kullan�c� do�rulama (Supabase)
  async authenticateUser(companyId, username, password) {
    try {
      // Kullan�c�y� �irket i�inde bul
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .eq('username', username)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Kullan�c� sorgu hatas�:', error)
        return null
      }

      if (!user) {
        return null
      }

      // �ifre do�rulama (bcrypt ile)
      const isValidPassword = await this.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        return null
      }

      return this.formatUserFromSupabase(user)

    } catch (error) {
      console.error('Kullan�c� do�rulama hatas�:', error)
      return null
    }
  }

  // �ifre do�rulama (bcrypt ile g�venli)
  async verifyPassword(inputPassword, storedHash) {
    try {
      return await bcrypt.compare(inputPassword, storedHash)
    } catch (error) {
      console.error('�ifre do�rulama hatas�:', error)
      return false
    }
  }

  // �ifre hashleme (bcrypt ile g�venli)
  async hashPassword(password) {
    try {
      const saltRounds = 12
      return await bcrypt.hash(password, saltRounds)
    } catch (error) {
      console.error('�ifre hashleme hatas�:', error)
      throw new Error('�ifre i�leme hatas�')
    }
  }

  // Supabase kullan�c� format�n� uygulama format�na �evir
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

  // Son giri� tarihini g�ncelle
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
        console.error('Son giri� g�ncelleme hatas�:', error)
      }
    } catch (error) {
      console.error('Son giri� g�ncelleme hatas�:', error)
    }
  }

  // ��k��
  logout() {
    this.currentCompany = null
    this.currentUser = null
    sessionStorage.removeItem('current_company')
    sessionStorage.removeItem('current_user')
    sessionStorage.removeItem('company_id')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('auth_token')
  }

  // Giri� kontrol�
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

  // Mevcut kullan�c�y� getir
  getCurrentUser() {
    if (this.currentUser) return this.currentUser
    
    const userStr = sessionStorage.getItem('current_user')
    if (userStr) {
      this.currentUser = JSON.parse(userStr)
      return this.currentUser
    }
    return null
  }

  // Mevcut �irketi getir
  getCurrentCompany() {
    if (this.currentCompany) return this.currentCompany
    
    const companyStr = sessionStorage.getItem('current_company')
    if (companyStr) {
      this.currentCompany = JSON.parse(companyStr)
      return this.currentCompany
    }
    return null
  }

  // Token'� getir
  getCurrentToken() {
    return sessionStorage.getItem('auth_token')
  }

  // Demo data olu�tur (ilk kurulum i�in)
  async initializeDemoData() {
    try {
      // Demo �irketleri olu�tur
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
            console.error('Demo �irket olu�turma hatas�:', error)
            continue
          }

          // Demo kullan�c�lar olu�tur
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
            console.error('Demo kullan�c� olu�turma hatas�:', userError)
          } else {
            console.log('Demo data olu�turuldu:', companyData.company_code)
          }
        }
      }
    } catch (error) {
      console.error('Demo data olu�turma hatas�:', error)
    }
  }

  // �ifre de�i�tirme
  async changePassword(currentPassword, newPassword) {
    try {
      const currentUser = this.getCurrentUser()
      if (!currentUser) {
        throw new Error('Kullan�c� bulunamad�')
      }

      // Mevcut �ifreyi do�rula
      const userData = await this.supabase
        .from('users')
        .select('password_hash')
        .eq('id', currentUser.id)
        .single()

      if (!userData.data) {
        throw new Error('Kullan�c� verileri al�namad�')
      }

      const isValid = await this.verifyPassword(currentPassword, userData.data.password_hash)
      if (!isValid) {
        throw new Error('Mevcut �ifre hatal�')
      }

      // Yeni �ifreyi hashle ve g�ncelle
      const newPasswordHash = await this.hashPassword(newPassword)
      
      const { error } = await this.supabase
        .from('users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)

      if (error) {
        throw new Error('�ifre g�ncellenemedi')
      }

      return { success: true, message: '�ifre ba�ar�yla de�i�tirildi' }

    } catch (error) {
      console.error('�ifre de�i�tirme hatas�:', error)
      return { success: false, error: error.message }
    }
  }
}

export const authService = new AuthService()