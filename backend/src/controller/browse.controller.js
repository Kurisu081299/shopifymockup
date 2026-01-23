import {
  getProductsLatestModel,
  getProductsByKeywordModel,
  getProductsByShopModel
} from '../model/browse.model.js';

// 1. Browse latest products (last 1 week)
export async function browseLatestProducts(req, res) {
  try {
    const products = await getProductsLatestModel();
    return res.json({ products });
  } catch (error) {
    console.error('Browse latest products error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// 2. Browse products by keyword
export async function browseProductsByKeyword(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const products = await getProductsByKeywordModel(keyword);
    return res.json({ products });
  } catch (error) {
    console.error('Browse products by keyword error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// 3. Browse products by shop
export async function browseProductsByShop(req, res) {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({ error: 'Shop ID is required' });
    }

    const products = await getProductsByShopModel(shopId);
    return res.json({ products });
  } catch (error) {
    console.error('Browse products by shop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
