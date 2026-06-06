import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return next({ statusCode: 401, message: 'Authentication token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const users = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [decoded.id]);
    if (!users.length) return next({ statusCode: 401, message: 'User no longer exists' });
    req.user = users[0];
    next();
  } catch {
    next({ statusCode: 401, message: 'Invalid or expired token' });
  }
};

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') return next({ statusCode: 403, message: 'Admin access required' });
  next();
};
