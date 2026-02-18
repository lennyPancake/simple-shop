<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AdminSidebar from './AdminSidebar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="admin-layout">
    <!-- Mobile topbar -->
    <div class="mobile-topbar">
      <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="mobile-title">SABY Admin</span>
    </div>

    <!-- Overlay for mobile -->
    <Transition name="overlay">
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <div class="sidebar-wrapper" :class="{ 'sidebar-wrapper--open': sidebarOpen }">
      <AdminSidebar @click="sidebarOpen = false" />
    </div>

    <!-- Main content -->
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  margin: -24px -24px 0;
}

.mobile-topbar {
  display: none;
}

.sidebar-overlay {
  display: none;
}

.sidebar-wrapper {
  flex-shrink: 0;
}

.admin-main {
  flex: 1;
  min-width: 0;
  padding: 32px;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .mobile-topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border-default);
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
  }

  .mobile-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 40;
  }

  .sidebar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
  }

  .sidebar-wrapper--open {
    transform: translateX(0);
  }

  .admin-main {
    padding: 20px 16px;
  }
}

/* Overlay transition */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--transition-normal);
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
