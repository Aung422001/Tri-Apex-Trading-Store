import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/apiResponse'

/** Global error handler — catches all errors and returns consistent JSON */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    // AppError (our custom operational errors)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        })
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(422).json({
            success: false,
            error: 'Validation failed',
            details: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        })
    }

    // Prisma known request errors
    if (err.constructor.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err as any
        switch (prismaErr.code) {
            case 'P2002':
                return res.status(409).json({
                    success: false,
                    error: `Duplicate value for: ${prismaErr.meta?.target?.join(', ') || 'unique field'}`,
                })
            case 'P2025':
                return res.status(404).json({
                    success: false,
                    error: 'Record not found',
                })
            default:
                break
        }
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
        })
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expired',
        })
    }

    // Unknown errors
    console.error('❌ Unhandled error:', err)
    return res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    })
}
