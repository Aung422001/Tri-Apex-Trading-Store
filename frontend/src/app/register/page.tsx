'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Package, Check, Circle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { apiErrorMessage } from '@/lib/utils'

// Same rules as registerSchema in backend/src/schemas/auth.schema.ts
const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8, error: 'Password must be at least 8 characters' },
    { label: 'One uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p), error: 'Password must contain at least one uppercase letter' },
    { label: 'One number (0–9)', test: (p: string) => /[0-9]/.test(p), error: 'Password must contain at least one number' },
]

function passwordProblem(password: string): string | null {
    return PASSWORD_RULES.find((rule) => !rule.test(password))?.error ?? null
}

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const register = useAuthStore((s) => s.register)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const problem = passwordProblem(password)
        if (problem) {
            toast.error(problem)
            return
        }
        try {
            setLoading(true)
            await register(name, email, password)
            toast.success('Account created! Welcome to Triapex!')
            router.push('/dashboard')
        } catch (err: any) {
            toast.error(apiErrorMessage(err, 'Registration failed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                        <Package className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Join the Triapex community</p>
                </div>

                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field pl-10" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field pl-10" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                                className="input-field pl-10 pr-10"
                                required
                                minLength={8}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <ul className="mt-3 space-y-1.5" aria-label="Password rules">
                            {PASSWORD_RULES.map((rule) => {
                                const met = rule.test(password)
                                return (
                                    <li key={rule.label} className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
                                        {met ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                        {rule.label}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
