const Order = require("../models/Order");
const { getLowStockItems } = require("./inventoryService");

const getDailySales = async (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const orders = await Order.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "cancelled" },
  });

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    date: startOfDay.toISOString().split("T")[0],
    totalOrders: orders.length,
    totalSales,
  };
};

const getStockAlerts = async () => {
  const lowStockItems = await getLowStockItems();
  return lowStockItems.map((item) => ({
    itemName: item.itemName,
    quantityInStock: item.quantityInStock,
    reorderThreshold: item.reorderThreshold,
  }));
};

module.exports = { getDailySales, getStockAlerts };
