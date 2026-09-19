const { body } = require("express-validator");

exports.placeOrderRules = [
  body("items").isArray({ min: 1 }).withMessage("Order must have at least one item"),
  body("items.*.menuItem").notEmpty().withMessage("menuItem id is required"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("quantity must be at least 1"),
  body("orderType")
    .optional()
    .isIn(["dine-in", "takeaway", "delivery"])
    .withMessage("Invalid order type"),
];
