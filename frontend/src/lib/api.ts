import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config

        // Prevent infinite loops if the refresh or logout endpoints themselves fail
        if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/logout') || originalRequest.url?.includes('/auth/login')) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const { data } = await api.post('/auth/refresh')
                if (data.success && (data.accessToken || data.data?.accessToken)) {
                    const newToken = data.accessToken || data.data.accessToken
                    localStorage.setItem('accessToken', newToken)
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // Clear state
                localStorage.removeItem('accessToken')

                // Attempt to notify backend to clear cookie, but don't await/block on it
                api.post('/auth/logout').catch(() => { })

                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

// Turns an axios error into a message a customer can act on. Validation errors
// carry the real reason in `details`; with no response at all the API was
// unreachable (wrong NEXT_PUBLIC_API_URL, CORS, or a sleeping free instance).
export function apiErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (Array.isArray(data?.details) && data.details.length) {
        return data.details.map((d: { message: string }) => d.message).join('. ')
    }
    if (data?.error) return data.error
    if (err?.response && err.response.status >= 500) {
        return 'The server is starting up or unavailable. Please try again in a minute.'
    }
    if (err?.request && !err?.response) {
        return "Can't reach the server. Check your connection and try again in a minute."
    }
    if (!err?.isAxiosError && err?.message) return err.message
    return fallback
}

export default api
