<template>
  <button class="cart-icon-btn" @click="$emit('click')" aria-label="Open cart">
    <span class="cart-icon">🛒</span>
    <span v-if="count > 0" class="cart-badge" data-testid="cart-badge">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ count: number }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.cart-icon-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
  color: white;
}

.cart-icon-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.cart-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.cart-badge {
  background: #ff4757;
  color: white;
  border-radius: 50%;
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0 4px;
}
</style>
