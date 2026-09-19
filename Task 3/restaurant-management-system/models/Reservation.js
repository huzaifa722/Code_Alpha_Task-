const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    guests: { type: Number, required: true, min: 1 },
    reservationDate: { type: Date, required: true },
    reservationTime: { type: String, required: true }, // e.g. "19:30"
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
