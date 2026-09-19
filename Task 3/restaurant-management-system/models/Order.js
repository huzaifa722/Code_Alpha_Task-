const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // snapshot of price at order time
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "completed", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true, default: 0 },
    orderType: { type: String, enum: ["dine-in", "takeaway", "delivery"], default: "dine-in" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
