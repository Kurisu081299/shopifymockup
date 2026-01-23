import { supabase } from '../config/supabase.js';

export async function createShopModel({ name, description, owner_id}) {
  const { data, error } = await supabase
    .from('shops')
    .insert([{ name, description, owner_id}])
    .select()
    .single();

  if (error) throw error;
  return data;
}
// NEW: check if a shop exists by name
export async function getShopByNameModel(name) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('name', name)
    .single(); // only one shop expected

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function findUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function addProductModel({ shop_id, name, description, price, inventory }) {
  const { data, error } = await supabase
    .from('products')
    .insert([
      { shop_id, name, description, price, inventory },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getShopWithProductsModel(shopId) {
  const { data, error } = await supabase
    .from('shops')
    .select(`
      id,
      name,
      description,
      created_at,
      products (
        id,
        name,
        description,
        price,
        inventory,
        created_at
      )
    `)
    .eq('id', shopId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function getShopByIdModel(shopId) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}