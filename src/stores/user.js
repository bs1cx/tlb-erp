import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false
  }),

  actions: {
    setUser(user) {
      this.currentUser = user
      this.isAuthenticated = true
    },

    logout() {
      this.currentUser = null
      this.isAuthenticated = false
    }
  }
})
