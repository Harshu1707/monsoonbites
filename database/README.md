# MonsoonBites Database

Run `mysql -u root -p < database/schema.sql` to create the MySQL database and tables. The backend seed script also executes this schema before generating demo data.

Seed data includes:
- 10 Indian restaurants
- 50 food items
- 20 regular users plus one admin
- 100 sample orders with order items

Demo credentials after `npm run seed --prefix backend`:
- Admin: `admin@monsoonbites.com` / `admin123`
- User: `user1@monsoonbites.com` / `password123`
