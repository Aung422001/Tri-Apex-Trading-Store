import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import type { CartItem } from '@/types'

interface CartStore {
    items: CartItem[]
    isOpen: boolean
    isLoading: boolean
    toggleDrawer: () => void
    setItems: (items: CartItem[]) => void
    fetchCart: () => Promise<void>
    addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    clearCart: () => Promise<void>
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

            setItems: (items) => set({ items }),

            fetchCart: async () => {
                try {
                    set({ isLoading: true })
                    const { data } = await api.get('/cart')
                    if (data.success) set({ items: data.data.items || [] })
                } catch {
                    // Not logged in or error
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
                try {
                    await api.put(`/cart/items/${itemId}`, { quantity })
                    await get().fetchCart()
                } catch {
                    // error
                }
            },

            removeItem: async (itemId) => {
                try {
                    await api.delete(`/cart/items/${itemId}`)
                    set((s) => ({ items: s.items.filter((i) => i.id !== itemId) }))
                } catch {
                    // error
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
            subtotal: () => get().items.reduce((sum, item) => {
                const price = item.variant?.price ?? item.product.price
                return sum + price * item.quantity
            }, 0),
        }),
        { name: 'triapex-cart', partialize: (state) => ({ items: state.items }) }
    )
)
