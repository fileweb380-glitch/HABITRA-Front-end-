import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Repeat, FileText } from 'lucide-react';

export default function BottomNavigation() {
  const navItems = [
    { label: 'Today', path: '/', icon: LayoutDashboard },
    { label: 'Plan', path: '/plan-tomorrow', icon: Calendar },
    { label: 'Habits', path: '/habits', icon: Repeat },
    { label: 'Report', path: '/reports/daily', icon: FileText }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}