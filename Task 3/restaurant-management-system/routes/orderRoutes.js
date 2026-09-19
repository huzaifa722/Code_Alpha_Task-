const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const { placeOrderRules } = require("../validations/orderValidation");
const validateRequest = require("../middlewares/validateRequest");

router.get("/", protect, orderController.getAllOrders);
router.get("/:id", protect, orderController.getOrderById);
router.post("/", protect, placeOrderRules, validateRequest, orderController.placeOrder);
router.patch("/:id/status", protect, orderController.updateOrderStatus);

module.exports = router;
