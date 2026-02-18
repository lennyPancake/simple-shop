import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // Состояние: массив товаров в корзине
  const items = ref<CartItem[]>([])

  // Геттер: общая сумма заказа
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  // Геттер: общее количество товаров (для бейджа в шапке)
  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // Действие: добавить товар
  const addToCart = (product: Product) => {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      // Если товар уже есть, увеличиваем количество
      existingItem.quantity++
    } else {
      // Если нет, добавляем новый
      items.value.push({ ...product, quantity: 1 })
    }
  }

  // Действие: удалить товар
  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  // Действие: изменить количество
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((i) => i.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  return { items, totalPrice, totalCount, addToCart, removeFromCart, updateQuantity }
})
