import { Router } from 'express'
import { productController } from '../controllers/product.controller'

const router = Router()

router.get('/', (req, res, next) => productController.getCategories(req, res, next))

export default router
