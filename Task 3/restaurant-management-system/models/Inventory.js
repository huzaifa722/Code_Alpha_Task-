const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, unique: true, trim: true },
    unit: { type: String, required: true, default: "kg" }, // kg, litre, pcs, etc.
    quantityInStock: { type: Number, required: true, default: 0, min: 0 },
    reorderThreshold: { type: Number, required: true, default: 5 },
    supplier: { type: String },
  },
  { timestamps: true }
);

// Convenience flag used by reporting/stock-alert logic
inventorySchema.virtual("isLowStock").get(function () {
  return this.quantityInStock <= this.reorderThreshold;
});
inventorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Inventory", inventorySchema);
