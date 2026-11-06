import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="card" style={{ background: '#e8f5e9', borderColor: '#c8e6c9', color: '#2e7d32', marginBottom: '1rem' }}>
      {message}
    </div>
  );
}