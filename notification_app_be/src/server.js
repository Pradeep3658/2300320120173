const app = require('./app');
const env = require('./config/env');
const { logger } = require('./utils/logger');

app.listen(env.port, async () => {
  logger.info('startup', `Backend started on port ${env.port}`);
  console.log(`Server running on http://localhost:${env.port}`);
});
