// Builds a simple plain-text invoice summary for an order.
// Swap this out for a PDF library (e.g. pdfkit) later if needed.
const generateInvoiceText = (order) => {
  const lines = order.items.map(
    (item) => `${item.quantity} x ${item.menuItem?.name || item.menuItem} - Rs. ${item.price * item.quantity}`
  );

  return [
    `Order ID: ${order._id}`,
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    "----------------------------",
    ...lines,
    "----------------------------",
    `Total: Rs. ${order.totalAmount}`,
  ].join("\n");
};

module.exports = { generateInvoiceText };
