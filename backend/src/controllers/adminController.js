import { query } from '../config/db.js';

export const stats = async (_req, res, next) => {
  try {
    const [[users], [restaurants], [foods], [orders], [revenue]] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM users'),
      query('SELECT COUNT(*) AS total FROM restaurants'),
      query('SELECT COUNT(*) AS total FROM foods'),
      query('SELECT COUNT(*) AS total FROM orders'),
      query('SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status=?', ['Delivered'])
    ]);
    res.json({ users: users.total, restaurants: restaurants.total, foods: foods.total, orders: orders.total, revenue: Number(revenue.total) });
  } catch (error) { next(error); }
};
