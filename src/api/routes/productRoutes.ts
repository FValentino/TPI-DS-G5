import {Router} from 'express';
import { productController } from '../controllers/productController.js';

const router = Router();

//Rutas para los productos
router.get('/', productController.getAllProducts);

router.get('/:productoId', productController.getProductById);

router.post('/', productController.createProduct);

// router.patch('/:productoId', productController.updateProduct);

router.delete('/:productoId', productController.deleteProduct);

export default router;