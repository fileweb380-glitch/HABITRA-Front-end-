import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', style = {}, ...props }) {
  const bg = variant === 'secondary' ? 'var(--text-secondary)' : 'var(--accent)';
  return (
    <button type={type} onClick={onClick} className="btn" style={{ background: bg, ...style }} {...props}>
      {children}
    </button>
  );
}