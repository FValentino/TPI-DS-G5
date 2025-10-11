import { Router } from "express";   
import productRouter from './productRoutes.js';

const router =Router();

router.use('/products', productRouter);

export default router;