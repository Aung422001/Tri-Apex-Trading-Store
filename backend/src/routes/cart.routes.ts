import { Router } from 'express'
import { cartController } from '../controllers/cart.controller'
import { authenticate } from '../middleware/authenticate'

const router = Router()

router.use(authenticate)

router.get('/', (req, res, next) => cartController.getCart(req, res, next))
router.post('/items', (req, res, next) => cartController.addItem(req, res, next))
router.put('/items/:itemId', (req, res, next) => cartController.updateItem(req, res, next))
router.delete('/items/:itemId', (req, res, next) => cartController.removeItem(req, res, next))
router.delete('/', (req, res, next) => cartController.clearCart(req, res, next))

export default router
