import { query } from '../config/db.js';

export const listFoods = async (req, res, next) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const rows = await query('SELECT f.*, r.name AS restaurant_name FROM foods f JOIN restaurants r ON r.id=f.restaurant_id WHERE f.name LIKE ? OR f.category LIKE ? OR f.description LIKE ? ORDER BY f.created_at DESC', [search, search, search]);
    res.json(rows);
  } catch (error) { next(error); }
};

export const createFood = async (req, res, next) => {
  try {
    const { restaurant_id, name, description, category, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || null;
    const result = await query('INSERT INTO foods (restaurant_id, name, description, category, price, image) VALUES (?, ?, ?, ?, ?, ?)', [restaurant_id, name, description, category, price, image]);
    const rows = await query('SELECT * FROM foods WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

export const updateFood = async (req, res, next) => {
  try {
    const current = await query('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    if (!current.length) return next({ statusCode: 404, message: 'Food item not found' });
    const { restaurant_id, name, description, category, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || current[0].image);
    await query('UPDATE foods SET restaurant_id=?, name=?, description=?, category=?, price=?, image=? WHERE id=?', [restaurant_id, name, description, category, price, image, req.params.id]);
    const rows = await query('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
};

export const deleteFood = async (req, res, next) => {
  try { await query('DELETE FROM foods WHERE id = ?', [req.params.id]); res.json({ message: 'Food deleted' }); } catch (error) { next(error); }
};
