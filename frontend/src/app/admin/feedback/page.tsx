'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { MessageSquare, Star, Search } from 'lucide-react'
import Link from 'next/link'

export default function AdminFeedbackPage() {
    const user = useAuthStore((s) => s.user)
    const [feedback, setFeedback] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchFeedback() {
            try {
                const { data } = await api.get('/feedback?limit=50')
                if (data.success) {
                    setFeedback(data.data)
                }
            } catch (err) { } finally { setLoading(false) }
        }
        if (user?.role === 'ADMIN') fetchFeedback()
    }, [user])

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

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-accent" />
                            Customer Feedback
                        </h1>
                        <p className="text-gray-500">Review feedback and ratings submitted by users</p>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400">Loading feedback...</div>
                    ) : feedback.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400">No feedback entries found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {feedback.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400 mb-1">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </div>
                                            {item.rating && (
                                                <div className="flex items-center justify-end gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap">
                                        {item.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
