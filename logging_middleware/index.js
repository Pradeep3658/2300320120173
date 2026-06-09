const axios = require('axios');

const DEFAULT_BASE_URL = 'http://20.244.56.144/evaluation-service';
const DEFAULT_TIMEOUT = 1000;

function createLoggerClient({ baseUrl = DEFAULT_BASE_URL, accessToken, stack = 'backend', defaultPackage = 'core' } = {}) {
  const client = axios.create({
    baseURL: baseUrl,
    timeout: DEFAULT_TIMEOUT,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });

  async function sendLog(level, pkg, message) {
    const payload = {
      stack,
      level,
      package: pkg || defaultPackage,
      message,
    };

    try {
      await client.post('/logs', payload);
      return true;
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.name === 'AbortError' || /timeout/i.test(error.message || '')) {
        return false;
      }

      const status = error.response?.status;
      const detail = status ? `status ${status}` : error.message;
      console.error(`[LOGGER:${stack}] ${payload.package} - ${payload.message} (${detail})`);
      return false;
    }
  }

  return {
    info: (pkg, message) => sendLog('info', pkg, message),
    warn: (pkg, message) => sendLog('warn', pkg, message),
    error: (pkg, message) => sendLog('error', pkg, message),
  };
}

function createExpressLoggingMiddleware(logger, options = {}) {
  const defaultPackage = options.packageName || 'request';

  return function expressLoggingMiddleware(req, res, next) {
    const startedAt = Date.now();
    const requestTag = `${req.method} ${req.originalUrl}`;

    logger.info(defaultPackage, `Incoming request ${requestTag}`);

    res.on('finish', () => {
      const duration = Date.now() - startedAt;
      const message = `Completed ${requestTag} with ${res.statusCode} in ${duration}ms`;
      if (res.statusCode >= 500) {
        logger.error(defaultPackage, message);
      } else if (res.statusCode >= 400) {
        logger.warn(defaultPackage, message);
      } else {
        logger.info(defaultPackage, message);
      }
    });

    next();
  };
}

function createBrowserLogger({ accessToken, stack = 'frontend', baseUrl = DEFAULT_BASE_URL } = {}) {
  return async function browserLog(level, pkg, message) {
    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    try {
      const response = await fetch(`${baseUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      return response.ok;
    } catch (error) {
      console.error(`[LOGGER:${stack}] ${pkg} - ${message}`, error);
      return false;
    }
  };
}

module.exports = {
  createLoggerClient,
  createExpressLoggingMiddleware,
  createBrowserLogger,
};
