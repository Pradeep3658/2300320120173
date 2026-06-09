const asyncHandler = require('../utils/asyncHandler');
const { logger } = require('../utils/logger');
const {
  getNotifications,
  addNotification,
  markNotificationRead,
} = require('../data/notificationsStore');

function isValidNotificationPayload(payload) {
  return payload && typeof payload.title === 'string' && payload.title.trim() && typeof payload.message === 'string' && payload.message.trim();
}

const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = getNotifications();
  logger.info('notifications', `Fetched ${notifications.length} notifications`);
  res.json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

const createNotification = asyncHandler(async (req, res) => {
  if (!isValidNotificationPayload(req.body)) {
    logger.warn('notifications', 'Rejected invalid notification payload');
    return res.status(400).json({
      success: false,
      message: 'title and message are required',
    });
  }

  const notification = {
    id: Date.now(),
    title: req.body.title.trim(),
    message: req.body.message.trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  addNotification(notification);
  logger.info('notifications', `Created notification ${notification.id}`);

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification,
  });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notificationId = Number(req.params.id);
  const notification = markNotificationRead(notificationId);

  if (!notification) {
    logger.warn('notifications', `Notification ${notificationId} not found for read update`);
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  logger.info('notifications', `Marked notification ${notificationId} as read`);
  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

module.exports = {
  getAllNotifications,
  createNotification,
  markAsRead,
};
