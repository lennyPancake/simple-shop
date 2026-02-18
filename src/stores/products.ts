import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFormData } from '@/types'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
} from '@/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<string[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const selectedCategory = ref('')

  const filteredProducts = computed(() => {
    let result = products.value

    if (selectedCategory.value) {
      result = result.filter((p) => p.category === selectedCategory.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    return result
  })

  const loadProducts = async () => {
    isLoading.value = true
    console.log('скачал продукты и категории')
    try {
      const [productsData, categoriesData] = await Promise.all([fetchProducts(), fetchCategories()])
      products.value = productsData
      categories.value = categoriesData
      console.log(categories.value)
      console.log(products.value)
    } catch (e) {
      console.error('Error loading products', e)
    } finally {
      isLoading.value = false
    }
  }

  const getProductById = (id: number): Product | undefined => {
    return products.value.find((p) => p.id === id)
  }

  const addProduct = async (data: ProductFormData) => {
    try {
      const created = await createProduct(data)
      products.value.unshift(created)
      if (created.category && !categories.value.includes(created.category)) {
        categories.value.push(created.category)
      }
      return created
    } catch (e) {
      console.error('Create product failed', e)
      throw e
    }
  }

  const updateProduct = async (id: number, data: ProductFormData) => {
    try {
      console.log('send updated apiupdateproduct id data')
      const updated = await apiUpdateProduct(id, data)
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) products.value[index] = updated

      if (updated.category && !categories.value.includes(updated.category)) {
        categories.value.push(updated.category)
      }

      return updated
    } catch (e) {
      console.error('Update product failed', e)
      throw e
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      await apiDeleteProduct(id)
      products.value = products.value.filter((p) => p.id !== id)
    } catch (e) {
      console.error('Delete product failed', e)
      throw e
    }
  }

  return {
    products,
    categories,
    isLoading,
    searchQuery,
    selectedCategory,
    filteredProducts,
    loadProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  }
})
