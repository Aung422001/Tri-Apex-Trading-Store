import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { sendSuccess } from '../utils/apiResponse'
import { AuthRequest } from '../middleware/authenticate'

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body)
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 201)
        } catch (err) { next(err) }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body)
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            sendSuccess(res, { user: result.user, accessToken: result.accessToken })
        } catch (err) { next(err) }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.refreshToken
            if (!token) return res.status(401).json({ success: false, error: 'No refresh token' })
            const result = await authService.refresh(token)
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            sendSuccess(res, { accessToken: result.accessToken })
        } catch (err) { next(err) }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (req.user) await authService.logout(req.user.id)
            res.clearCookie('refreshToken')
            sendSuccess(res, { message: 'Logged out successfully' })
        } catch (err) { next(err) }
    }

    async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await authService.getMe(req.user!.id)
            sendSuccess(res, user)
        } catch (err) { next(err) }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.forgotPassword(req.body.email)
            sendSuccess(res, result)
        } catch (err) { next(err) }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body
            const result = await authService.resetPassword(token, newPassword)
            sendSuccess(res, result)
        } catch (err) { next(err) }
    }
}

export const authController = new AuthController()
