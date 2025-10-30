import { createClient } from '@supabase/supabase-js'

// Supabase client'n olutur
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helper fonksiyonlar
export class DatabaseService {
  constructor() {
    this.supabase = supabase
  }

  // Mevcut irket ID'sini al
  getCurrentCompanyId() {
    return sessionStorage.getItem('company_id')
  }

  // Mevcut kullanc ID'sini al
  getCurrentUserId() {
    return sessionStorage.getItem('user_id')
  }

  // irket bazl veri çekme
  async fromTable(tableName, options = {}) {
    const { select = '*', filters = {}, orderBy = {} } = options
    const companyId = this.getCurrentCompanyId()
    
    if (!companyId) {
      throw new Error('irket bilgisi bulunamad')
    }

    let query = this.supabase
      .from(tableName)
      .select(select)
      .eq('company_id', companyId)

    // Filtreleri uygula
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    // Sralama
    if (orderBy.column && orderBy.direction) {
      query = query.order(orderBy.column, { ascending: orderBy.direction === 'asc' })
    }

    const { data, error } = await query

    if (error) {
      console.error(`Database error (${tableName}):`, error)
      throw error
    }

    return data
  }

  // Veri ekleme
  async insert(tableName, data) {
    const companyId = this.getCurrentCompanyId()
    const userId = this.getCurrentUserId()
    
    if (!companyId) {
      throw new Error('irket bilgisi bulunamad')
    }

    const record = {
      ...data,
      company_id: companyId,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: result, error } = await this.supabase
      .from(tableName)
      .insert([record])
      .select()

    if (error) {
      console.error(`Insert error (${tableName}):`, error)
      throw error
    }

    return result[0]
  }

  // Veri güncelleme
  async update(tableName, id, updates) {
    const userId = this.getCurrentUserId()
    
    const record = {
      ...updates,
      updated_by: userId,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from(tableName)
      .update(record)
      .eq('id', id)
      .select()

    if (error) {
      console.error(`Update error (${tableName}):`, error)
      throw error
    }

    return data[0]
  }

  // Veri silme (soft delete)
  async softDelete(tableName, id) {
    return this.update(tableName, id, {
      is_active: false,
      deleted_at: new Date().toISOString()
    })
  }

  // Realtime subscription
  subscribe(tableName, event, callback) {
    return this.supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: tableName,
          filter: `company_id=eq.${this.getCurrentCompanyId()}`
        },
        callback
      )
      .subscribe()
  }
}

export const dbService = new DatabaseService()
