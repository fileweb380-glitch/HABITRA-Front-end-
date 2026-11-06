import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '400px', background: 'white', position: 'relative' }}>
        {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}