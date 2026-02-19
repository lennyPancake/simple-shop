<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { supabase } from '@/lib/supabase'

const store = useProductsStore()
const cartStore = useCartStore()

onMounted(() => {
  store.loadProducts()

  /* async function testSupabase() {
    // Проверим подключение: попробуем получить первые 5 продуктов
    const row: any = {
      title: 'TEST',
      price: 121,
      description: 'TEST2',
      image: 'TEST3',
    }
    const { data, error } = await supabase
      .from('products')
      .update(row)
      .eq('id', 1)
      .select('*, categories(name)')
      .single()
    const { data, error } = await supabase.from('products').select('*, categories(name)')
    if (error) {
      console.error('Supabase error:', error)
      alert('Ошибка: ' + error.message)

      return
    }
  } */
  //testSupabase()
})
</script>

<template>
  <main class="home">
    <section class="home-hero">
      <h1 class="home-title">Каталог</h1>
      <p class="home-subtitle">Откройте для себя нашу отобранную коллекцию товаров</p>
    </section>

    <div class="home-toolbar">
      <SearchBar v-model="store.searchQuery" />
      <span class="product-count">{{ store.filteredProducts.length }} продукты</span>
    </div>

    <CategoryFilter
      :categories="store.categories"
      :selected="store.selectedCategory"
      @update:selected="store.selectedCategory = $event"
    />

    <LoadingSkeleton v-if="store.isLoading" />

    <div v-else-if="store.filteredProducts.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
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
      <h2>Ничего не найдено</h2>
      <p>Попробуйте изменить параметры поиска или фильтра</p>
    </div>

    <div v-else class="products-grid">
      <ProductCard
        v-for="(product, index) in store.filteredProducts"
        :key="product.id"
        :product="product"
        :index="index"
        @add-to-cart="cartStore.addToCart"
      />
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-hero {
  padding: 8px 0 0;
}

.home-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.home-subtitle {
  color: var(--text-secondary);
  font-size: 15px;
  margin-top: 4px;
}

.home-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.product-count {
  font-size: 13px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: var(--text-tertiary);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.empty-state p {
  font-size: 14px;
}

@media (max-width: 640px) {
  .home-title {
    font-size: 22px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .home-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .product-count {
    text-align: right;
  }
}
</style>
