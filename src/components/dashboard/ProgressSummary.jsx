import React from 'react';

export default function ProgressSummary({ commitments }) {
  const completed = commitments.filter(c => c.status === 'Completed').length;
  const eligible = commitments.filter(c => c.status !== 'Cancelled').length;
  const rate = eligible > 0 ? Math.round((completed / eligible) * 100) : 0;

  return (
    <div className="card">
      <h3>Progress Summary</h3>
      <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
        {completed} of {eligible} commitments completed ({rate}%)
      </p>
    </div>
  );
}