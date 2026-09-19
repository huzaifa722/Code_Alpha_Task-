// Catches any error passed via next(err) or thrown in async routes
// (when combined with an async wrapper) and returns a clean JSON response.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
