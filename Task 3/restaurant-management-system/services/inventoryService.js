const Inventory = require("../models/Inventory");
const MenuItem = require("../models/MenuItem");

// Deducts raw-ingredient stock whenever a menu item is ordered.
// Throws if any ingredient does not have enough stock, so the
// order can be rejected before it's confirmed.
const deductStockForOrder = async (orderItems) => {
  // orderItems: [{ menuItem: <id>, quantity: <n> }]
  for (const orderItem of orderItems) {
    const menuItem = await MenuItem.findById(orderItem.menuItem).populate(
      "ingredients.inventoryItem"
    );
    if (!menuItem) throw new Error("Menu item not found");

    for (const ingredient of menuItem.ingredients) {
      const requiredQty = ingredient.quantityRequired * orderItem.quantity;
      const stockItem = ingredient.inventoryItem;

      if (!stockItem || stockItem.quantityInStock < requiredQty) {
        throw new Error(
          `Insufficient stock for ${stockItem ? stockItem.itemName : "an ingredient"}`
        );
      }
    }
  }

  // All checks passed — now actually deduct
  for (const orderItem of orderItems) {
    const menuItem = await MenuItem.findById(orderItem.menuItem);
    for (const ingredient of menuItem.ingredients) {
      const requiredQty = ingredient.quantityRequired * orderItem.quantity;
      await Inventory.findByIdAndUpdate(ingredient.inventoryItem, {
        $inc: { quantityInStock: -requiredQty },
      });
    }
  }
};

const getLowStockItems = async () => {
  const items = await Inventory.find();
  return items.filter((item) => item.quantityInStock <= item.reorderThreshold);
};

module.exports = { deductStockForOrder, getLowStockItems };
