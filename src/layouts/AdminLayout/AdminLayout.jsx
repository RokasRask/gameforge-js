import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * AdminLayout - Layout component for the admin section
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
const AdminLayout = ({ children }) => {
  // Normally we would check for admin role here
  // const { user } = useContext(AuthContext);
  // if (!user || !user.isAdmin) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div className="admin-layout">
      <header className="admin-layout__header">
        <div className="admin-layout__logo">
          <Link to="/admin">GameForge.js Admin</Link>
        </div>
        <div className="admin-layout__actions">
          <Link to="/" className="admin-layout__view-site">View Site</Link>
        </div>
      </header>
      
      <div className="admin-layout__container">
        <aside className="admin-layout__sidebar">
          <nav className="admin-layout__nav">
            <ul className="admin-layout__nav-list">
              <li className="admin-layout__nav-item">
                <NavLink to="/admin" end className="admin-layout__nav-link">
                  Dashboard
                </NavLink>
              </li>
              <li className="admin-layout__nav-item">
                <NavLink to="/admin/games" className="admin-layout__nav-link">
                  Games
                </NavLink>
              </li>
              <li className="admin-layout__nav-item">
                <NavLink to="/admin/games/add" className="admin-layout__nav-link">
                  Add New Game
                </NavLink>
              </li>
              <li className="admin-layout__nav-item">
                <NavLink to="/admin/categories" className="admin-layout__nav-link">
                  Categories
                </NavLink>
              </li>
              <li className="admin-layout__nav-item">
                <NavLink to="/admin/users" className="admin-layout__nav-link">
                  Users
                </NavLink>
              </li>
              <li className="admin-layout__nav-item">
                <NavLink to="/admin/reviews" className="admin-layout__nav-link">
                  Reviews
                </NavLink>
              </li>
              <li className="admin-layout__nav-item">
                <NavLink to="/admin/settings" className="admin-layout__nav-link">
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;