import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import type { User } from '@/types'

interface AuthStore {
    user: User | null
    accessToken: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    fetchUser: () => Promise<void>
    setAuth: (user: User, token: string) => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isLoading: false,

            login: async (email, password) => {
                const { data } = await api.post('/auth/login', { email, password })
                if (data.success) {
                    localStorage.setItem('accessToken', data.data.accessToken)
                    set({ user: data.data.user, accessToken: data.data.accessToken })
                } else {
                    throw new Error(data.error || 'Login failed')
                }
            },

            register: async (name, email, password) => {
                const { data } = await api.post('/auth/register', { name, email, password })
                if (data.success) {
                    localStorage.setItem('accessToken', data.data.accessToken)
                    set({ user: data.data.user, accessToken: data.data.accessToken })
                } else {
                    throw new Error(data.error || 'Registration failed')
                }
            },

            logout: async () => {
                try { await api.post('/auth/logout') } catch { }
                localStorage.removeItem('accessToken')
                set({ user: null, accessToken: null })
            },

            fetchUser: async () => {
                try {
                    set({ isLoading: true })
                    const { data } = await api.get('/auth/me')
                    if (data.success) set({ user: data.data })
                } catch {
                    set({ user: null, accessToken: null })
                    localStorage.removeItem('accessToken')
                } finally {
                    set({ isLoading: false })
                }
            },

            setAuth: (user, token) => {
                localStorage.setItem('accessToken', token)
                set({ user, accessToken: token })
            },
        }),
        {
            name: 'triapex-auth',
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
        }
    )
)
