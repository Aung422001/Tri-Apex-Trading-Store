import { Router } from 'express'
import { orderController } from '../controllers/order.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema'

const router = Router()

router.use(authenticate)

// User routes
router.post('/', validate(createOrderSchema), (req, res, next) => orderController.create(req, res, next))
router.get('/', (req, res, next) => orderController.getUserOrders(req, res, next))
router.get('/:id', (req, res, next) => orderController.getById(req, res, next))
router.put('/:id/cancel', (req, res, next) => orderController.cancel(req, res, next))

// Admin routes
router.get('/admin/all', authorize('ADMIN'), (req, res, next) => orderController.adminGetAll(req, res, next))
router.put('/admin/:id/status', authorize('ADMIN'), validate(updateOrderStatusSchema), (req, res, next) => orderController.adminUpdateStatus(req, res, next))

export default router
