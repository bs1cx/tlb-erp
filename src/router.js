import { createRouter, createWebHashHistory } from 'vue-router'
import { authService } from './services/authService.js'

// Lazy-loaded components for better performance
const CompanyLogin = () => import('./components/CompanyLogin.js').then(m => m.default || m)
const Dashboard = () => import('./modules/dashboard/main.js').then(m => m.default || m)
const Finance = () => import('./modules/finance/main.js').then(m => m.default || m)
const CRM = () => import('./modules/crm/main.js').then(m => m.default || m)
const HR = () => import('./modules/hr/main.js').then(m => m.default || m)
const Inventory = () => import('./modules/inventory/main.js').then(m => m.default || m)
const Reports = () => import('./modules/reports/main.js').then(m => m.default || m)
const Settings = () => import('./modules/settings/main.js').then(m => m.default || m)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: CompanyLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, module: 'dashboard' }
  },
  {
    path: '/finance',
    name: 'finance',
    component: Finance,
    meta: { requiresAuth: true, module: 'finance' }
  },
  {
    path: '/crm',
    name: 'crm',
    component: CRM,
    meta: { requiresAuth: true, module: 'crm' }
  },
  {
    path: '/hr',
    name: 'hr',
    component: HR,
    meta: { requiresAuth: true, module: 'hr' }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: Inventory,
    meta: { requiresAuth: true, module: 'inventory' }
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: { requiresAuth: true, module: 'reports' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true, module: 'settings' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Auth guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresModule = to.meta.module

  // Giri sayfasna eriim kontrolü
  if (to.path === '/login' && authService.isLoggedIn()) {
    // Zaten giri yapm kullancy dashboard'a yönlendir
    next('/')
    return
  }

  if (requiresAuth && !authService.isLoggedIn()) {
    // Giri yapmam kullancy login sayfasna yönlendir
    next('/login')
  } else if (requiresAuth && requiresModule) {
    // Modül eriim kontrolü
    const user = authService.getCurrentUser()
    const company = authService.getCurrentCompany()
    
    if (user && company) {
      // Basit rol bazl eriim kontrolü
      const hasAccess = router.checkModuleAccess(user.role, requiresModule)
      if (hasAccess) {
        next()
      } else {
        // Eriim izni yoksa dashboard'a yönlendir
        next('/')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

// Modül eriim kontrolü
router.checkModuleAccess = (userRole, module) => {
  const accessMatrix = {
    admin: ['dashboard', 'finance', 'crm', 'hr', 'inventory', 'reports', 'settings'],
    manager: ['dashboard', 'crm', 'hr', 'inventory', 'reports'],
    user: ['dashboard', 'crm', 'inventory'],
    guest: ['dashboard']
  }

  const allowedModules = accessMatrix[userRole] || accessMatrix.guest
  return allowedModules.includes(module)
}

export default router
