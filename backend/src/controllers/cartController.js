import { query } from '../config/db.js';

export const getCart = async (req, res, next) => {
  try {
    const items = await query('SELECT c.id, c.quantity, f.id AS food_id, f.name, f.price, f.image, f.restaurant_id, r.name AS restaurant_name FROM cart_items c JOIN foods f ON f.id=c.food_id JOIN restaurants r ON r.id=f.restaurant_id WHERE c.user_id=? ORDER BY c.id DESC', [req.user.id]);
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    res.json({ items, total });
  } catch (error) { next(error); }
};

export const addToCart = async (req, res, next) => {
  try {
    const { food_id, quantity = 1 } = req.body;
    await query('INSERT INTO cart_items (user_id, food_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)', [req.user.id, food_id, quantity]);
    res.status(201).json({ message: 'Added to cart' });
  } catch (error) { next(error); }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (Number(quantity) <= 0) await query('DELETE FROM cart_items WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    else await query('UPDATE cart_items SET quantity=? WHERE id=? AND user_id=?', [quantity, req.params.id, req.user.id]);
    res.json({ message: 'Cart updated' });
  } catch (error) { next(error); }
};

export const removeCartItem = async (req, res, next) => {
  try { await query('DELETE FROM cart_items WHERE id=? AND user_id=?', [req.params.id, req.user.id]); res.json({ message: 'Removed from cart' }); } catch (error) { next(error); }
};
