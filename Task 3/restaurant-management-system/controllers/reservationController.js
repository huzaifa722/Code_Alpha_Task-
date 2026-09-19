const Reservation = require("../models/Reservation");
const { isTableAvailable, markTableReserved } = require("../services/tableService");

exports.createReservation = async (req, res) => {
  try {
    const { table } = req.body;

    const available = await isTableAvailable(table);
    if (!available) {
      return res.status(400).json({ message: "Table is not available for reservation" });
    }

    const reservation = await Reservation.create(req.body);
    await markTableReserved(table);

    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("table");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
