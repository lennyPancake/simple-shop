<script setup lang="ts">
defineProps<{
  rating: number
}>()
</script>

<template>
  <div class="star-rating" :aria-label="`Rating: ${rating} out of 5`">
    <div class="stars-container">
      <div class="stars-bg">
        <svg v-for="i in 5" :key="'bg-' + i" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <div class="stars-fg" :style="{ width: `${(rating / 5) * 100}%` }">
        <svg v-for="i in 5" :key="'fg-' + i" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
    </div>
    <span class="rating-value">{{ rating }}</span>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars-container {
  position: relative;
  display: flex;
  align-items: center;
}

.stars-bg {
  display: flex;
  gap: 1px;
  color: var(--border-hover);
}

.stars-fg {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 1px;
  overflow: hidden;
  color: var(--star);
  white-space: nowrap;
}

.rating-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}
</style>
