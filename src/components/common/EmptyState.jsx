import React from 'react';

export default function EmptyState({ message }) {
  return <p style={{ color: 'var(--text-secondary)', padding: '1rem 0' }}>{message}</p>;
}