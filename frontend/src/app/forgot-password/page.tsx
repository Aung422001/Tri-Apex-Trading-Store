'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return

        try {
            setLoading(true)
            const { data } = await api.post('/auth/forgot-password', { email })
            if (data.success) {
                setSuccess(true)
                toast.success('Reset link sent!')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {success ? (
                    <div className="card p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Check Your Inbox</h3>
                        <p className="text-gray-500 text-sm">
                            We've sent a password reset link to <strong>{email}</strong>.
                            It may take a minute or two to arrive. Check your spam folder just in case.
                        </p>
                        <Link href="/login" className="btn-primary w-full inline-block mt-4">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your-email@gmail.com"
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center mt-6">
                            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-accent flex items-center justify-center gap-1.5 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
