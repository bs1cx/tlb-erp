export class CompanyService {
  constructor() {
    this.companies = JSON.parse(localStorage.getItem('tlb_erp_companies')) || [];
    this.currentCompanyId = localStorage.getItem('tlb_erp_current_company') || 'default';
    
    // Eer hiç company yoksa, default company'yi olutur
    if (this.companies.length === 0) {
      this.createDefaultCompanies();
    }
  }

  createDefaultCompanies() {
    const defaultCompany = {
      id: 'default',
      name: 'TLB ERP Solutions',
      subdomain: 'default',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const demoCompany = {
      id: 'demo_company',
      name: 'Demo Corporation',
      subdomain: 'demo',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.companies.push(defaultCompany, demoCompany);
    this.saveCompanies();
  }

  getAllCompanies() {
    return this.companies;
  }

  getCurrentCompany() {
    return this.companies.find(company => company.id === this.currentCompanyId) || this.companies[0];
  }

  setCurrentCompany(companyId) {
    this.currentCompanyId = companyId;
    localStorage.setItem('tlb_erp_current_company', companyId);
    return this.getCurrentCompany();
  }

  createCompany(companyData) {
    const company = {
      id: this.generateCompanyId(),
      name: companyData.name,
      subdomain: companyData.subdomain || companyData.name.toLowerCase().replace(/\s+/g, '_'),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    this.companies.push(company);
    this.saveCompanies();
    
    return company;
  }

  generateCompanyId() {
    return 'comp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  saveCompanies() {
    localStorage.setItem('tlb_erp_companies', JSON.stringify(this.companies));
  }

  // Demo data için hzl company oluturma
  createDemoCompany(companyName) {
    const company = this.createCompany({
      name: companyName,
      subdomain: companyName.toLowerCase().replace(/\s+/g, '-')
    });
    
    // Demo company için örnek data olutur
    this.initializeDemoData(company.id);
    
    return company;
  }

  initializeDemoData(companyId) {
    const demoUsers = [
      {
        id: 'demo_admin_' + companyId,
        username: 'admin',
        email: `admin@${companyId}.com`,
        password: 'admin123', // Hash'lenmi hali frontend'de oluturulacak
        fullName: 'Demo Administrator',
        role: 'admin',
        companyId: companyId,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const demoSettings = {
      companyName: "Demo Company",
      companyAddress: "456 Demo Street\\nDemo City, DC 12345",
      taxId: "DEMO123456",
      defaultTax: "0.10",
      currency: "USD",
      language: "en"
    };

    // Demo data'y localStorage'a kaydet
    localStorage.setItem(`tlb_erp_${companyId}_users`, JSON.stringify(demoUsers));
    localStorage.setItem(`tlb_erp_${companyId}_settings`, JSON.stringify(demoSettings));
    localStorage.setItem(`tlb_erp_${companyId}_customers`, JSON.stringify([]));
    localStorage.setItem(`tlb_erp_${companyId}_employees`, JSON.stringify([]));
    localStorage.setItem(`tlb_erp_${companyId}_invoices`, JSON.stringify([]));
  }

  // Company silme (sadece demo amaçl)
  deleteCompany(companyId) {
    if (companyId === 'default') {
      console.warn('Default company cannot be deleted');
      return false;
    }

    const companyIndex = this.companies.findIndex(company => company.id === companyId);
    if (companyIndex !== -1) {
      this.companies.splice(companyIndex, 1);
      this.saveCompanies();

      // Company data'sn temizle
      this.clearCompanyData(companyId);
      
      return true;
    }
    return false;
  }

  clearCompanyData(companyId) {
    const keys = [
      'users', 'user_roles', 'sessions', 'customers', 'invoices', 
      'settings', 'revenues', 'employees', 'titles', 'audit_logs'
    ];

    keys.forEach(key => {
      localStorage.removeItem(`tlb_erp_${companyId}_${key}`);
    });
  }
}

export const companyService = new CompanyService();
