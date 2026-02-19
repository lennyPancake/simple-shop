import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // массив товаров в корзине
  const items = ref<CartItem[]>([])

  // общая сумма заказа
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })
  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  const addToCart = (product: Product) => {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((i) => i.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  return { items, totalPrice, totalCount, addToCart, removeFromCart, updateQuantity }
})
