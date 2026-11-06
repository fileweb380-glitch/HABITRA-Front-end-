import React from 'react';

export default function Input({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</span>}
    </div>
  );
}