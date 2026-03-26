<template>
  <div class="cart-item">
    <img
      :src="album.image_url"
      :alt="album.title"
      class="cart-item-img"
      @error="handleImageError"
    />
    <div class="cart-item-info">
      <p class="cart-item-title">{{ album.title }}</p>
      <p class="cart-item-artist">{{ album.artist }}</p>
      <p class="cart-item-price">${{ album.price.toFixed(2) }}</p>
    </div>
    <button class="remove-btn" @click="$emit('remove', album.id)" aria-label="Remove from cart">
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Album } from '../types/album'

defineProps<{ album: Album }>()
defineEmits<{ (e: 'remove', id: number): void }>()

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/60x60/667eea/white?text=♪'
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  font-weight: 600;
  color: #333;
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-artist {
  color: #666;
  margin: 0 0 0.2rem;
  font-size: 0.85rem;
}

.cart-item-price {
  color: #667eea;
  font-weight: 700;
  margin: 0;
  font-size: 0.9rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #fee;
  color: #e74c3c;
}
</style>
