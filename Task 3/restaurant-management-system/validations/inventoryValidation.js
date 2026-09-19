const { body } = require("express-validator");

exports.addInventoryRules = [
  body("itemName").notEmpty().withMessage("itemName is required"),
  body("unit").notEmpty().withMessage("unit is required"),
  body("quantityInStock").isFloat({ min: 0 }).withMessage("quantityInStock must be >= 0"),
  body("reorderThreshold")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("reorderThreshold must be >= 0"),
];
