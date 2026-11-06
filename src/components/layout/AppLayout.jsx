import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNavigation from './BottomNavigation';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main-content">
        <Topbar />
        <main className="app-page-body">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
}