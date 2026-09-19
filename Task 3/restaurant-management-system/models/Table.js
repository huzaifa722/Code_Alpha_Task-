const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    location: { type: String, default: "main-hall" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
