import React, { useEffect, useRef, useState } from 'react';
import { BellRing, X } from 'lucide-react';

export default function AlarmOverlay() {
  const [alarmData, setAlarmData] = useState(null);
  const audioRef = useRef(null);

  const triggerAlarm = (title, body) => {
    setAlarmData({ title, body });
    if (!audioRef.current) {
      audioRef.current = new Audio('/alarm.mp3');
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch(() => {
      // Browser requires one prior user interaction on the page to autoplay sound
    });
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAlarmData(null);
  };

  useEffect(() => {
    // 1. Check if opened directly from a push notification click (?alarm=1)
    const params = new URLSearchParams(window.location.search);
    if (params.get('alarm') === '1') {
      triggerAlarm('HABITRA Scheduled Alarm', 'Your scheduled commitment time is active!');
    }

    // 2. Listen for live push messages from sw.js while app is open
    const handleSWMessage = (event) => {
      if (event.data?.type === 'HABITRA_ALARM') {
        triggerAlarm(event.data.title, event.data.body);
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
      stopAlarm();
    };
  }, []);

  if (!alarmData) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(17, 17, 17, 0.88)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        color: '#111111',
        padding: '2rem',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
      }}>
        <BellRing size={44} style={{ margin: '0 auto 1rem', color: '#e11d48' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>{alarmData.title}</h3>
        <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>
          {alarmData.body}
        </p>
        <button
          onClick={stopAlarm}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#111111',
            color: '#ffffff',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '999px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <X size={18} /> Stop Alarm
        </button>
      </div>
    </div>
  );
}