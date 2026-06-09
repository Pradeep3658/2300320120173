import { NavLink } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">NC</span>
          <div>
            <h1>Notification Control</h1>
            <p>AffordMed evaluation dashboard</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Notifications List
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Create Notification Form
          </NavLink>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

export default Layout;
