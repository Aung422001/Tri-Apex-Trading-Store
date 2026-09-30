'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Package } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { apiErrorMessage } from '@/lib/api'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const login = useAuthStore((s) => s.login)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            setLoading(true)
            await login(email, password)
            toast.success('Welcome back!')
            router.push('/dashboard')
        } catch (err: any) {
            const msg = apiErrorMessage(err, 'Invalid email or password')
            toast.error(msg)
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
                        <Package className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to your Triapex account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="input-field pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link href="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-field pl-10 pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-accent font-medium hover:underline">Create one</Link>
                    </div>

                    {/* Demo credentials */}
                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <p className="text-xs text-gray-400 text-center mb-2">Demo Credentials</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={async () => { 
                                    setEmail('admin@triapextrading.com'); 
                                    setPassword('ChangeThisPassword123!');
                                    try {
                                        setLoading(true);
                                        await login('admin@triapextrading.com', 'ChangeThisPassword123!');
                                        toast.success('Welcome back!');
                                        router.push('/dashboard');
                                    } catch (err: any) {
                                        const msg = apiErrorMessage(err, 'Invalid email or password');
                                        toast.error(msg);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="text-xs bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                👑 Admin
                            </button>
                            <button
                                type="button"
                                onClick={async () => { 
                                    setEmail('demo@triapextrading.com'); 
                                    setPassword('User12345!');
                                    try {
                                        setLoading(true);
                                        await login('demo@triapextrading.com', 'User12345!');
                                        toast.success('Welcome back!');
                                        router.push('/dashboard');
                                    } catch (err: any) {
                                        const msg = apiErrorMessage(err, 'Invalid email or password');
                                        toast.error(msg);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="text-xs bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                            >
                                👤 Demo User
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
