import React from 'react';
import Button from './common/Button';

export default function NotificationPermission({ onRequest }) {
  const handleEnable = async () => {
    try {
      // 1. Check if browser supports notifications & service workers
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        alert('Push notifications are not supported by your browser.');
        return;
      }

      // 2. Request permission from user
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permission for notifications was denied.');
        return;
      }

      // 3. Get the active service worker registration
      const registration = await navigator.serviceWorker.ready;

      // 4. Subscribe the user (Replace with your public VAPID key)
      // Note: You can generate VAPID keys using the `web-push` npm package
      const publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY_HERE';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey
      });

      // 5. Send subscription to your backend database
      const token = localStorage.getItem('token'); // Or your auth token storage
      const response = await fetch('https://habitra-backend-1.onrender.com/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        alert('Push notifications enabled successfully!');
        if (onRequest) onRequest();
      } else {
        alert('Failed to save notification subscription on the server.');
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      alert('An error occurred while enabling notifications.');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>Enable Push Notifications</strong>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive timely reminders for your commitments.</p>
      </div>
      <Button onClick={handleEnable}>Enable</Button>
    </div>
  );
}