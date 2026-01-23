import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { findUserByEmail, updateUserSession, clearUserSession } from '../model/auth.model.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // 1. Find user
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // 3. Create session token (60 minutes)
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 mins

    // 4. Save session in DB
    await updateUserSession(user.id, sessionToken, expiresAt);

    // 5. Respond
    return res.json({
      message: 'Login successful',
      session: {
        token: sessionToken,
        expires_at: expiresAt,
        expires_in_minutes: 60,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header missing',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Find user by session token
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('session_token', token)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid or expired session',
      });
    }

    // Clear session in DB
    await clearUserSession(user.id);

    return res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}



export async function signup(req, res) {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({
        message: 'Email, password, name, and role are required',
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role',
        allowedRoles: ALLOWED_ROLES,
      });
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      return res.status(400).json({
        message: authError.message,
      });
    }

    const authUser = authData.user;

    // 2. Hash password for local DB (optional but valid)
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Store user profile in users table
    const user = await createUser({
      email,
      passwordHash,
      name,
      role,
    });

    // 4. Email confirmation status
    const emailConfirmed = Boolean(authUser.email_confirmed_at);

    return res.status(201).json({
      message: 'Signup successful',
      emailConfirmed,
      confirmationStatus: emailConfirmed
        ? 'confirmed'
        : 'pending',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}