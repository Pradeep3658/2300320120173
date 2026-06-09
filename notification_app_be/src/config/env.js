const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: Number(process.env.PORT || 5000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  accessToken: process.env.AFFORDMED_ACCESS_TOKEN || '',
  logBaseUrl: process.env.AFFORDMED_LOG_BASE_URL || 'http://20.244.56.144/evaluation-service',
};

module.exports = env;
