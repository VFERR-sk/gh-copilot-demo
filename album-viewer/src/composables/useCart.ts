import { ref, computed } from 'vue'
import type { Album, CartItem } from '../types/album'

const CART_STORAGE_KEY = 'album-viewer-cart'

const cartItems = ref<CartItem[]>(loadFromStorage())

function loadFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as CartItem[]
      return parsed.map((item) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }))
    }
  } catch {
    // ignore
  }
  return []
}

function saveToStorage(): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch {
    // ignore
  }
}

export function useCart() {
  const cartCount = computed(() => cartItems.value.length)

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.album.price, 0)
  )

  function isInCart(albumId: number): boolean {
    return cartItems.value.some((item) => item.album.id === albumId)
  }

  function addToCart(album: Album): void {
    if (isInCart(album.id)) return
    cartItems.value = [...cartItems.value, { album, addedAt: new Date() }]
    saveToStorage()
  }

  function removeFromCart(albumId: number): void {
    cartItems.value = cartItems.value.filter((item) => item.album.id !== albumId)
    saveToStorage()
  }

  function clearCart(): void {
    cartItems.value = []
    saveToStorage()
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    isInCart,
    addToCart,
    removeFromCart,
    clearCart,
  }
}
