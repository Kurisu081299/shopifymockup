import { supabase } from '../config/supabase.js';

// 1. Latest products in the last 1 week
export async function getProductsLatestModel() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .gte('created_at', oneWeekAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 2. Products by keyword (search name or description)
export async function getProductsByKeywordModel(keyword) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 3. Products by shop
export async function getProductsByShopModel(shopId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
