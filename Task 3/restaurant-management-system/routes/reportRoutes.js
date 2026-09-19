const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/daily-sales", protect, adminOnly, reportController.dailySalesReport);
router.get("/stock-alerts", protect, adminOnly, reportController.stockAlertReport);

module.exports = router;
