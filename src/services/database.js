export class DatabaseService {
  constructor() {
    this.prefix = 'tlb_erp_'
  }

  // Generic CRUD operations
  create(collection, data) {
    const items = this.get(collection) || []
    const newItem = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    }
    items.push(newItem)
    this.set(collection, items)
    return newItem
  }

  read(collection, id = null) {
    const items = this.get(collection) || []
    return id ? items.find(item => item.id === id) : items
  }

  update(collection, id, updates) {
    const items = this.get(collection) || []
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.set(collection, items)
      return items[index]
    }
    return null
  }

  delete(collection, id) {
    const items = this.get(collection) || []
    const filtered = items.filter(item => item.id !== id)
    this.set(collection, filtered)
    return true
  }

  // Helper methods
  get(key) {
    const data = localStorage.getItem(this.prefix + key)
    return data ? JSON.parse(data) : null
  }

  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value))
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Business-specific methods
  initializeSampleData() {
    if (!this.get('initialized')) {
      // Sample customers
      this.set('customers', [
        {
          id: 'cust_1',
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1-555-0123',
          address: '123 Business Ave, Toronto, ON',
          taxId: '123456789',
          status: 'active',
          balance: 15000.00
        }
      ])

      // Sample invoices
      this.set('invoices', [
        {
          id: 'inv_2023_001',
          customerId: 'cust_1',
          date: '2023-09-01',
          dueDate: '2023-09-30',
          items: [
            { description: 'Web Development', quantity: 10, price: 150.00, taxRate: 0.13 }
          ],
          status: 'paid',
          total: 1695.00
        }
      ])

      this.set('initialized', true)
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()
