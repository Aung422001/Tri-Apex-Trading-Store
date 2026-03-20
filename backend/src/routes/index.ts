import { Router } from 'express'
import authRoutes from './auth.routes'
import productRoutes from './product.routes'
import categoryRoutes from './category.routes'
import cartRoutes from './cart.routes'
import orderRoutes from './order.routes'
import paymentRoutes from './payment.routes'
import aiRoutes from './ai.routes'
import feedbackRoutes from './feedback.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/payments', paymentRoutes)
router.use('/ai', aiRoutes)
router.use('/feedback', feedbackRoutes)

export default router
