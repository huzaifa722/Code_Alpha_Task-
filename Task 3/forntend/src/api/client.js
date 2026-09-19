// Base URL of your Express backend. Change if it runs elsewhere.
const BASE_URL = "http://localhost:5000/api";

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ---------- Auth ----------
export const registerUser = (payload) =>
  request("/auth/register", { method: "POST", body: payload });

export const loginUser = (payload) =>
  request("/auth/login", { method: "POST", body: payload });

// ---------- Menu ----------
export const getMenu = () => request("/menu");

export const createMenuItem = (payload) =>
  request("/menu", { method: "POST", body: payload, auth: true });

// ---------- Tables ----------
export const getTables = () => request("/tables");

export const getAvailableTables = () => request("/tables/available");

export const createTable = (payload) =>
  request("/tables", { method: "POST", body: payload, auth: true });

export const reserveTableStatus = (id, status) =>
  request(`/tables/${id}/status`, { method: "PATCH", body: { status }, auth: true });

// ---------- Reservations ----------
export const createReservation = (payload) =>
  request("/reservations", { method: "POST", body: payload });

// ---------- Orders ----------
export const placeOrder = (payload) =>
  request("/orders", { method: "POST", body: payload, auth: true });

export const getAllOrders = () => request("/orders", { auth: true });

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, { method: "PATCH", body: { status }, auth: true });

// ---------- Inventory (admin) ----------
export const getInventory = () => request("/inventory", { auth: true });

export const addInventoryItem = (payload) =>
  request("/inventory", { method: "POST", body: payload, auth: true });

// ---------- Reports (admin) ----------
export const getDailySales = () => request("/reports/daily-sales", { auth: true });

export const getStockAlerts = () => request("/reports/stock-alerts", { auth: true });
