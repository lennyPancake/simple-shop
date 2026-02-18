<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'

const store = useProductsStore()

onMounted(() => {
  if (store.products.length === 0) {
    store.loadProducts()
  }
})

const search = ref('')
const sortField = ref<'title' | 'price' | 'rating'>('title')
const sortDir = ref<'asc' | 'desc'>('asc')

const deleteTarget = ref<number | null>(null)
const showDeleteDialog = ref(false)

const filteredSorted = computed(() => {
  let result = store.products

  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    )
  }

  return [...result].sort((a, b) => {
    let cmp = 0
    if (sortField.value === 'title') {
      cmp = a.title.localeCompare(b.title)
    } else if (sortField.value === 'price') {
      cmp = a.price - b.price
    } else if (sortField.value === 'rating') {
      cmp = a.rating.rate - b.rating.rate
    }
    return sortDir.value === 'asc' ? cmp : -cmp
  })
})

const toggleSort = (field: 'title' | 'price' | 'rating') => {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
}

const confirmDelete = (id: number) => {
  deleteTarget.value = id
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (deleteTarget.value !== null) {
    try {
      await store.deleteProduct(deleteTarget.value)
    } catch (err: any) {
      console.error('Delete failed', err)
      alert('Не удалось удалить продукт: ' + (err?.message ?? err))
    }
  }
  showDeleteDialog.value = false
  deleteTarget.value = null
}
</script>

<template>
  <div class="products-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Products</h1>
        <p class="page-subtitle">{{ store.products.length }} products total</p>
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
        Add Product
      </RouterLink>
    </div>

    <!-- Search -->
    <div class="search-bar">
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
        class="search-icon"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        v-model="search"
        type="text"
        placeholder="Search by name or category..."
        class="search-input"
      />
      <button v-if="search" class="clear-btn" @click="search = ''">
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Table -->
    <div v-if="store.isLoading" class="table-loading">
      <div v-for="i in 8" :key="i" class="skeleton row-skeleton" />
    </div>

    <div v-else-if="filteredSorted.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
      <p>No products found</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 50px">ID</th>
            <th>
              <button class="sort-btn" @click="toggleSort('title')">
                Product
                <span v-if="sortField === 'title'" class="sort-arrow">{{
                  sortDir === 'asc' ? '\u2191' : '\u2193'
                }}</span>
              </button>
            </th>
            <th>Category</th>
            <th>
              <button class="sort-btn" @click="toggleSort('price')">
                Price
                <span v-if="sortField === 'price'" class="sort-arrow">{{
                  sortDir === 'asc' ? '\u2191' : '\u2193'
                }}</span>
              </button>
            </th>
            <th>
              <button class="sort-btn" @click="toggleSort('rating')">
                Rating
                <span v-if="sortField === 'rating'" class="sort-arrow">{{
                  sortDir === 'asc' ? '\u2191' : '\u2193'
                }}</span>
              </button>
            </th>
            <th style="width: 120px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredSorted" :key="product.id">
            <td class="id-cell">#{{ product.id }}</td>
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
              <div class="action-buttons">
                <RouterLink
                  :to="`/admin/products/${product.id}/edit`"
                  class="btn-icon btn-edit"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </RouterLink>
                <button
                  class="btn-icon btn-delete"
                  @click="confirmDelete(product.id)"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      title="Delete Product"
      message="This action cannot be undone. Are you sure you want to delete this product?"
      @confirm="handleDelete"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeInUp 0.4s ease-out;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.page-subtitle {
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

/* Search */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 14px 10px 40px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all var(--transition-fast);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

.clear-btn {
  position: absolute;
  left: 372px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  transition: color var(--transition-fast);
}

.clear-btn:hover {
  color: var(--text-primary);
}

/* Table */
.table-loading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row-skeleton {
  height: 52px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
  gap: 12px;
}

.empty-state svg {
  opacity: 0.4;
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
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: var(--bg-elevated);
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0;
  transition: color var(--transition-fast);
}

.sort-btn:hover {
  color: var(--text-secondary);
}

.sort-arrow {
  color: var(--accent);
  font-size: 13px;
}

.id-cell {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
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
  max-width: 260px;
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

.action-buttons {
  display: flex;
  gap: 6px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn-edit {
  color: var(--text-tertiary);
}

.btn-edit:hover {
  background: var(--accent-subtle);
  border-color: rgba(59, 130, 246, 0.2);
  color: var(--accent);
}

.btn-delete {
  color: var(--text-tertiary);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--danger);
}

@media (max-width: 640px) {
  .page-title {
    font-size: 22px;
  }

  .search-input {
    max-width: 100%;
  }

  .clear-btn {
    left: auto;
    right: 8px;
  }
}
</style>
