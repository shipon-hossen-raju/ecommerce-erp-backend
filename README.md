# Mini ERP Backend

Node.js + Express + TypeScript + MongoDB (Mongoose) backend for the Mini ERP — Inventory & Sales Management System.

## Setup

```bash
npm install
cp .env.example .env   # then edit values as needed
npm run dev
```

A super admin (`SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` from `.env`) is seeded automatically on first boot.

## API (base path `/api/v1`)

All responses follow `{ success, message, meta?, data }`.

### Auth

- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET /auth/me` — current user profile (any authenticated role)

### Users (Admin only)

- `POST /users` — create a Manager/Employee/Admin account
- `GET /users` / `GET /users/:id`
- `PUT /users/:id` / `DELETE /users/:id`

### Products

- `GET /products?searchTerm=&page=&limit=&sort=` — Admin, Manager, Employee
- `GET /products/:id` — Admin, Manager, Employee
- `POST /products` (multipart, field `image` required) — Admin, Manager
- `PUT /products/:id` (multipart, `image` optional) — Admin, Manager
- `DELETE /products/:id` — Admin, Manager

### Sales

- `POST /sales` — `{ items: [{ product, quantity }] }` — Admin, Manager, Employee
- `GET /sales` — sale history — Admin, Manager

### Dashboard

- `GET /dashboard` — `{ totalProducts, totalSales, lowStockCount, lowStockProducts }` — Admin, Manager

## Role permissions

| Role     | Permissions                    |
| -------- | ------------------------------- |
| Admin    | Full access                     |
| Manager  | Manage products, create sales   |
| Employee | View products, create sales     |
