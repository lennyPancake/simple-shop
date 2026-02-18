import { defineStore } from 'pinia'
import { ref } from 'vue'

const ADMIN_PIN = 'admin'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(localStorage.getItem('admin_auth') === 'true')

  const login = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      isAuthenticated.value = true
      localStorage.setItem('admin_auth', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    localStorage.removeItem('admin_auth')
  }

  return { isAuthenticated, login, logout }
})
