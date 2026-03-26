<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isOpen" class="cart-overlay" @click.self="$emit('close')" data-testid="cart-overlay" />
    </Transition>
    <Transition name="drawer">
      <aside v-if="isOpen" class="cart-drawer" data-testid="cart-drawer" role="dialog" aria-label="Shopping cart">
        <div class="cart-header">
          <h2 class="cart-title">🛒 Your Cart <span class="item-count">({{ cartItems.length }})</span></h2>
          <button class="close-btn" @click="$emit('close')" aria-label="Close cart">✕</button>
        </div>

        <div class="cart-body">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p class="empty-icon">🎵</p>
            <p>Your cart is empty</p>
            <p class="empty-hint">Add some albums to get started!</p>
          </div>
          <div v-else class="cart-items-list">
            <CartItem
              v-for="item in cartItems"
              :key="item.album.id"
              :album="item.album"
              @remove="$emit('removeItem', $event)"
            />
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <span class="total-price" data-testid="cart-total">${{ cartTotal.toFixed(2) }}</span>
          </div>
          <button class="clear-btn" @click="$emit('clearCart')">Clear Cart</button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CartItem as CartItemType } from '../types/album'
import CartItem from './CartItem.vue'

defineProps<{
  isOpen: boolean
  cartItems: CartItemType[]
  cartTotal: number
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'removeItem', albumId: number): void
  (e: 'clearCart'): void
}>()
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 380px;
  max-width: 100vw;
  background: white;
  z-index: 101;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cart-title {
  margin: 0;
  font-size: 1.25rem;
}

.item-count {
  font-size: 1rem;
  opacity: 0.85;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 1.5rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.cart-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.total-price {
  color: #667eea;
  font-size: 1.3rem;
}

.clear-btn {
  width: 100%;
  padding: 0.7rem;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #fee;
  color: #e74c3c;
}

/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Drawer transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .cart-drawer {
    width: 100vw;
  }
}
</style>
