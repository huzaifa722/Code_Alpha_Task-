const { getDailySales, getStockAlerts } = require("../services/reportService");

exports.dailySalesReport = async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const report = await getDailySales(date);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.stockAlertReport = async (req, res) => {
  try {
    const alerts = await getStockAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
