# Restaurant Management System — Backend (Express.js)

## Setup
```bash
npm install
cp .env .env.local   # edit MONGO_URI, JWT_SECRET as needed
npm run dev          # nodemon, auto-restart
```

## Folder structure
- `config/` — DB connection + env loader
- `models/` — Mongoose schemas (MenuItem, Order, Table, Reservation, Inventory, User)
- `controllers/` — request handlers
- `services/` — business logic (order processing, table availability, inventory auto-deduct, reports)
- `routes/` — API endpoint definitions
- `middlewares/` — auth (JWT), validation, error handling
- `validations/` — express-validator rule sets

## Core API endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create admin/staff account |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/menu | List menu items |
| POST | /api/menu | Add menu item (admin) |
| GET | /api/tables/available | List free tables |
| POST | /api/orders | Place order (checks table + deducts stock) |
| PATCH | /api/orders/:id/status | Update order status |
| POST | /api/reservations | Reserve a table |
| GET | /api/inventory | List stock |
| GET | /api/reports/daily-sales | Daily sales total |
| GET | /api/reports/stock-alerts | Low-stock items |

## Key logic
- **Order placement** (`orderController.placeOrder`): checks table availability → calculates total from live menu prices → deducts ingredient stock → creates order → marks table occupied.
- **Inventory auto-update** (`inventoryService.deductStockForOrder`): reads each menu item's linked ingredients and reduces `Inventory.quantityInStock` accordingly; rejects the order if any ingredient is short.
- **Stock alerts** (`reportService.getStockAlerts`): flags items where `quantityInStock <= reorderThreshold`.
