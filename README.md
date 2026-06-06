# MonsoonBites

MonsoonBites is a production-ready full-stack food delivery web app inspired by Zomato, with a monsoon-season glassmorphism UI, real-time order updates, admin dashboards, local image uploads, JWT authentication, and a MySQL database.

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, Context API, Leaflet/OpenStreetMap, Socket.IO client
- Backend: Node.js, Express, MySQL2, JWT, bcrypt, Multer, Socket.IO, Helmet, CORS, express-validator
- Database: MySQL with normalized tables for users, restaurants, foods, carts, orders, order items, and reviews

## Project Structure

```text
frontend/   React application and UI components
backend/    Express API, controllers, routes, middleware, Socket.IO
database/   SQL schema and database notes
```

## Features

### Customer

- Register, login, logout, protected routes
- Monsoon landing page with animated rain
- Search restaurants and food items
- Restaurant listings and details with Leaflet maps
- Menu cards with images, categories, prices, and add-to-cart
- Cart quantity updates and dynamic totals
- Checkout with delivery address and mock payment
- Order history with real-time Socket.IO status updates
- Profile editing and reviews

### Admin

- Admin-only routes and dashboard
- Metrics for users, restaurants, foods, orders, and delivered revenue
- Restaurant CRUD with local image upload support
- Food CRUD with local image upload support
- Order status management: Pending, Preparing, Out for Delivery, Delivered
- Status changes instantly emit to customer screens

## Installation

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm

### 1. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with your MySQL credentials and a strong `JWT_SECRET`.

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Create and seed the database

```bash
mysql -u root -p < database/schema.sql
npm run seed --prefix backend
```

The seed command creates demo restaurants, foods, users, and orders.

### 4. Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Uploads: http://localhost:5000/uploads/<filename>

## Demo Credentials

- Admin: `admin@monsoonbites.com` / `admin123`
- User: `user1@monsoonbites.com` / `password123`

## API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

### Auth

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password }` | Create user account |
| POST | `/auth/login` | `{ email, password }` | Login and receive JWT |
| GET | `/auth/me` | - | Current user |
| PUT | `/auth/profile` | `{ name, email }` | Update profile |

### Restaurants

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/restaurants?search=` | Public | List/search restaurants |
| GET | `/restaurants/:id` | Public | Details, menu, reviews |
| POST | `/restaurants` | Admin | Create restaurant, multipart image optional |
| PUT | `/restaurants/:id` | Admin | Update restaurant |
| DELETE | `/restaurants/:id` | Admin | Delete restaurant |
| POST | `/restaurants/:id/reviews` | User | Add review |

### Foods

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/foods?search=` | Public | List/search food items |
| POST | `/foods` | Admin | Add food item, multipart image optional |
| PUT | `/foods/:id` | Admin | Update food item |
| DELETE | `/foods/:id` | Admin | Delete food item |

### Cart

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| GET | `/cart` | - | Get current cart |
| POST | `/cart` | `{ food_id, quantity }` | Add item |
| PUT | `/cart/:id` | `{ quantity }` | Update quantity; zero removes |
| DELETE | `/cart/:id` | - | Remove item |

### Orders

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/orders` | User/Admin | User history or all orders for admin |
| POST | `/orders/checkout` | User | Create order from cart |
| PATCH | `/orders/:id/status` | Admin | Update status and emit Socket.IO event |

### Admin

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/admin/stats` | Dashboard totals and revenue |

## Security Notes

- Passwords are hashed with bcrypt before storage.
- SQL statements use parameterized MySQL2 queries.
- JWT middleware protects private routes.
- Admin middleware isolates management APIs.
- `express-validator` validates request payloads.
- Helmet and CORS are configured in the Express app.
- Uploaded files are limited to 3 MB and images only.
