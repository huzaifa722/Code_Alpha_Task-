import { useEffect, useState } from "react";
import { getDailySales, getStockAlerts } from "../../api/client";

export default function Reports() {
  const [sales, setSales] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDailySales(), getStockAlerts()])
      .then(([salesData, alertsData]) => {
        setSales(salesData);
        setAlerts(alertsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Admin</p>
        <h1 className="page-title">Today, at a glance.</h1>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading && <div className="loading-state">Loading reports…</div>}

      {sales && (
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-value">Rs {sales.totalSales}</div>
            <div className="stat-label">Total sales today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{sales.totalOrders}</div>
            <div className="stat-label">Orders today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{alerts.length}</div>
            <div className="stat-label">Low stock items</div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <h3 style={{ fontFamily: "var(--font-display)" }}>Stock alerts</h3>
          {alerts.length === 0 ? (
            <div className="empty-state">
              <h3>All stocked up</h3>
              <p>No ingredients are below their reorder threshold.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>In stock</th>
                  <th>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.itemName}</td>
                    <td className="stock-low">{item.quantityInStock}</td>
                    <td>{item.reorderThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
