const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { addInventoryRules } = require("../validations/inventoryValidation");
const validateRequest = require("../middlewares/validateRequest");

router.get("/", protect, inventoryController.getAllInventory);
router.post(
  "/",
  protect,
  adminOnly,
  addInventoryRules,
  validateRequest,
  inventoryController.addInventoryItem
);
router.put("/:id", protect, adminOnly, inventoryController.updateInventoryItem);
router.delete("/:id", protect, adminOnly, inventoryController.deleteInventoryItem);

module.exports = router;
