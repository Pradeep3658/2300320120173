const { logger } = require('../utils/logger');

async function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  logger.error('errors', `${req.method} ${req.originalUrl} failed: ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
