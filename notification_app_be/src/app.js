const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const notificationRoutes = require('./routes/notificationRoutes');
const { logger, requestLogger } = require('./utils/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  logger.info('health', 'Health check requested');
  res.json({
    success: true,
    message: 'Notification backend is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/notifications', notificationRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
