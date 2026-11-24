
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Repeat,
  Calendar,
  FileText,
  BarChart2,
  Settings
} from 'lucide-react';

const allItems = [
  { label: 'Today', path: '/', icon: LayoutDashboard },
  { label: 'Plan Tomorrow', path: '/plan-tomorrow', icon: Calendar },
  { label: 'Habits', path: '/habits', icon: Repeat },
  { label: 'Goals', path: '/goals', icon: Target },
  { label: 'Daily Report', path: '/reports/daily', icon: FileText },
  { label: 'Weekly Report', path: '/reports/weekly', icon: BarChart2 },
  { label: 'Settings', path: '/settings', icon: Settings }
];

const mobileItems = allItems.slice(0, 4);

function NavigationLinks({ items }) {
  return items.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/'}
        title={item.label}
        className={({ isActive }) =>
          `sidebar-link ${isActive ? 'active' : ''}`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={20}
              strokeWidth={isActive ? 2.6 : 1.8}
            />
            <span>{item.label}</span>
          </>
        )}
      </NavLink>
    );
  });
}

export default function Sidebar() {
  return (
    <aside className="habitra-sidebar">

      <div className="sidebar-brand">
        <div className="brand-mark">H</div>
        <h2>HABITRA</h2>
      </div>

      <nav className="sidebar-navigation desktop-navigation">
        <p className="sidebar-label">WORKSPACE</p>
        <NavigationLinks items={allItems} />
      </nav>

      <nav
        className="sidebar-navigation mobile-navigation"
        aria-label="Main navigation"
      >
        <NavigationLinks items={mobileItems} />
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-quote">
          <span className="quote-icon">✦</span>
          <p>Small steps. Consistent progress.</p>
        </div>

        <div className="sidebar-version">
          HABITRA <span>•</span> YOUR DAILY SYSTEM
        </div>
      </div>

    </aside>
  );
}
