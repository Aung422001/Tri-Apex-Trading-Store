import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export interface AuthRequest extends Request {
    user?: { id: string; email: string; role: string }
}

/** Verify JWT from Authorization header — attaches user to req */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized — no token provided' })
    }

    const token = authHeader.split(' ')[1]
    try {
        const decoded = verifyAccessToken(token)
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role }
        next()
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: 'Token expired' })
        }
        return res.status(401).json({ success: false, error: 'Invalid token' })
    }
}
