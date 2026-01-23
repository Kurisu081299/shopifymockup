import {
  createShopModel,
  getShopByNameModel,
  addProductModel,
  getShopWithProductsModel,
  findUserById,
  getShopByIdModel
} from '../model/shop.model.js';

const ALLOWED_ROLES = ['merchant', 'admin', 'superadmin'];

export async function createShop(req, res) {
  try {
    const { name, description, owner_id } = req.body;

    if (!name || !owner_id) {
      return res.status(400).json({
        error: 'Shop name and owner_id are required',
      });
    }

    // 1. Check if shop with same name exists
    const existingShop = await getShopByNameModel(name);
    if (existingShop) {
      return res.status(409).json({
        error: 'A shop with this name already exists',
      });
    }

    // 2. Find owner user and check role
    const owner = await findUserById(owner_id);
    if (!owner) {
      return res.status(404).json({
        error: 'Owner user not found',
      });
    }

    if (!ALLOWED_ROLES.includes(owner.role)) {
      return res.status(403).json({
        error: 'Only users with role merchant, admin, or superadmin can create a shop',
      });
    }

    // 3. Create shop
    const shop = await createShopModel({
      name,
      description,
      owner_id,
      user_id: owner_id, // set user_id same as owner_id
    });

    return res.status(201).json({
      message: 'Shop created successfully',
      shop,
    });
  } catch (error) {
    console.error('Create shop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addProduct(req, res) {
  try {
    const { shopId } = req.params; // shop_id from URL
    const { name, description, price, inventory } = req.body;

    if (!name || price === undefined || inventory === undefined) {
      return res.status(400).json({
        error: 'Product name, price, and inventory are required',
      });
    }

    // 1. Get shop details
    const shop = await getShopByIdModel(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // 2. Check owner's role
    const owner = await findUserById(shop.owner_id);

    if (!owner || !ALLOWED_ROLES.includes(owner.role)) {
      return res.status(403).json({
        error: 'Only merchants, admins, or superadmins can add products',
      });
    }

    // 3. Add product
    const product = await addProductModel({
      shop_id: shopId,
      name,
      description,
      price,
      inventory,
    });

    return res.status(201).json({
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    console.error('Add product error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getShopWithProducts(req, res) {
  try {
    const { shopId } = req.params;

    const shop = await getShopWithProductsModel(shopId);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    return res.json(shop);
  } catch (error) {
    console.error('Get shop error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
