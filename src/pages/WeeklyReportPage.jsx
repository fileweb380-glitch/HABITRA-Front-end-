import React, { useState, useEffect } from 'react';
import { reportService } from '../features/reports/reportService';
import { getCurrentDateString } from '../lib/dateTime';

export default function WeeklyReportPage() {
  const getDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  };

  const [range, setRange] = useState(getDates());
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportService.getWeeklyReport(range.start, range.end)
      .then(res => setReport(res))
      .catch(err => console.error(err));
  }, [range]);

  return (
    <div className="container">
      <h2>Weekly Report</h2>
      {report && (
        <div className="card">
          <h3>Period: {report.startDate} to {report.endDate}</h3>
          <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            Overall Rate: <strong>{report.overallRate}%</strong> ({report.completedCount} of {report.totalEligible} completed)
          </p>
        </div>
      )}
    </div>
  );
}