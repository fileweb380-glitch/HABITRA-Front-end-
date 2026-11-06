import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-user">
        <User size={18} />
        <span className="user-name">{user?.name || 'User'}</span>
      </div>
      <button onClick={logout} className="btn-logout" title="Sign out">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </header>
  );
}