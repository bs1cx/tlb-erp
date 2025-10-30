export class Database {
  constructor(companyId = 'default') {
    this.companyId = companyId;
    this.loadFromStorage();
    
    // Sadece default company için varsaylan data olutur
    if (this.users.length === 0 && companyId === 'default') {
      this.createDefaultData();
    }
  }

  loadFromStorage() {
    // Tüm localStorage key'lerini companyId ile prefix'le
    this.users = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_users`)) || [];
    this.userRoles = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_user_roles`)) || [];
    this.sessions = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_sessions`)) || [];
    this.customers = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_customers`)) || [];
    this.invoices = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_invoices`)) || [];
    this.settings = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_settings`)) || this.getDefaultSettings();
    this.revenues = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_revenues`)) || [];
    this.employees = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_employees`)) || [];
    this.titles = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_titles`)) || [];
    this.auditLogs = JSON.parse(localStorage.getItem(`tlb_erp_${this.companyId}_audit_logs`)) || [];
    
    // Companies tablosu için (Supabase entegrasyonu öncesi)
    this.companies = JSON.parse(localStorage.getItem('tlb_erp_companies')) || this.getDefaultCompanies();
  }

  getDefaultSettings() {
    return {
      companyName: "TLB ERP Solutions",
      companyAddress: "123 Business Ave.\\nToronto, ON M1B 2C3\\nCanada",
      taxId: "123456789",
      defaultTax: "0.13",
      currency: "CAD",
      language: "en"
    };
  }

  getDefaultCompanies() {
    return [
      {
        id: 'ABC123',
        code: 'ABC123',
        name: 'Demo Corporation',
        industry: 'Technology',
        employee_count: 50,
        plan: 'enterprise',
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: 'DEF456',
        code: 'DEF456', 
        name: 'Test Enterprises',
        industry: 'Manufacturing',
        employee_count: 25,
        plan: 'premium',
        status: 'active',
        created_at: new Date().toISOString()
      }
    ];
  }

  createDefaultData() {
    console.log('Creating default TLB ERP data...');
    
    // Varsaylan admin kullanc - companyId ekle
    const adminUser = {
      id: this.generateId(),
      username: 'admin',
      email: 'admin@tlb-erp.com',
      password: this.hashPassword('admin123'),
      fullName: 'System Administrator',
      role: 'admin',
      companyId: this.companyId,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Varsaylan muhasebe kullancs
    const accountantUser = {
      id: this.generateId(),
      username: 'accountant',
      email: 'accountant@tlb-erp.com',
      password: this.hashPassword('accountant123'),
      fullName: 'Accountant User',
      role: 'user',
      companyId: this.companyId,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Varsaylan sat kullancs
    const salesUser = {
      id: this.generateId(),
      username: 'sales',
      email: 'sales@tlb-erp.com',
      password: this.hashPassword('sales123'),
      fullName: 'Sales Representative',
      role: 'user',
      companyId: this.companyId,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    this.users.push(adminUser, accountantUser, salesUser);

    // Kullanc izinleri
    const accountantPermissions = {
      id: this.generateId(),
      userId: accountantUser.id,
      companyId: this.companyId,
      permissions: ['dashboard', 'finance', 'reports']
    };

    const salesPermissions = {
      id: this.generateId(),
      userId: salesUser.id,
      companyId: this.companyId,
      permissions: ['dashboard', 'crm', 'sales']
    };

    this.userRoles.push(accountantPermissions, salesPermissions);

    // Audit log
    this.addAuditLog('system', 'default_data_created', 'Default users and settings created');

    this.saveAllData();
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  saveAllData() {
    localStorage.setItem(`tlb_erp_${this.companyId}_users`, JSON.stringify(this.users));
    localStorage.setItem(`tlb_erp_${this.companyId}_user_roles`, JSON.stringify(this.userRoles));
    localStorage.setItem(`tlb_erp_${this.companyId}_sessions`, JSON.stringify(this.sessions));
    localStorage.setItem(`tlb_erp_${this.companyId}_customers`, JSON.stringify(this.customers));
    localStorage.setItem(`tlb_erp_${this.companyId}_invoices`, JSON.stringify(this.invoices));
    localStorage.setItem(`tlb_erp_${this.companyId}_settings`, JSON.stringify(this.settings));
    localStorage.setItem(`tlb_erp_${this.companyId}_revenues`, JSON.stringify(this.revenues));
    localStorage.setItem(`tlb_erp_${this.companyId}_employees`, JSON.stringify(this.employees));
    localStorage.setItem(`tlb_erp_${this.companyId}_titles`, JSON.stringify(this.titles));
    localStorage.setItem(`tlb_erp_${this.companyId}_audit_logs`, JSON.stringify(this.auditLogs));
    localStorage.setItem('tlb_erp_companies', JSON.stringify(this.companies));
  }

  // Company Management Methods
  getCompanyByCode(code) {
    return this.companies.find(company => company.code === code && company.status === 'active');
  }

  getAllCompanies() {
    return this.companies.filter(company => company.status === 'active');
  }

  createCompany(companyData) {
    const company = {
      id: this.generateId(),
      ...companyData,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.companies.push(company);
    this.saveAllData();
    return company;
  }

  updateCompany(companyId, updates) {
    const companyIndex = this.companies.findIndex(c => c.id === companyId);
    if (companyIndex !== -1) {
      this.companies[companyIndex] = { 
        ...this.companies[companyIndex], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      this.saveAllData();
      return true;
    }
    return false;
  }

  // Audit Log Methods
  addAuditLog(userId, action, details) {
    const log = {
      id: this.generateId(),
      userId: userId,
      action: action,
      details: details,
      companyId: this.companyId,
      timestamp: new Date().toISOString(),
      ip: 'localhost'
    };
    this.auditLogs.push(log);
    // Son 1000 log'u tut
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
  }

  // User Management Methods
  createUser(userData) {
    const user = {
      id: this.generateId(),
      ...userData,
      companyId: this.companyId,
      password: this.hashPassword(userData.password),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    this.users.push(user);
    this.addAuditLog('system', 'user_created', `User created: ${user.username}`);
    this.saveAllData();
    return user.id;
  }

  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  updateUserPermissions(userId, permissions) {
    const existingRole = this.userRoles.find(ur => ur.userId === userId && ur.companyId === this.companyId);
    
    if (existingRole) {
      existingRole.permissions = permissions;
    } else {
      this.userRoles.push({
        id: this.generateId(),
        userId: userId,
        companyId: this.companyId,
        permissions: permissions
      });
    }
    this.addAuditLog('system', 'permissions_updated', `Permissions updated for user: ${userId}`);
    this.saveAllData();
  }

  getUserPermissions(userId) {
    const userRole = this.userRoles.find(ur => ur.userId === userId && ur.companyId === this.companyId);
    return userRole ? userRole.permissions : [];
  }

  // Dier metodlar...
  getUsers() {
    return this.users.filter(user => user.role !== 'system' && user.companyId === this.companyId);
  }

  getUserById(id) {
    return this.users.find(user => user.id === id && user.companyId === this.companyId);
  }

  updateUser(userId, updates) {
    const userIndex = this.users.findIndex(user => user.id === userId && user.companyId === this.companyId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      this.addAuditLog('system', 'user_updated', `User updated: ${userId}`);
      this.saveAllData();
      return true;
    }
    return false;
  }

  deleteUser(userId) {
    const userIndex = this.users.findIndex(user => user.id === userId && user.companyId === this.companyId);
    if (userIndex !== -1 && this.users[userIndex].role !== 'admin') {
      this.users.splice(userIndex, 1);
      
      // User roles'tan da sil
      const roleIndex = this.userRoles.findIndex(ur => ur.userId === userId && ur.companyId === this.companyId);
      if (roleIndex !== -1) {
        this.userRoles.splice(roleIndex, 1);
      }
      
      this.addAuditLog('system', 'user_deleted', `User deleted: ${userId}`);
      this.saveAllData();
      return true;
    }
    return false;
  }

  // Company management methods
  switchCompany(companyId) {
    this.companyId = companyId;
    this.loadFromStorage();
  }

  // Mevcut company'yi temizle (demo için)
  clearCompanyData() {
    localStorage.removeItem(`tlb_erp_${this.companyId}_users`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_user_roles`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_sessions`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_customers`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_invoices`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_settings`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_revenues`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_employees`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_titles`);
    localStorage.removeItem(`tlb_erp_${this.companyId}_audit_logs`);
    
    this.loadFromStorage();
  }
}
