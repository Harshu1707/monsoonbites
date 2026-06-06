import { pool, query } from '../config/db.js';

const orderSql = `SELECT o.*, u.name AS user_name, u.email AS user_email FROM orders o JOIN users u ON u.id=o.user_id`;

export const getOrders = async (req, res, next) => {
  try {
    const sql = req.user.role === 'admin' ? `${orderSql} ORDER BY o.created_at DESC` : `${orderSql} WHERE o.user_id=? ORDER BY o.created_at DESC`;
    const orders = await query(sql, req.user.role === 'admin' ? [] : [req.user.id]);
    for (const order of orders) {
      order.items = await query('SELECT oi.*, f.name, f.image FROM order_items oi JOIN foods f ON f.id=oi.food_id WHERE oi.order_id=?', [order.id]);
    }
    res.json(orders);
  } catch (error) { next(error); }
};

export const checkout = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { delivery_address } = req.body;
    await conn.beginTransaction();
    const [items] = await conn.execute('SELECT c.quantity, f.id AS food_id, f.price FROM cart_items c JOIN foods f ON f.id=c.food_id WHERE c.user_id=?', [req.user.id]);
    if (!items.length) throw { statusCode: 400, message: 'Cart is empty' };
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const [orderResult] = await conn.execute('INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)', [req.user.id, total, delivery_address]);
    for (const item of items) await conn.execute('INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)', [orderResult.insertId, item.food_id, item.quantity, item.price]);
    await conn.execute('DELETE FROM cart_items WHERE user_id=?', [req.user.id]);
    await conn.commit();
    req.app.get('io')?.to(`user:${req.user.id}`).emit('order:update', { id: orderResult.insertId, status: 'Pending' });
    res.status(201).json({ id: orderResult.insertId, total_amount: total, status: 'Pending' });
  } catch (error) { await conn.rollback(); next(error); } finally { conn.release(); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
    const orders = await query('SELECT * FROM orders WHERE id=?', [req.params.id]);
    if (!orders.length) return next({ statusCode: 404, message: 'Order not found' });
    req.app.get('io')?.to(`user:${orders[0].user_id}`).emit('order:update', { id: Number(req.params.id), status });
    res.json(orders[0]);
  } catch (error) { next(error); }
};
