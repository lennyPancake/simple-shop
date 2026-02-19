<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { RouterLink, useRoute } from 'vue-router'

const cartStore = useCartStore()
const route = useRoute()
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      <span class="logo-text">Simple Shop</span>
    </RouterLink>

    <nav class="nav">
      <RouterLink to="/" class="nav-link" :class="{ 'nav-link--active': route.name === 'home' }">
        Каталог
      </RouterLink>
      <RouterLink
        to="/cart"
        class="nav-link cart-link"
        :class="{ 'nav-link--active': route.name === 'cart' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span>Корзина</span>
        <Transition name="badge">
          <span v-if="cartStore.totalCount > 0" class="badge">
            {{ cartStore.totalCount }}
          </span>
        </Transition>
      </RouterLink>
      <RouterLink
        to="/admin"
        class="nav-link admin-link"
        :class="{ 'nav-link--active': route.path.startsWith('/admin') }"
      >
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
          <path
            d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z"
          />
        </svg>
        <span>Admin</span>
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-default);
  margin-bottom: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.logo:hover {
  opacity: 0.8;
}

.logo svg {
  color: var(--accent);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-link--active {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.cart-link {
  position: relative;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--accent);
  color: white;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

/* Badge transition */
.badge-enter-active,
.badge-leave-active {
  transition: all 0.2s ease;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.admin-link {
  opacity: 0.6;
  font-size: 13px;
}

.admin-link:hover,
.admin-link.nav-link--active {
  opacity: 1;
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .nav-link span {
    display: none;
  }
}
</style>
