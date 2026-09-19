import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ menuItem: {...}, quantity }]
  const [table, setTable] = useState(null);

  const addItem = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem._id === menuItem._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem._id === menuItem._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const decreaseItem = (menuItemId) => {
    setItems((prev) =>
      prev
        .map((i) => (i.menuItem._id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),
    [items]
  );

  const getQuantity = (menuItemId) =>
    items.find((i) => i.menuItem._id === menuItemId)?.quantity || 0;

  return (
    <CartContext.Provider
      value={{ items, addItem, decreaseItem, clearCart, total, getQuantity, table, setTable }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
