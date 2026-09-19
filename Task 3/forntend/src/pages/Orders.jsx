import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../api/client";
import { useAuth } from "../context/AuthContext";

const NEXT_STATUS = {
  pending: "preparing",
  preparing: "ready",
  ready: "served",
  served: "completed",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const advanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateOrderStatus(order._id, next);
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: next } : o)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Kitchen &amp; front of house</p>
        <h1 className="page-title">Orders in progress.</h1>
      </div>

      {loading && <div className="loading-state">Loading orders…</div>}
      {error && <div className="form-error">{error}</div>}

      {!loading && orders.length === 0 && (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Placed orders will show up here.</p>
        </div>
      )}

      {orders.map((order) => (
        <div className="order-row" key={order._id}>
          <div>
            <div className="order-id">#{order._id.slice(-6)}</div>
            <div style={{ marginTop: 4 }}>
              {order.items?.map((it) => `${it.quantity}× ${it.menuItem?.name || "item"}`).join(", ")}
            </div>
          </div>
          <span className="order-total">Rs {order.totalAmount}</span>
          <span className={`status-pill status-${order.status}`}>{order.status}</span>
          {user?.role === "admin" && NEXT_STATUS[order.status] && (
            <button className="btn btn-ghost" onClick={() => advanceStatus(order)}>
              Mark {NEXT_STATUS[order.status]}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
