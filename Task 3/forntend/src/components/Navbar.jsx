import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        The Copper<span>Fork</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>
          Menu
        </NavLink>
        <NavLink to="/tables">Tables</NavLink>
        <NavLink to="/cart">Cart{cartCount > 0 ? ` (${cartCount})` : ""}</NavLink>
        {user && <NavLink to="/orders">Orders</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/manage">Manage</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/inventory">Inventory</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin/reports">Reports</NavLink>}
      </div>

      <div className="nav-user">
        {user ? (
          <>
            <span>{user.name}</span>
            <button className="btn-link" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </div>
    </nav>
  );
}
