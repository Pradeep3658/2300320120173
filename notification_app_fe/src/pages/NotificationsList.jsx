import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { logInfo } from '../utils/logger';
import { calculatePriorityScore, getTopPriorityNotifications, getNotificationType } from '../utils/priorityNotifications';

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  async function loadNotifications() {
    try {
      const result = await apiRequest('/notifications');
      setNotifications(result.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void logInfo('notifications-list', 'Notifications list page loaded');
    loadNotifications();
  }, []);

  async function markAsRead(id) {
    try {
      void logInfo('notifications-list', `Mark as read clicked for ${id}`);
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
      await loadNotifications();
    } catch (error) {
      setError(error.message);
    }
  }

  function handleFilterChange(nextFilter) {
    setFilter(nextFilter);
    void logInfo('notifications-list', `Filter changed to ${nextFilter}`);
  }

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') {
      return true;
    }

    return getNotificationType(item) === filter;
  });

  const visibleNotifications = getTopPriorityNotifications(filteredNotifications, filteredNotifications.length);

  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Notifications</span>
          <h2>All notifications in one place</h2>
        </div>
        <button className="button secondary" onClick={loadNotifications} type="button">
          Refresh
        </button>
      </div>

      <div className="card filter-card">
        <div className="section-heading">
          <h3>Filter Notifications</h3>
        </div>
        <div className="filter-group">
          {['all', 'placement', 'result', 'event'].map((option) => (
            <button
              key={option}
              type="button"
              className={filter === option ? 'button primary filter-button active' : 'button secondary filter-button'}
              onClick={() => handleFilterChange(option)}
            >
              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="card muted">Loading notifications...</div> : null}
      {error ? <div className="card error">{error}</div> : null}

      <div className="stack">
        {visibleNotifications.map((item) => (
          <article className="card notification-row" key={item.id}>
            <div>
              <div className="row-top">
                <h3>{item.title}</h3>
                <div className="row-top-meta">
                  <span className="pill priority-type">{getNotificationType(item)}</span>
                  <span className={item.read ? 'pill success' : 'pill warning'}>{item.read ? 'Read' : 'Unread'}</span>
                </div>
              </div>
              <p>{item.message}</p>
              <small>Priority score: {calculatePriorityScore(item).toFixed(3)}</small>
              <small>Created at {new Date(item.createdAt).toLocaleString()}</small>
            </div>
            {!item.read ? (
              <button className="button primary" onClick={() => markAsRead(item.id)} type="button">
                Mark as read
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotificationsList;
