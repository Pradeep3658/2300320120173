const path = require('path');
const { createLoggerClient, createExpressLoggingMiddleware } = require(path.join(__dirname, '../../../logging_middleware'));
const env = require('../config/env');

const logger = createLoggerClient({
  baseUrl: env.logBaseUrl,
  accessToken: env.accessToken,
  stack: 'backend',
  defaultPackage: 'notification-app-be',
});

const requestLogger = createExpressLoggingMiddleware(logger, { packageName: 'http' });

module.exports = {
  logger,
  requestLogger,
};
