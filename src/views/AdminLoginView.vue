<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const router = useRouter()

const pin = ref('')
const error = ref(false)
const isShaking = ref(false)

//redirect
if (adminStore.isAuthenticated) {
  router.replace({ name: 'admin-dashboard' })
}

const handleLogin = () => {
  error.value = false
  isShaking.value = false

  if (adminStore.login(pin.value)) {
    router.push({ name: 'admin-dashboard' })
  } else {
    error.value = true
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 500)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card" :class="{ shake: isShaking }">
      <div class="login-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1 class="login-title">Admin Panel</h1>
      <p class="login-subtitle">Введите пароль</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-wrapper">
          <input
            v-model="pin"
            type="password"
            placeholder="Access code"
            class="login-input"
            :class="{ 'login-input--error': error }"
            autocomplete="off"
            autofocus
          />
          <Transition name="error">
            <p v-if="error" class="error-text">Неверный пароль</p>
          </Transition>
        </div>
        <button type="submit" class="login-btn" :disabled="!pin.trim()">
          <span>Вход</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      <RouterLink to="/" class="back-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Вернуться в магазин</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: var(--bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: fadeInUp 0.4s ease-out;
}

.login-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--accent-subtle);
  border-radius: var(--radius-lg);
  color: var(--accent);
  margin-bottom: 8px;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-tertiary);
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.login-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all var(--transition-fast);
}

.login-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.login-input--error {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-text {
  font-size: 13px;
  color: var(--danger);
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: all var(--transition-fast);
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-tertiary);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--text-secondary);
}

/* Shake animation */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.shake {
  animation: shake 0.5s ease;
}

/* Error text transition */
.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
