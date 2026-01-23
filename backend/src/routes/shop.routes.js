import express from 'express';
import {
  createShop,
  addProduct,
  getShopWithProducts
} from '../controller/shop.controller.js';

const router = express.Router();

router.post('/create', createShop);
router.post('/:shopId/products', addProduct);
router.get('/:shopId', getShopWithProducts);

export default router;
