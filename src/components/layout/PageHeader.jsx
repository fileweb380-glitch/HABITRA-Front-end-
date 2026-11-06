import React from 'react';

export default function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2>{title}</h2>
      {subtitle && <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{subtitle}</p>}
    </div>
  );
}