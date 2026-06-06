import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { pool, query } from '../config/db.js';

const names = ['Cloud Curry House','Raincoat Rasoi','Thali Thunder','Coastal Drizzle Kitchen','Monsoon Masala','Puddle Chaat Co.','Saffron Showers','Garam Gully','Biryani Baarish','Filter Coffee Clouds'];
const foods = ['Butter Chicken','Paneer Tikka','Masala Dosa','Hyderabadi Biryani','Pav Bhaji','Chole Bhature','Rajma Chawal','Vada Pav','Fish Curry','Mutton Rogan Josh','Dal Makhani','Aloo Paratha','Chicken 65','Idli Sambar','Pani Puri','Kathi Roll','Malai Kofta','Palak Paneer','Gulab Jamun','Rasmalai','Misal Pav','Dhokla','Tandoori Roti','Veg Pulao','Keema Naan','Egg Curry','Prawn Koliwada','Kadai Paneer','Lassi','Jalebi'];
const categories = ['North Indian','South Indian','Street Food','Biryani','Desserts','Beverages','Seafood'];
const statuses = ['Pending','Preparing','Out for Delivery','Delivered'];

async function run() {
  const schema = await fs.readFile(path.resolve('..', 'database', 'schema.sql'), 'utf8');
  for (const statement of schema.split(';').map((s) => s.trim()).filter(Boolean)) await pool.query(statement);
  const adminHash = await bcrypt.hash('admin123', 12);
  const userHash = await bcrypt.hash('password123', 12);
  await query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', ['Admin Monsoon','admin@monsoonbites.com', adminHash, 'admin']);
  for (let i = 1; i <= 20; i++) await query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [`Foodie ${i}`, `user${i}@monsoonbites.com`, userHash, 'user']);
  for (let i = 0; i < names.length; i++) await query('INSERT INTO restaurants (name,description,address,image,rating,latitude,longitude) VALUES (?,?,?,?,?,?,?)', [names[i], 'Warm Indian comfort food served with a fresh monsoon mood.', `MG Road ${i + 1}, Mumbai`, `https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80`, (4 + Math.random()).toFixed(1), 19.076 + i / 100, 72.8777 + i / 100]);
  for (let i = 0; i < 50; i++) await query('INSERT INTO foods (restaurant_id,name,description,category,price,image) VALUES (?,?,?,?,?,?)', [(i % 10) + 1, foods[i % foods.length], 'A delicious rain-day favorite prepared with aromatic spices.', categories[i % categories.length], 99 + (i % 12) * 35, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80']);
  for (let i = 1; i <= 100; i++) {
    const userId = (i % 20) + 2;
    const total = 250 + (i % 8) * 110;
    const result = await query('INSERT INTO orders (user_id,total_amount,status,delivery_address) VALUES (?,?,?,?)', [userId, total, statuses[i % statuses.length], `Apartment ${i}, Bandra West, Mumbai`]);
    for (let j = 0; j < 2; j++) await query('INSERT INTO order_items (order_id,food_id,quantity,price) VALUES (?,?,?,?)', [result.insertId, ((i + j) % 50) + 1, 1 + (j % 2), total / 3]);
  }
  console.log('Seed complete. Admin: admin@monsoonbites.com / admin123; Users: user1@monsoonbites.com / password123');
  await pool.end();
}
run().catch((error) => { console.error(error); process.exit(1); });
