const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", tableController.getAllTables);
router.get("/available", tableController.getAvailableTables);
router.post("/", protect, adminOnly, tableController.createTable);
router.patch("/:id/status", protect, tableController.updateTableStatus);
router.delete("/:id", protect, adminOnly, tableController.deleteTable);

module.exports = router;
