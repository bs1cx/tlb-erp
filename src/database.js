export class Database {
  constructor() {
    this.loadFromStorage();
    
    // Varsaylan admin kullancs (eer yoksa)
    if (this.users.length === 0) {
      this.createDefaultData();
    }
  }

  loadFromStorage() {
    this.users = JSON.parse(localStorage.getItem('tlb_erp_users')) || [];
    this.userRoles = JSON.parse(localStorage.getItem('tlb_erp_user_roles')) || [];
    this.sessions = JSON.parse(localStorage.getItem('tlb_erp_sessions')) || [];
    this.customers = JSON.parse(localStorage.getItem('tlb_erp_customers')) || [];
    this.invoices = JSON.parse(localStorage.getItem('tlb_erp_invoices')) || [];
    this.settings = JSON.parse(localStorage.getItem('tlb_erp_settings')) || this.getDefaultSettings();
    this.revenues = JSON.parse(localStorage.getItem('tlb_erp_revenues')) || [];
    this.employees = JSON.parse(localStorage.getItem('tlb_erp_employees')) || [];
    this.titles = JSON.parse(localStorage.getItem('tlb_erp_titles')) || [];
    this.auditLogs = JSON.parse(localStorage.getItem('tlb_erp_audit_logs')) || [];
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

  createDefaultData() {
    console.log('Creating default TLB ERP data...');
    
    // Varsaylan admin kullanc
    const adminUser = {
      id: this.generateId(),
      username: 'admin',
      email: 'admin@tlb-erp.com',
      password: this.hashPassword('admin123'),
      fullName: 'System Administrator',
      role: 'admin',
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
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    this.users.push(adminUser, accountantUser, salesUser);

    // Kullanc izinleri
    const accountantPermissions = {
      id: this.generateId(),
      userId: accountantUser.id,
      permissions: ['dashboard', 'finance', 'reports']
    };

    const salesPermissions = {
      id: this.generateId(),
      userId: salesUser.id,
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
    localStorage.setItem('tlb_erp_users', JSON.stringify(this.users));
    localStorage.setItem('tlb_erp_user_roles', JSON.stringify(this.userRoles));
    localStorage.setItem('tlb_erp_sessions', JSON.stringify(this.sessions));
    localStorage.setItem('tlb_erp_customers', JSON.stringify(this.customers));
    localStorage.setItem('tlb_erp_invoices', JSON.stringify(this.invoices));
    localStorage.setItem('tlb_erp_settings', JSON.stringify(this.settings));
    localStorage.setItem('tlb_erp_revenues', JSON.stringify(this.revenues));
    localStorage.setItem('tlb_erp_employees', JSON.stringify(this.employees));
    localStorage.setItem('tlb_erp_titles', JSON.stringify(this.titles));
    localStorage.setItem('tlb_erp_audit_logs', JSON.stringify(this.auditLogs));
  }

  // Audit Log Methods
  addAuditLog(userId, action, details) {
    const log = {
      id: this.generateId(),
      userId: userId,
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
      ip: 'localhost' // Browser'da IP alnamaz
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
    const existingRole = this.userRoles.find(ur => ur.userId === userId);
    
    if (existingRole) {
      existingRole.permissions = permissions;
    } else {
      this.userRoles.push({
        id: this.generateId(),
        userId: userId,
        permissions: permissions
      });
    }
    this.addAuditLog('system', 'permissions_updated', `Permissions updated for user: ${userId}`);
    this.saveAllData();
  }

  getUserPermissions(userId) {
    const userRole = this.userRoles.find(ur => ur.userId === userId);
    return userRole ? userRole.permissions : [];
  }

  // Dier metodlar...
  getUsers() {
    return this.users.filter(user => user.role !== 'system');
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  updateUser(userId, updates) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      this.addAuditLog('system', 'user_updated', `User updated: ${userId}`);
      this.saveAllData();
      return true;
    }
    return false;
  }

  deleteUser(userId) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1 && this.users[userIndex].role !== 'admin') {
      this.users.splice(userIndex, 1);
      
      // User roles'tan da sil
      const roleIndex = this.userRoles.findIndex(ur => ur.userId === userId);
      if (roleIndex !== -1) {
        this.userRoles.splice(roleIndex, 1);
      }
      
      this.addAuditLog('system', 'user_deleted', `User deleted: ${userId}`);
      this.saveAllData();
      return true;
    }
    return false;
  }
}
