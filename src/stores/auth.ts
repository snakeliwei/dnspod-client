import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    secret: ''
  }),
  
  getters: {
    isLoggedIn: (state) => {
      return !!state.token && !!state.secret
    }
  },
  
  actions: {
    setToken(newToken) {
      this.token = newToken
    },
    
    setSecret(newSecret) {
      this.secret = newSecret
    },
    
    login(newToken, newSecret) {
      this.setToken(newToken)
      this.setSecret(newSecret)
    }
  }
})