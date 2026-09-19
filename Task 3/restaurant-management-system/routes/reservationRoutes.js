const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { protect } = require("../middlewares/authMiddleware");
const { createReservationRules } = require("../validations/reservationValidation");
const validateRequest = require("../middlewares/validateRequest");

router.get("/", protect, reservationController.getAllReservations);
router.post(
  "/",
  createReservationRules,
  validateRequest,
  reservationController.createReservation
);
router.patch("/:id/cancel", protect, reservationController.cancelReservation);

module.exports = router;
