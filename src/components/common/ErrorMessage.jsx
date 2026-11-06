import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <div style={{ color: 'var(--danger)', margin: '1rem 0', fontSize: '0.9rem' }}>{message}</div>;
}