<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { RouterLink } from 'vue-router'

const cartStore = useCartStore()
</script>

<template>
  <main class="cart">
    <div class="cart-header">
      <h1 class="cart-title">Your Cart</h1>
      <RouterLink to="/" class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Continue shopping
      </RouterLink>
    </div>

    <div v-if="cartStore.items.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <h2>Your cart is empty</h2>
      <p>Browse our catalog and find something you like</p>
      <RouterLink to="/" class="browse-btn">Browse catalog</RouterLink>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <TransitionGroup name="cart-item">
          <article v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <div class="item-image-wrapper">
              <img :src="item.image" :alt="item.title" class="item-image" />
            </div>
            <div class="item-info">
              <h3 class="item-title">{{ item.title }}</h3>
              <span class="item-category">{{ item.category }}</span>
              <span class="item-price">${{ item.price.toFixed(2) }}</span>
            </div>
            <div class="item-controls">
              <div class="quantity-control">
                <button
                  class="qty-btn"
                  @click="cartStore.updateQuantity(item.id, Math.max(1, item.quantity - 1))"
                  :disabled="item.quantity <= 1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button class="qty-btn" @click="cartStore.updateQuantity(item.id, item.quantity + 1)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
              <span class="item-subtotal">${{ (item.price * item.quantity).toFixed(2) }}</span>
              <button class="remove-btn" @click="cartStore.removeFromCart(item.id)" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </article>
        </TransitionGroup>
      </div>

      <aside class="cart-summary">
        <h2 class="summary-title">Order Summary</h2>
        <div class="summary-row">
          <span>Items ({{ cartStore.totalCount }})</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span class="free-badge">Free</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row summary-total">
          <span>Total</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <button class="checkout-btn">
          Checkout
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.cart {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.cart-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--text-primary);
}

/* Empty State */
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
  margin-bottom: 20px;
  opacity: 0.4;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 14px;
  margin-bottom: 24px;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  background: var(--text-primary);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  transition: opacity var(--transition-fast);
}

.browse-btn:hover {
  opacity: 0.9;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}

/* Cart Items */
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  margin-bottom: 12px;
  transition: all var(--transition-normal);
}

.item-image-wrapper {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  background: #ffffff;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.item-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-category {
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: capitalize;
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* Quantity */
.quantity-control {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-default);
}

.qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 32px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.item-subtotal {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 70px;
  text-align: right;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: all var(--transition-fast);
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--danger);
}

/* Summary */
.cart-summary {
  position: sticky;
  top: 24px;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-secondary);
}

.free-badge {
  color: var(--success);
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: var(--border-default);
}

.summary-total {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: var(--text-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  transition: opacity var(--transition-fast);
  margin-top: 4px;
}

.checkout-btn:hover {
  opacity: 0.9;
}

/* Cart item transitions */
.cart-item-move,
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from,
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-leave-active {
  position: absolute;
  width: 100%;
}

@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-title {
    font-size: 22px;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 12px;
  }

  .item-controls {
    width: 100%;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }
}
</style>
