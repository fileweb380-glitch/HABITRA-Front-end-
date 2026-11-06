import React from 'react';
import Button from './common/Button';

export default function NotificationPermission({ onRequest }) {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>Enable Push Notifications</strong>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive timely reminders for your commitments.</p>
      </div>
      <Button onClick={onRequest}>Enable</Button>
    </div>
  );
}