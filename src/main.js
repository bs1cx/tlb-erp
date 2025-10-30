import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.js'

// Import global styles
import './assets/css/main.css'

// Create Pinia store
const pinia = createPinia()

// Create and mount the app
const app = createApp(App)
app.use(pinia)
app.mount('#app')

console.log(' TLB ERP Multi-Company App Started Successfully!')
console.log(' Features: Company-based authentication, Plan-based access control')
console.log(' Demo Companies: ABC123 (Enterprise), DEF456 (Premium)')
