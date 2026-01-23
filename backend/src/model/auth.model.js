import { supabase } from '../config/supabase.js';

/**
 * Used only for authentication checks
 */
export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function updateUserSession(userId, token, expiresAt) {
  const { error } = await supabase
    .from('users')
    .update({
      session_token: token,
      session_expires_at: expiresAt,
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }
}

/**
 * Clear user session on logout
 */
export async function clearUserSession(userId) {
  const { error } = await supabase
    .from('users')
    .update({
      session_token: null,
      session_expires_at: null,
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }

  return true;
}


/**
 * Used only during signup
 */
export async function createUser({ email, passwordHash, name, role }) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password_hash: passwordHash,
        name,
        role,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}