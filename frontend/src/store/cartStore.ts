import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import type { CartItem } from '@/types'

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    isLoading: boolean
    toggleDrawer: () => void
    openDrawer: () => void
    closeDrawer: () => void
    setItems: (items: CartItem[]) => void
    fetchCart: () => Promise<void>
    addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    clearCart: () => Promise<void>
    clearCartLocally: () => void
    totalItems: () => number
    subtotal: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            isLoading: false,

            toggleDrawer: () => set((s) => ({ isOpen: !s.isOpen })),
            openDrawer: () => set({ isOpen: true }),
            closeDrawer: () => set({ isOpen: false }),

            setItems: (items) => set({ items }),

            // Clear cart from local state only (used on logout)
            clearCartLocally: () => set({ items: [], isOpen: false }),

            fetchCart: async () => {
                try {
                    set({ isLoading: true })
                    const { data } = await api.get('/cart')
                    if (data.success) set({ items: data.data.items || [] })
                } catch (err: any) {
                    // If unauthenticated, clear local stale cart silently
                    if (err.response?.status === 401) {
                        set({ items: [] })
                    }
                } finally {
                    set({ isLoading: false })
                }
            },

            addItem: async (productId, quantity = 1, variantId) => {
                try {
                    const { data } = await api.post('/cart/items', { productId, quantity, variantId })
                    if (data.success) {
                        set({ items: data.data.items || [], isOpen: true })
                    }
                } catch (err: any) {
                    throw new Error(err.response?.data?.error || 'Failed to add item')
                }
            },

            updateQuantity: async (itemId, quantity) => {
                // If quantity is 0 or less, remove the item
                if (quantity <= 0) {
                    return get().removeItem(itemId)
                }
                // Optimistic update for instant UI feedback
                set((s) => ({
                    items: s.items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ),
                }))
                try {
                    await api.put(`/cart/items/${itemId}`, { quantity })
                } catch (err: any) {
                    // Revert on failure by re-fetching
                    await get().fetchCart()
                }
            },

            removeItem: async (itemId) => {
                // Optimistic remove for instant UI feedback
                set((s) => ({ items: s.items.filter((i) => i.id !== itemId) }))
                try {
                    await api.delete(`/cart/items/${itemId}`)
                } catch (err: any) {
                    // Revert on failure by refetching
                    await get().fetchCart()
                }
            },

            clearCart: async () => {
                try {
                    await api.delete('/cart')
                    set({ items: [] })
                } catch {
                    // error
                }
            },

            totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: () =>
                get().items.reduce((sum, item) => {
                    const price = item.variant?.price ?? item.product.price
                    return sum + price * item.quantity
                }, 0),
        }),
        { name: 'triapex-cart', partialize: (state) => ({ items: state.items }) }
    )
)
