import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/user.js'

// Lazy-loaded components for better performance
const CompanyLogin = () => import('./modules/auth/login.js').then(m => m.default || m)
const AdminLogin = () => import('./modules/admin/auth/login.js').then(m => m.default || m)
const AdminDashboard = () => import('./modules/admin/dashboard/main.js').then(m => m.default || m)
const Dashboard = () => import('./modules/dashboard/main.js').then(m => m.default || m)
const Finance = () => import('./modules/finance/main.js').then(m => m.default || m)
const CRM = () => import('./modules/crm/main.js').then(m => m.default || m)
const HR = () => import('./modules/hr/main.js').then(m => m.default || m)
const Inventory = () => import('./modules/inventory/main.js').then(m => m.default || m)
const Reports = () => import('./modules/reports/main.js').then(m => m.default || m)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: CompanyLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
    meta: { requiresAuth: false, adminOnly: true }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true }
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
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Auth guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Load user from session if not loaded
  if (!userStore.isAuthenticated) {
    userStore.loadFromSession()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresModule = to.meta.module
  const adminOnly = to.matched.some(record => record.meta.adminOnly)

  if (requiresAuth && !userStore.isAuthenticated) {
    // Redirect to appropriate login
    if (adminOnly) {
      next('/admin/login')
    } else {
      next('/login')
    }
  } else if (requiresAuth && adminOnly && !userStore.isAdmin) {
    // Redirect to regular app if not admin
    next('/')
  } else if (requiresAuth && requiresModule && !userStore.canAccess(requiresModule)) {
    // Redirect to dashboard if user doesn't have access to the module
    next('/')
  } else {
    next()
  }
})

export default router
