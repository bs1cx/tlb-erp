import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.js'
import router from './router.js'

// Import global styles
import './assets/css/main.css'

// Create Pinia store
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// Uygulama balangç kontrolü
async function initializeApp() {
  try {
    console.log(' TLB ERP Multi-Company App Starting...')
    
    // Auth servisini balat
    const { authService } = await import('./services/authService.js')
    
    // Demo data kontrolü (istee bal - ilk kurulum için)
    // await authService.initializeDemoData()
    
    console.log(' TLB ERP App Started Successfully!')
    console.log(' Features: Real-time Supabase integration, Company-based authentication')
    console.log(' Security: Row Level Security, Role-based access control')
    
  } catch (error) {
    console.error(' App initialization failed:', error)
  }
}

initializeApp()
