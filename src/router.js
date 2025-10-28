import { createRouter, createWebHistory } from 'vue-router'

// Import components directly to avoid file issues
const Login = {
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>TLB ERP</h1>
        <form @submit.prevent="login">
          <input v-model="username" placeholder="Username" value="admin">
          <input v-model="password" type="password" placeholder="Password" value="admin123">
          <button type="submit">Login</button>
          <p v-if="error" style="color: red">{{ error }}</p>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      username: 'admin',
      password: 'admin123',
      error: ''
    }
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === 'admin123') {
        localStorage.setItem('tlb_user', JSON.stringify({
          username: this.username,
          fullName: 'System Administrator',
          role: 'admin'
        }))
        this.$router.push('/')
      } else {
        this.error = 'Invalid credentials'
      }
    }
  }
}

const Dashboard = {
  template: `
    <div style="padding: 20px;">
      <h1>Dashboard</h1>
      <p>Welcome to TLB ERP!</p>
      <button @click="logout">Logout</button>
    </div>
  `,
  methods: {
    logout() {
      localStorage.removeItem('tlb_user')
      this.$router.push('/login')
    }
  },
  mounted() {
    if (!localStorage.getItem('tlb_user')) {
      this.$router.push('/login')
    }
  }
}

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Dashboard }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
