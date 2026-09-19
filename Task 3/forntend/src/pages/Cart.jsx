import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/client";

export default function Cart() {
  const { items, decreaseItem, addItem, total, clearCart, table, setTable } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderType, setOrderType] = useState("dine-in");

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await placeOrder({
        table: orderType === "dine-in" ? table?._id : undefined,
        items: items.map((i) => ({ menuItem: i.menuItem._id, quantity: i.quantity })),
        orderType,
      });
      clearCart();
      setTable(null);
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Your order</p>
        <h1 className="page-title">Review before you send it to the kitchen.</h1>
      </div>

      <div className="layout-split">
        <div>
          {items.length === 0 ? (
            <div className="empty-state">
              <h3>Your cart is empty</h3>
              <p>Head back to the menu and add a dish or two.</p>
            </div>
          ) : (
            items.map((i) => (
              <div className="menu-item" key={i.menuItem._id}>
                <div className="menu-item-info">
                  <div className="menu-item-name-row">
                    <span className="menu-item-name">{i.menuItem.name}</span>
                    <span className="menu-item-leader" />
                    <span className="menu-item-price">Rs {i.menuItem.price * i.quantity}</span>
                  </div>
                </div>
                <div className="menu-item-actions">
                  <button className="qty-btn" onClick={() => decreaseItem(i.menuItem._id)}>
                    −
                  </button>
                  <span className="qty-value">{i.quantity}</span>
                  <button className="qty-btn" onClick={() => addItem(i.menuItem)}>
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="receipt">
          <h3 className="receipt-title">Ticket</h3>

          <div className="field">
            <label>Order type</label>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="dine-in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {orderType === "dine-in" && (
            <div className="receipt-line">
              <span>Table</span>
              <span>{table ? `#${table.tableNumber}` : "not selected"}</span>
            </div>
          )}

          {items.length === 0 ? (
            <p className="empty-cart">Nothing added yet</p>
          ) : (
            items.map((i) => (
              <div className="receipt-line" key={i.menuItem._id}>
                <span>
                  {i.quantity} × {i.menuItem.name}
                </span>
                <span>Rs {i.menuItem.price * i.quantity}</span>
              </div>
            ))
          )}

          <div className="receipt-total">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>

          {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}

          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 18 }}
            disabled={items.length === 0 || submitting || (orderType === "dine-in" && !table)}
            onClick={handlePlaceOrder}
          >
            {submitting ? "Sending…" : user ? "Place order" : "Log in to order"}
          </button>
        </div>
      </div>
    </div>
  );
}
