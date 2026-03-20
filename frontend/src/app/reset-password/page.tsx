'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or missing reset token')
            router.push('/login')
        }
    }, [token, router])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) return toast.error('Passwords do not match')
        if (password.length < 8) return toast.error('Password must be at least 8 characters')

        try {
            setLoading(true)
            const { data } = await api.post('/auth/reset-password', { token, newPassword: password })
            if (data.success) {
                setSuccess(true)
                toast.success('Password reset successfully!')
                setTimeout(() => router.push('/login'), 2000)
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Invalid or expired token')
        } finally {
            setLoading(false)
        }
    }

    if (!token) return null

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                        <Lock className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Create New Password</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Please enter your new password below
                    </p>
                </div>

                {success ? (
                    <div className="card p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Password Changed</h3>
                        <p className="text-gray-500 text-sm">
                            Your password has been successfully updated. Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field pl-10"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password || !confirm}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
