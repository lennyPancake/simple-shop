<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px;
  min-height: 100vh;
}

@media (max-width: 640px) {
  .app {
    padding: 0 16px 32px;
  }
}
</style>
