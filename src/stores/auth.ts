import { defineStore } from 'pinia'

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
    setToken(newToken: string) {
      this.token = newToken
    },
    
    setSecret(newSecret: string) {
      this.secret = newSecret
    },
    
    login(newToken: string, newSecret: string) {
      this.setToken(newToken)
      this.setSecret(newSecret)
    }
  }
})