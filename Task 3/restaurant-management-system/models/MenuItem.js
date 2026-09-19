const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ["starter", "main-course", "dessert", "beverage", "other"],
      default: "other",
    },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    // Links this dish to the raw ingredients it consumes so stock
    // can be auto-deducted when an order is placed.
    ingredients: [
      {
        inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
        quantityRequired: { type: Number, required: true, min: 0 },
      },
    ],
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
