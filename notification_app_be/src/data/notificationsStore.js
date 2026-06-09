const notifications = [
  {
    id: 1,
    title: 'Welcome to Notification Hub',
    message: 'The backend is ready and wired to the shared logger.',
    createdAt: new Date().toISOString(),
    read: false,
  },
];

function getNotifications() {
  return notifications;
}

function addNotification(notification) {
  notifications.unshift(notification);
  return notification;
}

function markNotificationRead(id) {
  const item = notifications.find((notification) => notification.id === id);
  if (item) {
    item.read = true;
  }
  return item;
}

module.exports = {
  getNotifications,
  addNotification,
  markNotificationRead,
};
