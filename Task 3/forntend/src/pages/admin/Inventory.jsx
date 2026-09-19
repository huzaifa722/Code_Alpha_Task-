import { useEffect, useState } from "react";
import { getInventory, addInventoryItem } from "../../api/client";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    itemName: "",
    unit: "kg",
    quantityInStock: "",
    reorderThreshold: 5,
    supplier: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getInventory()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await addInventoryItem({
        ...form,
        quantityInStock: Number(form.quantityInStock),
        reorderThreshold: Number(form.reorderThreshold),
      });
      setForm({ itemName: "", unit: "kg", quantityInStock: "", reorderThreshold: 5, supplier: "" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Admin</p>
        <h1 className="page-title">Stock room.</h1>
      </div>

      <div className="layout-split">
        <div>
          {error && <div className="form-error">{error}</div>}
          {loading ? (
            <div className="loading-state">Loading inventory…</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>In stock</th>
                  <th>Threshold</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const low = item.quantityInStock <= item.reorderThreshold;
                  return (
                    <tr key={item._id}>
                      <td>{item.itemName}</td>
                      <td className={low ? "stock-low" : ""}>
                        {item.quantityInStock} {item.unit}
                        {low ? " ⚠" : ""}
                      </td>
                      <td>{item.reorderThreshold}</td>
                      <td>{item.supplier || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="form-card" style={{ maxWidth: "none" }}>
          <h3 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Add stock item</h3>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Item name</label>
              <input name="itemName" value={form.itemName} onChange={handleChange} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Unit</label>
                <input name="unit" value={form.unit} onChange={handleChange} required />
              </div>
              <div className="field">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantityInStock"
                  value={form.quantityInStock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label>Reorder threshold</label>
              <input
                type="number"
                name="reorderThreshold"
                value={form.reorderThreshold}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Supplier</label>
              <input name="supplier" value={form.supplier} onChange={handleChange} />
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Adding…" : "Add item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
