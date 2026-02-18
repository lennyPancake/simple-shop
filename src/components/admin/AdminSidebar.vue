<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const handleLogout = () => {
  adminStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <RouterLink to="/admin" class="sidebar-logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
        <span>Simple Admin</span>
      </RouterLink>

      <nav class="sidebar-nav">
        <RouterLink
          to="/admin"
          class="nav-item"
          :class="{ 'nav-item--active': route.name === 'admin-dashboard' }"
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
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink
          to="/admin/products"
          class="nav-item"
          :class="{ 'nav-item--active': route.path.startsWith('/admin/products') }"
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
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Products</span>
        </RouterLink>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <RouterLink to="/" class="nav-item nav-item--muted">
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
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>Back to store</span>
      </RouterLink>
      <button class="nav-item nav-item--muted logout-btn" @click="handleLogout">
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
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>Log out</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 12px;
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.sidebar-logo svg {
  color: var(--accent);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.nav-item:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-item--active {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-item--active svg {
  color: var(--accent);
}

.nav-item--muted {
  color: var(--text-tertiary);
  font-size: 13px;
}

.nav-item--muted:hover {
  color: var(--text-secondary);
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--border-default);
  padding-top: 12px;
}

.logout-btn {
  font-family: inherit;
}
</style>
