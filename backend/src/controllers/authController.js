import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const signToken = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const userPayload = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return next({ statusCode: 409, message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const result = await query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hash, 'user']);
    const users = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json({ user: userPayload(users[0]), token: signToken(users[0]) });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length || !(await bcrypt.compare(password, users[0].password))) return next({ statusCode: 401, message: 'Invalid email or password' });
    res.json({ user: userPayload(users[0]), token: signToken(users[0]) });
  } catch (error) { next(error); }
};

export const me = (req, res) => res.json({ user: req.user });

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    await query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.user.id]);
    const users = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: users[0] });
  } catch (error) { next(error); }
};
