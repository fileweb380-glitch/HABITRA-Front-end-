import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Repeat, Calendar, FileText, BarChart2, Settings } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { label: 'Today', path: '/', icon: LayoutDashboard },
    { label: 'Plan Tomorrow', path: '/plan-tomorrow', icon: Calendar },
    { label: 'Habits', path: '/habits', icon: Repeat },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Daily Report', path: '/reports/daily', icon: FileText },
    { label: 'Weekly Report', path: '/reports/weekly', icon: BarChart2 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside style={{ width: '260px', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '1.75rem 1.25rem' }}>
      <div style={{ marginBottom: '2.5rem', paddingLeft: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.03em', fontWeight: 800 }}>HABITRA</h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius)',
                color: isActive ? '#171717' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem',
                transition: 'background-color 0.15s ease'
              })}
              end={item.path === '/'}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}