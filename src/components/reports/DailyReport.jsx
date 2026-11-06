import React from 'react';

export default function DailyReport({ report }) {
  if (!report) return null;
  return (
    <div className="card">
      <h3>Summary for {report.date}</h3>
      <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
        Completion Rate: <strong>{report.completionRate}%</strong> ({report.completedCount} of {report.totalEligible} completed)
      </p>
    </div>
  );
}