import { createClient } from '@supabase/supabase-js'

export class AuthService {
  constructor() {
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
      console.error('Supabase environment variables not found')
      throw new Error('Supabase yaplandrmas bulunamad')
    }
  }

  // irket girii + kullanc girii
  async login(companyCode, username, password) {
    try {
      console.log('Giri denemesi:', { companyCode, username })

      // 1. irketi Supabase'den kontrol et
      const company = await this.getCompanyFromSupabase(companyCode)
      if (!company) {
        throw new Error('irket bulunamad - Geçersiz irket kodu')
      }

      console.log('irket bulundu:', company.company_name)

      // 2. Kullancy irket içinde bul
      const user = await this.authenticateUser(company.id, username, password)
      if (!user) {
        throw new Error('Kullanc bulunamad veya ifre hatal')
      }

      // 3. Son giri tarihini güncelle
      await this.updateLastLogin(user.id)

      // 4. Giri baarl
      this.currentCompany = company
      this.currentUser = user
      
      // Session storage'a kaydet
      sessionStorage.setItem('current_company', JSON.stringify(company))
      sessionStorage.setItem('current_user', JSON.stringify(user))
      sessionStorage.setItem('company_id', company.id)
      sessionStorage.setItem('user_id', user.id)

      console.log('Giri baarl:', user.full_name)

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

  // Supabase'den irket bul
  async getCompanyFromSupabase(companyCode) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('company_code', companyCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('irket sorgu hatas:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('irket sorgu hatas:', error)
      return null
    }
  }

  // Kullanc dorulama (Supabase)
  async authenticateUser(companyId, username, password) {
    try {
      // Kullancy irket içinde bul
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .eq('username', username)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Kullanc sorgu hatas:', error)
        return null
      }

      if (!user) {
        return null
      }

      // ifre dorulama
      const isValidPassword = await this.verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        return null
      }

      return this.formatUserFromSupabase(user)

    } catch (error) {
      console.error('Kullanc dorulama hatas:', error)
      return null
    }
  }

  // ifre dorulama (basit hash karlatrma - production'da bcrypt kullanlmal)
  async verifyPassword(inputPassword, storedHash) {
    // Bu örnekte basit hash kullanyoruz, production'da bcrypt kullann
    const inputHash = this.hashPassword(inputPassword)
    return inputHash === storedHash
  }

  // ifre hashleme (basit örnek - production'da bcrypt kullann)
  hashPassword(password) {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString()
  }

  // Supabase kullanc formatn uygulama formatna çevir
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

  // Son giri tarihini güncelle
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
        console.error('Son giri güncelleme hatas:', error)
      }
    } catch (error) {
      console.error('Son giri güncelleme hatas:', error)
    }
  }

  // Çk
  logout() {
    this.currentCompany = null
    this.currentUser = null
    sessionStorage.removeItem('current_company')
    sessionStorage.removeItem('current_user')
    sessionStorage.removeItem('company_id')
    sessionStorage.removeItem('user_id')
  }

  // Giri kontrolü
  isLoggedIn() {
    const company = sessionStorage.getItem('current_company')
    const user = sessionStorage.getItem('current_user')
    return !!(company && user)
  }

  // Mevcut kullancy getir
  getCurrentUser() {
    if (this.currentUser) return this.currentUser
    
    const userStr = sessionStorage.getItem('current_user')
    if (userStr) {
      this.currentUser = JSON.parse(userStr)
      return this.currentUser
    }
    return null
  }

  // Mevcut irketi getir
  getCurrentCompany() {
    if (this.currentCompany) return this.currentCompany
    
    const companyStr = sessionStorage.getItem('current_company')
    if (companyStr) {
      this.currentCompany = JSON.parse(companyStr)
      return this.currentCompany
    }
    return null
  }

  // Demo data olutur (ilk kurulum için)
  async initializeDemoData() {
    try {
      // Demo irketleri olutur
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
            console.error('Demo irket oluturma hatas:', error)
            continue
          }

          // Demo kullanclar olutur
          const demoUsers = [
            {
              company_id: newCompany.id,
              username: 'admin',
              email: `admin@${companyData.company_code.toLowerCase()}.com`,
              password_hash: this.hashPassword('admin123'),
              full_name: 'Demo Administrator',
              role: 'admin',
              is_active: true
            },
            {
              company_id: newCompany.id,
              username: 'user',
              email: `user@${companyData.company_code.toLowerCase()}.com`,
              password_hash: this.hashPassword('user123'),
              full_name: 'Demo User',
              role: 'user',
              is_active: true
            }
          ]

          const { error: userError } = await this.supabase
            .from('users')
            .insert(demoUsers)

          if (userError) {
            console.error('Demo kullanc oluturma hatas:', userError)
          } else {
            console.log('Demo data oluturuldu:', companyData.company_code)
          }
        }
      }
    } catch (error) {
      console.error('Demo data oluturma hatas:', error)
    }
  }
}

export const authService = new AuthService()
