import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'rouniyar-decor-secure-jwt-auth-token-key-2025';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Check auth cookie
  const cookie = request.cookies.get('token');
  if (cookie?.value) {
    return verifyToken(cookie.value);
  }

  return null;
}

export function requireAuth(request: NextRequest): { user: TokenPayload } | { error: string; status: number } {
  const user = getUserFromRequest(request);
  if (!user) {
    return { error: 'Authentication required. Please login.', status: 401 };
  }
  return { user };
}

export function requireAdmin(request: NextRequest): { user: TokenPayload } | { error: string; status: number } {
  const user = getUserFromRequest(request);
  if (!user) {
    return { error: 'Admin authentication required.', status: 401 };
  }
  if (user.role !== 'ADMIN') {
    return { error: 'Access forbidden. Admin privileges required.', status: 403 };
  }
  return { user };
}
