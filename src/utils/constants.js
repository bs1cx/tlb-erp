// TLB ERP Constants and Configuration

// Application Configuration
export const APP_CONFIG = {
  name: 'TLB ERP',
  version: '2.0.0',
  environment: import.meta.env.MODE || 'development',
  demoMode: true
}

// Application Modules
export const APP_MODULES = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'tachometer-alt',
    description: 'Overview and analytics'
  },
  finance: {
    id: 'finance', 
    name: 'Finance & Invoicing',
    icon: 'file-invoice-dollar',
    description: 'Financial management and invoicing'
  },
  crm: {
    id: 'crm',
    name: 'Customer Management',
    icon: 'users',
    description: 'Customer relationship management'
  },
  sales: {
    id: 'sales',
    name: 'Sales',
    icon: 'chart-line', 
    description: 'Sales pipeline and management'
  },
  inventory: {
    id: 'inventory',
    name: 'Inventory',
    icon: 'boxes',
    description: 'Stock and product management'
  },
  hr: {
    id: 'hr',
    name: 'Human Resources', 
    icon: 'user-tie',
    description: 'Employee and HR management'
  },
  reports: {
    id: 'reports',
    name: 'Reports & Analytics',
    icon: 'chart-bar',
    description: 'Business intelligence and reporting'
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: 'cog',
    description: 'System configuration'
  }
}

// User Roles and Permissions
export const USER_ROLES = {
  admin: {
    name: 'Administrator',
    permissions: ['all'],
    description: 'Full system access'
  },
  manager: {
    name: 'Manager', 
    permissions: ['dashboard', 'crm', 'sales', 'reports', 'finance', 'hr', 'inventory'],
    description: 'Management level access'
  },
  user: {
    name: 'User',
    permissions: ['dashboard', 'crm', 'inventory'],
    description: 'Standard user access'
  },
  accountant: {
    name: 'Accountant',
    permissions: ['dashboard', 'finance', 'reports'],
    description: 'Financial access only'
  }
}

// Industry Types
export const INDUSTRIES = [
  'Technology',
  'Manufacturing',
  'Retail',
  'Healthcare',
  'Finance',
  'Education',
  'Construction',
  'Transportation',
  'Hospitality',
  'Consulting',
  'Other'
]

// Currency Options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '', name: 'Euro' },
  { code: 'GBP', symbol: '', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'TRY', symbol: '', name: 'Turkish Lira' }
]

// Language Options
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '' },
  { code: 'tr', name: 'Türkçe', flag: '' },
  { code: 'fr', name: 'Français', flag: '' },
  { code: 'de', name: 'Deutsch', flag: '' },
  { code: 'es', name: 'Espaol', flag: '' }
]

// Status Types
export const STATUS_TYPES = {
  active: { label: 'Active', color: 'success', badge: 'status-active' },
  inactive: { label: 'Inactive', color: 'secondary', badge: 'status-inactive' },
  pending: { label: 'Pending', color: 'warning', badge: 'status-pending' },
  suspended: { label: 'Suspended', color: 'danger', badge: 'status-delayed' }
}

// Demo Data Configuration
export const DEMO_CONFIG = {
  defaultCompanyCode: 'ABC123',
  defaultCompanies: [
    {
      code: 'ABC123',
      name: 'Demo Corporation',
      industry: 'Technology'
    },
    {
      code: 'DEF456', 
      name: 'Test Enterprises',
      industry: 'Manufacturing'
    }
  ],
  defaultUsers: [
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      fullName: 'System Administrator'
    },
    {
      username: 'user', 
      password: 'user123',
      role: 'user',
      fullName: 'Demo User'
    }
  ]
}

// API Configuration
export const API_CONFIG = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  endpoints: {
    companies: '/companies',
    users: '/users',
    auth: '/auth'
  },
  timeout: 30000
}

// Local Storage Keys
export const STORAGE_KEYS = {
  companies: 'tlb_erp_companies',
  currentCompany: 'current_company',
  currentUser: 'current_user',
  userPrefix: 'tlb_erp_'
}

// Export helper functions
export const canAccessModule = (user, company, module) => {
  if (!user) return false
  
  const userRole = user.role
  
  // Admin her modüle eriebilir
  if (userRole === 'admin') return true
  
  // Role-based eriim kurallar
  switch (module) {
    case 'dashboard':
      return true // Herkes eriebilir
    case 'crm':
      return userRole === 'manager' || userRole === 'user' || userRole === 'accountant'
    case 'inventory':
      return userRole === 'manager' || userRole === 'user'
    case 'finance':
      return userRole === 'manager' || userRole === 'accountant'
    case 'sales':
      return userRole === 'manager'
    case 'hr':
      return userRole === 'manager'
    case 'reports':
      return userRole === 'manager' || userRole === 'accountant'
    case 'settings':
      return userRole === 'admin'
    default:
      return false
  }
}

export const getUserPermissions = (role) => {
  return USER_ROLES[role]?.permissions || USER_ROLES.user.permissions
}

export default {
  APP_CONFIG,
  APP_MODULES,
  USER_ROLES,
  INDUSTRIES,
  CURRENCIES,
  LANGUAGES,
  STATUS_TYPES,
  DEMO_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
  canAccessModule,
  getUserPermissions
}
