const MenuItem = require("../models/MenuItem");

// Calculates the total for an order and attaches a price snapshot
// to each line item (so later menu price changes don't affect old orders).
const buildOrderItems = async (items) => {
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItem);
    if (!menuItem) throw new Error(`Menu item ${item.menuItem} not found`);
    if (!menuItem.isAvailable) throw new Error(`${menuItem.name} is currently unavailable`);

    const lineTotal = menuItem.price * item.quantity;
    totalAmount += lineTotal;

    orderItems.push({
      menuItem: menuItem._id,
      quantity: item.quantity,
      price: menuItem.price,
    });
  }

  return { orderItems, totalAmount };
};

module.exports = { buildOrderItems };
