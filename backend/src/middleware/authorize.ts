import { Response, NextFunction } from 'express'
import { AuthRequest } from './authenticate'

/** Role-based authorization middleware */
export function authorize(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized' })
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: 'Forbidden — insufficient permissions' })
        }
        next()
    }
}
