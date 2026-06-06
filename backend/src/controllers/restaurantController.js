import { query } from '../config/db.js';

const imagePath = (req) => req.file ? `/uploads/${req.file.filename}` : req.body.image || null;

export const listRestaurants = async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query('SELECT * FROM restaurants WHERE name LIKE ? OR description LIKE ? OR address LIKE ? ORDER BY rating DESC, created_at DESC', [search, search, search]);
    res.json(rows);
  } catch (error) { next(error); }
};

export const getRestaurant = async (req, res, next) => {
  try {
    const restaurants = await query('SELECT * FROM restaurants WHERE id = ?', [req.params.id]);
    if (!restaurants.length) return next({ statusCode: 404, message: 'Restaurant not found' });
    const foods = await query('SELECT * FROM foods WHERE restaurant_id = ? ORDER BY category, name', [req.params.id]);
    const reviews = await query('SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id = r.user_id WHERE restaurant_id = ? ORDER BY r.created_at DESC', [req.params.id]);
    res.json({ ...restaurants[0], foods, reviews });
  } catch (error) { next(error); }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const { name, description, address, rating = 4.2, latitude, longitude } = req.body;
    const result = await query('INSERT INTO restaurants (name, description, address, image, rating, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, description, address, imagePath(req), rating, latitude || null, longitude || null]);
    const rows = await query('SELECT * FROM restaurants WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const current = await query('SELECT * FROM restaurants WHERE id = ?', [req.params.id]);
    if (!current.length) return next({ statusCode: 404, message: 'Restaurant not found' });
    const { name, description, address, rating, latitude, longitude } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || current[0].image);
    await query('UPDATE restaurants SET name=?, description=?, address=?, image=?, rating=?, latitude=?, longitude=? WHERE id=?', [name, description, address, image, rating, latitude || null, longitude || null, req.params.id]);
    const rows = await query('SELECT * FROM restaurants WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
};

export const deleteRestaurant = async (req, res, next) => {
  try { await query('DELETE FROM restaurants WHERE id = ?', [req.params.id]); res.json({ message: 'Restaurant deleted' }); } catch (error) { next(error); }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    await query('INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?)', [req.user.id, req.params.id, rating, comment]);
    await query('UPDATE restaurants SET rating = (SELECT ROUND(AVG(rating),1) FROM reviews WHERE restaurant_id = ?) WHERE id = ?', [req.params.id, req.params.id]);
    res.status(201).json({ message: 'Review added' });
  } catch (error) { next(error); }
};
