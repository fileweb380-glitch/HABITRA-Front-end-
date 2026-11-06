import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '6rem' }}>
      <h2>404 - Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>The page you are looking for does not exist.</p>
      <Link to="/" style={{ textDecoration: 'underline' }}>Return Home</Link>
    </div>
  );
}