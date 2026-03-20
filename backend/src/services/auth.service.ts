import prisma from '../config/database'
import { hashPassword, comparePassword } from '../utils/hash'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { AppError } from '../utils/apiResponse'
import { RegisterInput, LoginInput } from '../schemas/auth.schema'
import { sendPasswordResetEmail } from './email.service'
import crypto from 'crypto'

export class AuthService {
    /** Register a new user */
    async register(data: RegisterInput) {
        const exists = await prisma.user.findUnique({ where: { email: data.email } })
        if (exists) throw new AppError(409, 'Email already registered')

        const hashed = await hashPassword(data.password)
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed,
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        })

        // Create empty cart for user
        await prisma.cart.create({ data: { userId: user.id } })

        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role })
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role })

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        })

        return { user, accessToken, refreshToken }
    }

    /** Login with email and password */
    async login(data: LoginInput) {
        const user = await prisma.user.findUnique({ where: { email: data.email } })
        if (!user || !user.password) throw new AppError(401, 'Invalid email or password')

        const valid = await comparePassword(data.password, user.password)
        if (!valid) throw new AppError(401, 'Invalid email or password')

        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role })
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role })

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        })

        return {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken,
            refreshToken,
        }
    }

    async refresh(token: string) {
        let decoded: any;
        try {
            decoded = verifyRefreshToken(token)
        } catch (error: any) {
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                const parts = token.split('.');
                if (parts.length === 3) {
                    try {
                        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                        if (payload && payload.id) {
                            await prisma.user.updateMany({
                                where: { id: payload.id, refreshToken: token },
                                data: { refreshToken: null }
                            });
                        }
                    } catch (e) { }
                }
            }
            throw new AppError(401, 'Invalid or expired refresh token')
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } })
        if (!user || user.refreshToken !== token) {
            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { refreshToken: null }
                })
            }
            throw new AppError(401, 'Invalid refresh token')
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role })
        const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role })

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        })

        return { accessToken, refreshToken: newRefreshToken }
    }

    /** Logout — clear refresh token */
    async logout(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        })
    }

    /** Get current user profile */
    async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, role: true, phone: true,
                avatar: true, createdAt: true, emailVerified: true,
                _count: { select: { orders: true, reviews: true } }
            },
        })
        if (!user) throw new AppError(404, 'User not found')
        return user
    }

    /** Forgot password — send reset email via Gmail */
    async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email } })
        // Always return success to prevent email enumeration attacks
        if (!user) return { message: 'If that email is registered, a reset link has been sent.' }

        // Invalidate any existing tokens for this email
        await (prisma as any).passwordResetToken.updateMany({
            where: { email, used: false },
            data: { used: true },
        })

        // Generate a secure random 64-char hex token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

        await (prisma as any).passwordResetToken.create({
            data: { email, token, expiresAt },
        })

        const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`
        await sendPasswordResetEmail(email, resetUrl, user.name)

        return { message: 'If that email is registered, a reset link has been sent.' }
    }

    /** Reset password using token from email */
    async resetPassword(token: string, newPassword: string) {
        const record = await (prisma as any).passwordResetToken.findUnique({ where: { token } })

        if (!record || record.used || record.expiresAt < new Date()) {
            throw new AppError(400, 'This reset link is invalid or has expired.')
        }

        const hashed = await hashPassword(newPassword)

        await prisma.user.update({
            where: { email: record.email },
            data: { password: hashed },
        })

        // Mark token as used so it can't be reused
        await (prisma as any).passwordResetToken.update({
            where: { token },
            data: { used: true },
        })

        return { message: 'Password updated successfully. You can now log in.' }
    }
}

export const authService = new AuthService()
