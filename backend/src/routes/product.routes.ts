import { Router } from 'express'
import { productController } from '../controllers/product.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import { createProductSchema, updateProductSchema } from '../schemas/product.schema'

const router = Router()

// Public
router.get('/', (req, res, next) => productController.list(req, res, next))
router.get('/:slug', (req, res, next) => productController.getBySlug(req, res, next))

// Admin only
router.post('/', authenticate, authorize('ADMIN'), validate(createProductSchema), (req, res, next) => productController.create(req, res, next))
router.put('/:id', authenticate, authorize('ADMIN'), validate(updateProductSchema), (req, res, next) => productController.update(req, res, next))
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) => productController.delete(req, res, next))

export default router
