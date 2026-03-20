import { Response } from 'express'

interface ApiSuccessResponse<T> {
    success: true
    data: T
    meta?: Record<string, any>
}

interface ApiErrorResponse {
    success: false
    error: string
    details?: any
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/** Send a success response */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: Record<string, any>) {
    const response: ApiSuccessResponse<T> = { success: true, data }
    if (meta) response.meta = meta
    return res.status(statusCode).json(response)
}

/** Send an error response */
export function sendError(res: Response, error: string, statusCode = 400, details?: any) {
    const response: ApiErrorResponse = { success: false, error }
    if (details) response.details = details
    return res.status(statusCode).json(response)
}

/** Custom App Error class */
export class AppError extends Error {
    public statusCode: number
    public isOperational: boolean

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        Object.setPrototypeOf(this, AppError.prototype)
    }
}
