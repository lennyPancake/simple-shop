<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import StarRating from '@/components/StarRating.vue'

const props = defineProps<{
  product: Product
  index: number
}>()

const emit = defineEmits<{
  addToCart: [product: Product]
}>()

const isAdded = ref(false)

function handleAdd() {
  emit('addToCart', props.product)
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 1200)
}
</script>

<template>
  <article
    class="product-card fade-in"
    :style="{ animationDelay: `${index * 50}ms` }"
  >
    <div class="card-image-wrapper">
      <img :src="product.image" :alt="product.title" class="card-image" loading="lazy" />
      <span class="card-category">{{ product.category }}</span>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ product.title }}</h3>

      <div class="card-meta">
        <StarRating :rating="product.rating.rate" />
        <span class="card-reviews">{{ product.rating.count }} reviews</span>
      </div>

      <div class="card-footer">
        <span class="card-price">${{ product.price.toFixed(2) }}</span>
        <button
          class="add-btn"
          :class="{ 'add-btn--added': isAdded }"
          @click="handleAdd"
          :disabled="isAdded"
        >
          <svg v-if="!isAdded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ isAdded ? 'Added' : 'Add to cart' }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
  opacity: 0;
}

.product-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.card-image-wrapper {
  position: relative;
  background: #ffffff;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  overflow: hidden;
}

.card-image {
  max-height: 160px;
  max-width: 100%;
  object-fit: contain;
  transition: transform var(--transition-normal);
}

.product-card:hover .card-image {
  transform: scale(1.05);
}

.card-category {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--bg-root);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: capitalize;
  letter-spacing: 0.02em;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-reviews {
  font-size: 12px;
  color: var(--text-tertiary);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--success);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.add-btn:hover:not(:disabled) {
  background: var(--success-hover);
  transform: scale(1.03);
}

.add-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.add-btn--added {
  background: var(--accent);
  pointer-events: none;
}

@media (max-width: 640px) {
  .card-image-wrapper {
    height: 160px;
    padding: 16px;
  }

  .card-body {
    padding: 12px;
  }
}
</style>
