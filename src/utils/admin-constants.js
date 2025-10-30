// Admin Panel Constants

export const ADMIN_CONFIG = {
  superAdmin: {
    username: 'thelebois',
    password: 'thelebois2024',
    fullName: 'System Super Admin',
    role: 'super_admin'
  }
}

export const COMPANY_PLANS_DETAILED = {
  starter: {
    name: 'Starter',
    price: 0,
    monthly_price: 0,
    yearly_price: 0,
    features: ['dashboard', 'crm', 'inventory'],
    userLimit: 3,
    storageLimit: '1GB',
    support: 'Basic',
    color: 'blue',
    popular: false
  },
  premium: {
    name: 'Premium',
    price: 49,
    monthly_price: 49,
    yearly_price: 529, // $49 * 12 * 0.9 (10% discount)
    features: ['dashboard', 'crm', 'inventory', 'finance', 'reports'],
    userLimit: 10,
    storageLimit: '10GB',
    support: 'Priority',
    color: 'purple',
    popular: true
  },
  enterprise: {
    name: 'Enterprise',
    price: 149,
    monthly_price: 149,
    yearly_price: 1609, // $149 * 12 * 0.9 (10% discount)
    features: ['dashboard', 'crm', 'inventory', 'finance', 'reports', 'hr', 'sales', 'settings'],
    userLimit: 50,
    storageLimit: '50GB',
    support: '24/7 Dedicated',
    color: 'orange',
    popular: false
  }
}

export const INDUSTRY_OPTIONS = [
  'Technology',
  'Manufacturing',
  'Retail & E-commerce',
  'Healthcare',
  'Finance & Banking',
  'Education',
  'Construction & Real Estate',
  'Transportation & Logistics',
  'Hospitality & Tourism',
  'Consulting & Professional Services',
  'Media & Entertainment',
  'Non-Profit & Associations',
  'Other'
]

export const COMPANY_STATUS = {
  active: { label: 'Active', color: 'success', icon: 'check-circle' },
  inactive: { label: 'Inactive', color: 'secondary', icon: 'pause-circle' },
  suspended: { label: 'Suspended', color: 'danger', icon: 'ban' },
  trial: { label: 'Trial', color: 'warning', icon: 'clock' }
}

export const ADMIN_ACTIONS = {
  CREATE_COMPANY: 'create_company',
  UPDATE_PLAN: 'update_plan',
  SUSPEND_COMPANY: 'suspend_company',
  DELETE_COMPANY: 'delete_company',
  RESET_DATA: 'reset_data'
}

export default {
  ADMIN_CONFIG,
  COMPANY_PLANS_DETAILED,
  INDUSTRY_OPTIONS,
  COMPANY_STATUS,
  ADMIN_ACTIONS
}
