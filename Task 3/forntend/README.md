# The Copper Fork — Restaurant Frontend (React + Vite)

## Run it
```bash
npm install
npm run dev
```
Opens on http://localhost:5173.

## Connect to your backend
Everything talks to your Express API through **one file**: `src/api/client.js`.

```js
const BASE_URL = "http://localhost:5000/api";
```
Change this if your backend runs elsewhere. If a route path or response shape
differs from what's here, this is the only file to edit — every page calls
these functions, never `fetch` directly.

Expected shapes (matching your Mongoose models):
- `getMenu()` → array of MenuItem docs (`_id`, `name`, `price`, `category`, `description`, `isAvailable`)
- `getTables()` → array of Table docs (`_id`, `tableNumber`, `capacity`, `status`)
- `placeOrder()` → body `{ table, items: [{menuItem, quantity}], orderType }`
- `getAllOrders()` → array of Order docs with `items.menuItem` populated
- `getInventory()` / `getStockAlerts()` / `getDailySales()` → admin-only, require a
  logged-in user with `role: "admin"`

## Pages
- `/` — menu, filterable by category, add items to cart
- `/tables` — table map (select for dine-in, or reserve ahead)
- `/cart` — receipt-style order review, choose dine-in/takeaway/delivery, place order
- `/login`, `/register` — auth (staff or admin role)
- `/orders` — order list with status; admins can advance status (pending → preparing → ready → served → completed)
- `/admin/manage` — add menu items and add tables, with a running list of each (admin only)
- `/admin/inventory` — stock levels + add new inventory item (admin only)
- `/admin/reports` — daily sales total + low-stock alerts (admin only)

## Auth
JWT stored in `localStorage` after login/register. Authenticated calls in
`client.js` attach `Authorization: Bearer <token>` automatically.

## Cart
Cart state lives in `src/context/CartContext.jsx` (in-memory, resets on refresh —
by design, since the real order isn't placed until you hit "Place order").

## Design
"Chalkboard bistro" theme — coffee-black background, brass/gold accents, menu
items laid out like a printed menu card with a dotted price leader, orders shown
as a torn-edge receipt. Cormorant Garamond for headings, Work Sans for UI,
JetBrains Mono for prices/totals.
