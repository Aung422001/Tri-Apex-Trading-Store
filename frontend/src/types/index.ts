export interface Product {
    id: string
    name: string
    slug: string
    shortDescription?: string
    description?: string
    price: number
    comparePrice?: number
    stock: number
    featured: boolean
    published: boolean
    printTechnology?: string
    buildVolume?: string
    resolution?: string
    connectivity?: string
    specs?: Record<string, any>
    images: ProductImage[]
    category?: Category
    brand?: Brand
    variants?: ProductVariant[]
    reviews?: Review[]
    averageRating?: number
    _count?: { reviews: number }
}

export interface ProductImage {
    id: string
    url: string
    alt?: string
    position: number
}

export interface ProductVariant {
    id: string
    name: string
    price: number
    stock: number
    color?: string
    size?: string
}

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    image?: string
    _count?: { products: number }
}

export interface Brand {
    id: string
    name: string
    slug: string
    logo?: string
    _count?: { products: number }
}

export interface Review {
    id: string
    rating: number
    title?: string
    comment?: string
    verified: boolean
    user: { id: string; name: string; avatar?: string }
    createdAt: string
}

export interface CartItem {
    id: string
    quantity: number
    product: Product
    variant?: ProductVariant
}

export interface Cart {
    id: string
    items: CartItem[]
}

export interface Order {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    subtotal: number
    shippingCost: number
    discount: number
    total: number
    trackingNumber?: string
    items: OrderItem[]
    address: Address
    createdAt: string
}

export interface OrderItem {
    id: string
    quantity: number
    price: number
    total: number
    product: { id: string; name: string; slug: string; images?: ProductImage[] }
    variant?: { id: string; name: string }
}

export interface Address {
    id: string
    label?: string
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
}

export interface User {
    id: string
    name: string
    email: string
    role: string
    phone?: string
    avatar?: string
    createdAt: string
}

export interface ApiResponse<T> {
    success: boolean
    data: T
    meta?: { pagination?: Pagination }
    error?: string
}

export interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
}
