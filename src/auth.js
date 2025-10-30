export class AuthSystem {
  constructor(database) {
    this.db = database;
    this.currentUser = null;
    this.isLoggedIn = false;
    this.currentCompany = null;
  }

  async login(username, password, companyCode = null) {
    try {
      // Eer companyCode verilmise, önce irket kontrolü yap
      if (companyCode) {
        const company = this.db.getCompanyByCode(companyCode);
        if (!company) {
          return { success: false, error: 'irket bulunamad - Geçersiz irket kodu' };
        }
        this.currentCompany = company;
        this.db.switchCompany(companyCode);
      }

      const user = this.db.users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === this.hashPassword(password) &&
        u.isActive &&
        u.companyId === this.db.companyId
      );

      if (user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Create session
        const session = {
          id: this.db.generateId(),
          userId: user.id,
          companyId: this.db.companyId,
          loginTime: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'localhost'
        };
        this.db.sessions.push(session);
        
        // Audit log
        this.db.addAuditLog(user.id, 'user_login', 'User logged in successfully');
        
        this.db.saveAllData();
        
        return { 
          success: true, 
          user,
          company: this.currentCompany 
        };
      }
      
      this.db.addAuditLog('system', 'login_failed', `Failed login attempt for: ${username}`);
      return { success: false, error: 'Invalid username or password' };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Company seçimi için özel login
  async companyLogin(companyCode, username, password) {
    return this.login(username, password, companyCode);
  }

  logout() {
    if (this.currentUser) {
      this.db.addAuditLog(this.currentUser.id, 'user_logout', 'User logged out');
    }
    this.currentUser = null;
    this.isLoggedIn = false;
    this.currentCompany = null;
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

  hasPermission(module) {
    if (!this.currentUser) return false;
    
    // Admin tüm modüllere eriebilir
    if (this.currentUser.role === 'admin') return true;
    
    // Kullancnn izinlerini kontrol et
    const userRole = this.db.userRoles.find(ur => 
      ur.userId === this.currentUser.id && 
      ur.companyId === this.db.companyId
    );
    return userRole && userRole.permissions.includes(module);
  }

  getAvailableModules() {
    if (!this.currentUser) return [];
    
    const allModules = [
      { id: 'dashboard', name: 'Dashboard', icon: 'tachometer-alt' },
      { id: 'finance', name: 'Finance & Invoicing', icon: 'file-invoice-dollar' },
      { id: 'crm', name: 'Customer Management', icon: 'users' },
      { id: 'sales', name: 'Sales', icon: 'chart-line' },
      { id: 'inventory', name: 'Inventory', icon: 'boxes' },
      { id: 'hr', name: 'Human Resources', icon: 'user-tie' },
      { id: 'reports', name: 'Reports', icon: 'chart-bar' },
      { id: 'settings', name: 'Settings', icon: 'cog' }
    ];

    if (this.currentUser.role === 'admin') {
      return allModules;
    }
    
    const userRole = this.db.userRoles.find(ur => 
      ur.userId === this.currentUser.id && 
      ur.companyId === this.db.companyId
    );
    const userPermissions = userRole ? userRole.permissions : [];
    
    return allModules.filter(module => userPermissions.includes(module.id));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getCurrentCompany() {
    return this.currentCompany;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  // Password validation
  validatePassword(password) {
    const minLength = 6;
    return password.length >= minLength;
  }

  // Email validation
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Company validation
  validateCompanyCode(code) {
    return code && code.length >= 3 && code.length <= 20;
  }
}
