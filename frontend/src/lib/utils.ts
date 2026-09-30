import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
    return `MMK ${price.toLocaleString('en-MM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}

/** Turn an axios error into a message a customer can act on. */
export function apiErrorMessage(err: any, fallback: string): string {
    // No response at all: DNS failure, CORS block, or the API is asleep/down.
    if (err?.isAxiosError && !err.response) {
        return 'Cannot reach the server. Please try again in a minute.'
    }
    const data = err?.response?.data
    // Zod validation errors from the validate() middleware carry the real reason in details.
    if (Array.isArray(data?.details) && data.details[0]?.message) {
        return data.details[0].message
    }
    // Errors thrown by the stores themselves (not axios) carry their own message.
    return data?.error || (!err?.isAxiosError && err?.message) || fallback
}
