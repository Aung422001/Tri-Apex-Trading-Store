'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AddProductPage() {
    const user = useAuthStore((s) => s.user)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        price: '',
        stock: '10',
        printTechnology: '',
        buildVolume: '',
    })

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center card p-8">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-4">You need admin permissions to access this page.</p>
                    <Link href="/login" className="btn-primary">Sign In as Admin</Link>
                </div>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            }

            const { data } = await api.post('/products', dataToSubmit)

            if (data.success) {
                toast.success('Product created successfully!')
                router.push('/admin') // Redirect back to admin dashboard
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">Add New Product</h1>
                </div>

                <div className="card p-6 md:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g., Bambu Lab X1 Carbon"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Price (MMK) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Initial Stock *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    required
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Short Description</label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Brief overview for product cards"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Full Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input-field resize-none"
                                    placeholder="Detailed product information..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Print Technology</label>
                                <select
                                    name="printTechnology"
                                    value={formData.printTechnology}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">Select Technology</option>
                                    <option value="FDM">FDM</option>
                                    <option value="SLA">SLA</option>
                                    <option value="SLS">SLS</option>
                                    <option value="DLP">DLP</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Build Volume</label>
                                <input
                                    type="text"
                                    name="buildVolume"
                                    value={formData.buildVolume}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g., 250 x 210 x 220mm"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <Link href="/admin" className="btn-outline">Cancel</Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
