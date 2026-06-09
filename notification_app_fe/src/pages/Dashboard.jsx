import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { logInfo } from '../utils/logger';
import { getTopPriorityNotifications } from '../utils/priorityNotifications';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, unread: 0, latest: [], priority: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      void logInfo('dashboard', 'Dashboard page loaded');
      try {
        const result = await apiRequest('/notifications');
        if (!isMounted) return;
        const notifications = result.data || [];
        const priorityNotifications = getTopPriorityNotifications(notifications, 10);
        void logInfo('priority-notifications', `Calculated top priority notifications (${priorityNotifications.length})`);
        const unread = notifications.filter((item) => !item.read).length;
        setStats({
          total: notifications.length,
          unread,
          latest: notifications.slice(0, 3),
          priority: priorityNotifications,
        });
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page">
      <div className="hero card">
        <div>
          <span className="eyebrow">Notification Hub</span>
          <h2>Operational control for notification traffic.</h2>
          <p>
            Monitor delivery state, create new notifications, and keep the evaluation logger informed on every key action.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button primary" to="/create">
            Create Notification
          </Link>
          <Link className="button secondary" to="/notifications">
            View Notifications
          </Link>
        </div>
      </div>

      {loading ? <div className="card muted">Loading dashboard data...</div> : null}
      {error ? <div className="card error">{error}</div> : null}

      <div className="stats-grid">
        <article className="card stat-card">
          <span>Total Notifications</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="card stat-card">
          <span>Unread Notifications</span>
          <strong>{stats.unread}</strong>
        </article>
        <article className="card stat-card">
          <span>Logging Status</span>
          <strong>Connected</strong>
        </article>
      </div>

      <div className="card">
        <div className="section-heading">
          <h3>Top 10 Priority Notifications</h3>
        </div>
        <div className="priority-list">
          {stats.priority.length === 0 ? <p className="muted-text">No priority notifications available yet.</p> : null}
          {stats.priority.map((item) => (
            <article className="priority-item" key={item.id}>
              <div className="priority-main">
                <h4>{item.title}</h4>
                <div className="priority-meta">
                  <span className="pill priority-type">{item.type}</span>
                  <span className="priority-score">Score: {item.score.toFixed(3)}</span>
                </div>
              </div>
              <span className={item.read ? 'pill success' : 'pill warning'}>{item.read ? 'Read' : 'Unread'}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-heading">
          <h3>Recent Notifications</h3>
          <Link to="/notifications">Open list</Link>
        </div>
        <div className="notification-stack">
          {stats.latest.length === 0 ? <p className="muted-text">No notifications available yet.</p> : null}
          {stats.latest.map((item) => (
            <article className="notification-item" key={item.id}>
              <div>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
              <span className={item.read ? 'pill success' : 'pill warning'}>{item.read ? 'Read' : 'Unread'}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
