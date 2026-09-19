import { useEffect, useState } from "react";
import { getMenu, createMenuItem, getTables, createTable } from "../../api/client";

const CATEGORIES = ["starter", "main-course", "dessert", "beverage", "other"];

const emptyMenuForm = {
  name: "",
  description: "",
  category: "main-course",
  price: "",
  isAvailable: true,
};

const emptyTableForm = { tableNumber: "", capacity: "", location: "main-hall" };

export default function ManageMenu() {
  const [activeTab, setActiveTab] = useState("menu");

  // ---------- Menu items ----------
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuForm, setMenuForm] = useState(emptyMenuForm);
  const [menuError, setMenuError] = useState("");
  const [menuSubmitting, setMenuSubmitting] = useState(false);

  // ---------- Tables ----------
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [tableForm, setTableForm] = useState(emptyTableForm);
  const [tableError, setTableError] = useState("");
  const [tableSubmitting, setTableSubmitting] = useState(false);

  const loadMenu = () => {
    setMenuLoading(true);
    getMenu()
      .then(setMenu)
      .catch((err) => setMenuError(err.message))
      .finally(() => setMenuLoading(false));
  };

  const loadTables = () => {
    setTablesLoading(true);
    getTables()
      .then(setTables)
      .catch((err) => setTableError(err.message))
      .finally(() => setTablesLoading(false));
  };

  useEffect(() => {
    loadMenu();
    loadTables();
  }, []);

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm({ ...menuForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setMenuError("");
    setMenuSubmitting(true);
    try {
      await createMenuItem({ ...menuForm, price: Number(menuForm.price) });
      setMenuForm(emptyMenuForm);
      loadMenu();
    } catch (err) {
      setMenuError(err.message);
    } finally {
      setMenuSubmitting(false);
    }
  };

  const handleTableChange = (e) => setTableForm({ ...tableForm, [e.target.name]: e.target.value });

  const handleTableSubmit = async (e) => {
    e.preventDefault();
    setTableError("");
    setTableSubmitting(true);
    try {
      await createTable({
        ...tableForm,
        tableNumber: Number(tableForm.tableNumber),
        capacity: Number(tableForm.capacity),
      });
      setTableForm(emptyTableForm);
      loadTables();
    } catch (err) {
      setTableError(err.message);
    } finally {
      setTableSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Admin</p>
        <h1 className="page-title">Set up the menu and floor.</h1>
        <p className="page-sub">Add dishes to the menu and set up the tables customers can book.</p>
      </div>

      <div className="category-row">
        <button
          className={`category-chip ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Menu items
        </button>
        <button
          className={`category-chip ${activeTab === "tables" ? "active" : ""}`}
          onClick={() => setActiveTab("tables")}
        >
          Tables
        </button>
      </div>

      {activeTab === "menu" && (
        <div className="layout-split">
          <div>
            {menuError && <div className="form-error">{menuError}</div>}
            {menuLoading ? (
              <div className="loading-state">Loading menu…</div>
            ) : menu.length === 0 ? (
              <div className="empty-state">
                <h3>No dishes yet</h3>
                <p>Add your first item using the form.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {menu.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>Rs {item.price}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            item.isAvailable ? "status-ready" : "status-cancelled"
                          }`}
                        >
                          {item.isAvailable ? "available" : "unavailable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="form-card" style={{ maxWidth: "none" }}>
            <h3 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Add a dish</h3>
            <form onSubmit={handleMenuSubmit}>
              <div className="field">
                <label>Name</label>
                <input name="name" value={menuForm.name} onChange={handleMenuChange} required />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={menuForm.description}
                  onChange={handleMenuChange}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Category</label>
                  <select name="category" value={menuForm.category} onChange={handleMenuChange}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Price (Rs)</label>
                  <input
                    type="number"
                    name="price"
                    min={0}
                    value={menuForm.price}
                    onChange={handleMenuChange}
                    required
                  />
                </div>
              </div>
              <div className="field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={menuForm.isAvailable}
                  onChange={handleMenuChange}
                  style={{ width: "auto" }}
                />
                <label htmlFor="isAvailable" style={{ margin: 0 }}>
                  Available right now
                </label>
              </div>
              <button className="btn btn-primary btn-block" disabled={menuSubmitting}>
                {menuSubmitting ? "Adding…" : "Add to menu"}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "tables" && (
        <div className="layout-split">
          <div>
            {tableError && <div className="form-error">{tableError}</div>}
            {tablesLoading ? (
              <div className="loading-state">Loading tables…</div>
            ) : tables.length === 0 ? (
              <div className="empty-state">
                <h3>No tables yet</h3>
                <p>Add your first table using the form.</p>
              </div>
            ) : (
              <div className="tables-grid">
                {tables.map((t) => (
                  <div className="table-chip" key={t._id}>
                    <div className="table-number">#{t.tableNumber}</div>
                    <div className="table-capacity">Seats {t.capacity}</div>
                    <span className={`table-status ${t.status}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-card" style={{ maxWidth: "none" }}>
            <h3 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Add a table</h3>
            <form onSubmit={handleTableSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Table number</label>
                  <input
                    type="number"
                    name="tableNumber"
                    min={1}
                    value={tableForm.tableNumber}
                    onChange={handleTableChange}
                    required
                  />
                </div>
                <div className="field">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    min={1}
                    value={tableForm.capacity}
                    onChange={handleTableChange}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label>Location</label>
                <input name="location" value={tableForm.location} onChange={handleTableChange} />
              </div>
              <button className="btn btn-primary btn-block" disabled={tableSubmitting}>
                {tableSubmitting ? "Adding…" : "Add table"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
