<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import StatCard from '@/components/admin/StatCard.vue'

const store = useProductsStore()

onMounted(() => {
  if (store.products.length === 0) {
    store.loadProducts()
  }
})

const totalProducts = computed(() => store.products.length)
const totalCategories = computed(() => store.categories.length)
const avgPrice = computed(() => {
  if (store.products.length === 0) return '0.00'
  const sum = store.products.reduce((acc, p) => acc + p.price, 0)
  return (sum / store.products.length).toFixed(2)
})
const avgRating = computed(() => {
  if (store.products.length === 0) return '0.0'
  const sum = store.products.reduce((acc, p) => acc + p.rating.rate, 0)
  return (sum / store.products.length).toFixed(1)
})
const recentProducts = computed(() => store.products.slice(0, 5))
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Админ-панель</h1>
        <p class="dashboard-subtitle">Обзор всех продуктов</p>
      </div>
      <RouterLink to="/admin/products/new" class="add-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Добавить продукт
      </RouterLink>
    </div>

    <!-- Stats -->
    <div class="stats-grid" v-if="!store.isLoading">
      <StatCard :value="totalProducts" label="Total Products">
        <template #icon>
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
        </template>
      </StatCard>
      <StatCard :value="totalCategories" label="Categories">
        <template #icon>
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
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </template>
      </StatCard>
      <StatCard :value="'$' + avgPrice" label="Avg Price">
        <template #icon>
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
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </template>
      </StatCard>
      <StatCard :value="avgRating" label="Avg Rating">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="var(--star)"
            stroke="var(--star)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- Loading state -->
    <div v-if="store.isLoading" class="stats-grid">
      <div v-for="i in 4" :key="i" class="skeleton stat-skeleton" />
    </div>

    <!-- Recent Products Table -->
    <section class="table-section">
      <div class="table-header">
        <h2 class="table-title">Recent Products</h2>
        <RouterLink to="/admin/products" class="view-all">
          View all
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
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </RouterLink>
      </div>

      <div v-if="store.isLoading" class="table-loading">
        <div v-for="i in 5" :key="i" class="skeleton table-row-skeleton" />
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Продукт</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Рейтинг</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in recentProducts" :key="product.id">
              <td>
                <div class="product-cell">
                  <div class="product-thumb">
                    <img :src="product.image" :alt="product.title" />
                  </div>
                  <span class="product-name">{{ product.title }}</span>
                </div>
              </td>
              <td>
                <span class="category-badge">{{ product.category }}</span>
              </td>
              <td class="price-cell">${{ product.price.toFixed(2) }}</td>
              <td class="rating-cell">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="var(--star)"
                  stroke="var(--star)"
                  stroke-width="2"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                {{ product.rating.rate }}
              </td>
              <td>
                <RouterLink :to="`/admin/products/${product.id}/edit`" class="action-link">
                  Edit
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: fadeInUp 0.4s ease-out;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.dashboard-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.dashboard-subtitle {
  font-size: 14px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--accent);
  color: white;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: background var(--transition-fast);
  text-decoration: none;
}

.add-btn:hover {
  background: var(--accent-hover);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.stat-skeleton {
  height: 84px;
}

/* Table */
.table-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.view-all:hover {
  opacity: 0.8;
}

.table-loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.table-row-skeleton {
  height: 52px;
}

.table-wrapper {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-default);
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: var(--bg-elevated);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-thumb {
  width: 36px;
  height: 36px;
  background: #ffffff;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  flex-shrink: 0;
}

.product-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-name {
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.category-badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--bg-elevated);
  border-radius: 100px;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.price-cell {
  font-weight: 600;
  color: var(--text-primary);
}

.rating-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-link {
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.action-link:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .dashboard-title {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
