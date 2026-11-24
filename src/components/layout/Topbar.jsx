
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { NavLink } from 'react-router-dom';

import {
  LogOut,
  User,
  Settings,
  FileText,
  BarChart2,
  ChevronDown
} from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userName = user?.name || 'User';

  const menuItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Daily Report', path: '/reports/daily', icon: FileText },
    { label: 'Weekly Report', path: '/reports/weekly', icon: BarChart2 }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="habitra-topbar">

      <div className="topbar-left">
        <div className="topbar-status">
          <span className="status-dot"></span>
          <span>Your personal workspace</span>
        </div>
      </div>

      <div className="topbar-right">

        <div className="profile-menu-wrapper" ref={menuRef}>

          <button
            type="button"
            className={`topbar-user ${menuOpen ? 'menu-active' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-role">Personal Account</span>
            </div>

            <ChevronDown
              size={16}
              className={`user-chevron ${menuOpen ? 'rotated' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className="profile-dropdown">

              <div className="dropdown-heading">
                <span>YOUR ACCOUNT</span>
              </div>

              {menuItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `dropdown-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}

            </div>
          )}

        </div>

        <div className="topbar-divider"></div>

        <button
          type="button"
          onClick={logout}
          className="btn-logout"
          title="Sign out"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
}
