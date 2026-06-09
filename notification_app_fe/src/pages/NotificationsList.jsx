import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { logInfo } from '../utils/logger';

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      {loading ? <div className="card muted">Loading notifications...</div> : null}
      {error ? <div className="card error">{error}</div> : null}

      <div className="stack">
        {notifications.map((item) => (
          <article className="card notification-row" key={item.id}>
            <div>
              <div className="row-top">
                <h3>{item.title}</h3>
                <span className={item.read ? 'pill success' : 'pill warning'}>{item.read ? 'Read' : 'Unread'}</span>
              </div>
              <p>{item.message}</p>
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
