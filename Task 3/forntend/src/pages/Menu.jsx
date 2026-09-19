import { useEffect, useState, useMemo } from "react";
import { getMenu } from "../api/client";
import MenuItemRow from "../components/MenuItemRow";

const CATEGORIES = ["all", "starter", "main-course", "dessert", "beverage", "other"];

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    getMenu()
      .then(setMenu)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      activeCategory === "all" ? menu : menu.filter((item) => item.category === activeCategory),
    [menu, activeCategory]
  );

  return (
    <div>
      <div className="page-header">
        <p className="page-eyebrow">Tonight's menu</p>
        <h1 className="page-title">Good food, plated simply.</h1>
        <p className="page-sub">Browse the menu, add what you're craving, and place your order.</p>
      </div>

      <div className="category-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {loading && <div className="loading-state">Loading menu…</div>}
      {error && <div className="form-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <h3>Nothing here yet</h3>
          <p>Try another category, or check back once the menu is set up.</p>
        </div>
      )}

      {filtered.map((item) => (
        <MenuItemRow key={item._id} item={item} />
      ))}
    </div>
  );
}
