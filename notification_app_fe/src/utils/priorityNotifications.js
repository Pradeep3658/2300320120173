const TYPE_WEIGHTS = {
  placement: 3,
  result: 2,
  event: 1,
};

function normalizeType(value) {
  if (!value) {
    return 'event';
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'placement') return 'placement';
  if (normalized === 'result') return 'result';
  if (normalized === 'event') return 'event';
  return 'event';
}

function getNotificationType(notification = {}) {
  const directType = normalizeType(notification.type);
  if (notification.type) {
    return directType;
  }

  const text = `${notification.title || ''} ${notification.message || ''}`.toLowerCase();
  if (text.includes('placement')) return 'placement';
  if (text.includes('result')) return 'result';
  if (text.includes('event')) return 'event';

  return 'event';
}

function calculatePriorityScore(notification = {}) {
  const type = getNotificationType(notification);
  const typeWeight = TYPE_WEIGHTS[type] || TYPE_WEIGHTS.event;
  const createdAtValue = Number(new Date(notification.createdAt || Date.now()));
  const recencyFactor = Number.isFinite(createdAtValue) ? createdAtValue / 1000000000000 : 0;

  return Number((typeWeight * 1000 + recencyFactor).toFixed(3));
}

function getTopPriorityNotifications(notifications, limit = 10) {
  return [...(notifications || [])]
    .map((notification) => ({
      ...notification,
      type: getNotificationType(notification),
      score: calculatePriorityScore(notification),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const rightTime = Number(new Date(right.createdAt || 0));
      const leftTime = Number(new Date(left.createdAt || 0));
      if (rightTime !== leftTime) {
        return rightTime - leftTime;
      }

      return Number(right.id || 0) - Number(left.id || 0);
    })
    .slice(0, limit);
}

export {
  calculatePriorityScore,
  getTopPriorityNotifications,
  getNotificationType,
};
