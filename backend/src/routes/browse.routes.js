import express from 'express';
import {
  browseLatestProducts,
  browseProductsByKeyword,
  browseProductsByShop
} from '../controller/browse.controller.js';

const router = express.Router();

// Browse latest products (last 1 week)
router.get('/products/latest', browseLatestProducts);

// Browse products by keyword
router.get('/products/search', browseProductsByKeyword);

// Browse products by shop
router.get('/shops/:shopId/products', browseProductsByShop);

export default router;
