import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

/** Validate request body/query/params against a Zod schema */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source])
        if (!result.success) {
            return res.status(422).json({
                success: false,
                error: 'Validation failed',
                details: result.error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            })
        }
        req[source] = result.data
        next()
    }
}
