// src/components/Layout.jsx
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Home, Shield, Heart, User } from 'lucide-react';
import './Layout.css';

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { icon: Home, label: 'Home', page: 'Home' },
    { icon: Shield, label: 'Safety', page: 'StartTrip' },
    { icon: Heart, label: 'Wellness', page: 'Wellness' },
    { icon: User, label: 'Profile', page: 'Settings' },
  ];

  return (
    <div className="layout-root">
      <main className="layout-main">
        {children}
      </main>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;

            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon-wrap">
                  <Icon size={22} />
                </div>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
