const Order = require("../models/Order");
const { buildOrderItems } = require("../services/orderService");
const { deductStockForOrder } = require("../services/inventoryService");
const { isTableAvailable, markTableOccupied } = require("../services/tableService");

exports.placeOrder = async (req, res) => {
  try {
    const { table, items, orderType, createdBy } = req.body;

    // 1. If dine-in, verify the table is actually free
    if (orderType === "dine-in" && table) {
      const available = await isTableAvailable(table);
      if (!available) {
        return res.status(400).json({ message: "Selected table is not available" });
      }
    }

    // 2. Build line items + total from the current menu prices
    const { orderItems, totalAmount } = await buildOrderItems(items);

    // 3. Deduct raw-ingredient stock (throws if insufficient)
    await deductStockForOrder(orderItems);

    // 4. Create the order
    const order = await Order.create({
      table,
      items: orderItems,
      totalAmount,
      orderType,
      createdBy,
    });

    // 5. Mark the table occupied for dine-in orders
    if (orderType === "dine-in" && table) {
      await markTableOccupied(table);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("table").populate("items.menuItem");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("table")
      .populate("items.menuItem");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
