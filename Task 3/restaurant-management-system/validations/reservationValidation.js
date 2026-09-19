const { body } = require("express-validator");

exports.createReservationRules = [
  body("customerName").notEmpty().withMessage("customerName is required"),
  body("customerPhone").notEmpty().withMessage("customerPhone is required"),
  body("table").notEmpty().withMessage("table id is required"),
  body("guests").isInt({ min: 1 }).withMessage("guests must be at least 1"),
  body("reservationDate").isISO8601().withMessage("reservationDate must be a valid date"),
  body("reservationTime").notEmpty().withMessage("reservationTime is required"),
];
