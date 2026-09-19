const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", menuController.getAllMenuItems);
router.get("/:id", menuController.getMenuItemById);
router.post("/", protect, adminOnly, menuController.createMenuItem);
router.put("/:id", protect, adminOnly, menuController.updateMenuItem);
router.delete("/:id", protect, adminOnly, menuController.deleteMenuItem);

module.exports = router;
