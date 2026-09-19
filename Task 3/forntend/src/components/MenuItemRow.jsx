import { useCart } from "../context/CartContext";

export default function MenuItemRow({ item }) {
  const { addItem, decreaseItem, getQuantity } = useCart();
  const quantity = getQuantity(item._id);

  return (
    <div className="menu-item">
      <div className="menu-item-info">
        <div className="menu-item-name-row">
          <span className="menu-item-name">{item.name}</span>
          <span className="menu-item-leader" />
          <span className="menu-item-price">Rs {item.price}</span>
        </div>
        {item.description && <p className="menu-item-desc">{item.description}</p>}
      </div>

      <div className="menu-item-actions">
        {quantity > 0 && (
          <>
            <button className="qty-btn" onClick={() => decreaseItem(item._id)}>
              −
            </button>
            <span className="qty-value">{quantity}</span>
          </>
        )}
        <button
          className="qty-btn"
          onClick={() => addItem(item)}
          disabled={!item.isAvailable}
          title={!item.isAvailable ? "Currently unavailable" : "Add"}
        >
          +
        </button>
      </div>
    </div>
  );
}
