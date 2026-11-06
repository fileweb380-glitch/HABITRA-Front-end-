import React, { useState, useEffect } from 'react';
import { reportService } from '../features/reports/reportService';
import { getCurrentDateString } from '../lib/dateTime';

export default function DailyReportPage() {
  const [date, setDate] = useState(getCurrentDateString());
  const [report, setReport] = useState(null);

  useEffect(() => {
    reportService.getDailyReport(date)
      .then(res => setReport(res))
      .catch(err => console.error(err));
  }, [date]);

  return (
    <div className="container">
      <h2>Daily Report</h2>
      <div className="card" style={{ margin: '1rem 0' }}>
        <label style={{ fontWeight: 500, marginRight: '1rem' }}>Date:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }} />
      </div>
      {report && (
        <div className="card">
          <h3>Summary for {report.date}</h3>
          <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            Completion Rate: <strong>{report.completionRate}%</strong> ({report.completedCount} of {report.totalEligible} completed)
          </p>
        </div>
      )}
    </div>
  );
}