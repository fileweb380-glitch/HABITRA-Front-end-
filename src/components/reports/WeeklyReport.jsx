import React from 'react';

export default function WeeklyReport({ report }) {
  if (!report) return null;
  return (
    <div className="card">
      <h3>Period: {report.startDate} to {report.endDate}</h3>
      <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
        Overall Rate: <strong>{report.overallRate}%</strong> ({report.completedCount} of {report.totalEligible} completed)
      </p>
    </div>
  );
}