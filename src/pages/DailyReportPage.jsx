import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LoaderCircle,
  ClipboardList,
  AlertCircle,
  Send,
} from 'lucide-react';

const API_URL = 'https://habitra-backend-1.onrender.com';

const REASON_OPTIONS = [
  'Urgent happened',
  'Forgot',
  'Tired / Low energy',
  'Schedule conflict',
  'Other (specify below)'
];

const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';

  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
};

export default function DailyReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = getLocalDate();

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get('date') || today
  );
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');

  // Modal State for "Not Completed" Email Action
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [targetHabitId, setTargetHabitId] = useState('');
  const [targetHabitTitle, setTargetHabitTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedReason, setSelectedReason] = useState('Urgent happened');
  const [customReason, setCustomReason] = useState('');
  const [submittingReason, setSubmittingReason] = useState(false);

  // Detect query parameters from email click (e.g. checkinSuccess or record-reason modal)
  useEffect(() => {
    const action = searchParams.get('action');
    const habitId = searchParams.get('habitId');
    const dateParam = searchParams.get('date');
    const titleParam = searchParams.get('title');
    const checkinSuccess = searchParams.get('checkinSuccess');

    if (checkinSuccess === '1') {
      setBannerMessage('Habit check-in recorded successfully!');
    }

    if (action === 'record-reason' && habitId) {
      setTargetHabitId(habitId);
      setTargetHabitTitle(titleParam ? decodeURIComponent(titleParam) : 'your habit');
      const targetD = dateParam || today;
      setTargetDate(targetD);
      setSelectedDate(targetD);
      setShowReasonModal(true);
    }
  }, [searchParams, today]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDailyReport = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('habitra_token');

        if (!token) {
          throw new Error('Please log in again to view your daily report.');
        }

        const response = await axios.get(
          `${API_URL}/api/reports/daily`,
          {
            params: { date: selectedDate },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        setReportData(response.data);
      } catch (err) {
        if (err.code === 'ERR_CANCELED') return;

        setReportData(null);

        setError(
          err.response?.data?.error ||
          err.message ||
          'Failed to load your daily report. Please try again.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDailyReport();

    return () => controller.abort();
  }, [selectedDate]);

  const changeDateByDays = (days) => {
    const current = new Date(`${selectedDate}T12:00:00`);
    current.setDate(current.getDate() + days);

    const nextDate = getLocalDate(current);

    if (nextDate <= today) {
      setSelectedDate(nextDate);
    }
  };

  // Submit "Not Completed" Reason modal form
  const handleSubmitMissedReason = async (e) => {
    e.preventDefault();
    if (submittingReason) return;

    const trimmedCustom = customReason.trim();
    if (selectedReason === 'Other (specify below)' && !trimmedCustom) {
      alert('Please write your specific reason before submitting.');
      return;
    }

    const formattedNote = trimmedCustom
      ? `${selectedReason} — ${trimmedCustom}`
      : selectedReason;

    setSubmittingReason(true);
    try {
      const token = localStorage.getItem('habitra_token');
      await axios.post(
        `${API_URL}/api/habits/${targetHabitId}/entry`,
        {
          date: targetDate,
          outcome: 'Missed',
          note: formattedNote
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowReasonModal(false);
      setCustomReason('');
      setBannerMessage('Your reason has been saved to your Daily Report.');

      // Clean URL search params and refresh report data
      setSearchParams({ date: targetDate });
      setSelectedDate(targetDate);
    } catch (err) {
      console.error('Failed to save missed reason:', err);
      alert(err.response?.data?.error || 'Could not save your reason. Please verify your login session.');
    } finally {
      setSubmittingReason(false);
    }
  };

  const commitments = reportData?.commitments || [];
  const habitEntries = reportData?.habitEntries || [];

  const stats = [
    {
      label: 'Completion rate',
      value: `${reportData?.completionRate ?? 0}%`,
      icon: ClipboardList,
      type: 'rate',
    },
    {
      label: 'Completed',
      value: reportData?.completedCount ?? 0,
      icon: CheckCircle2,
      type: 'completed',
    },
    {
      label: 'Missed',
      value: reportData?.missedCount ?? 0,
      icon: XCircle,
      type: 'missed',
    },
    {
      label: 'Unconfirmed',
      value: reportData?.unconfirmedCount ?? 0,
      icon: HelpCircle,
      type: 'unconfirmed',
    },
  ];

  const handleRetry = () => {
    setSelectedDate((current) => current);
  };

  return (
    <main className="daily-report-page">
      <div className="daily-report-container">

        {/* Header */}
        <header className="report-header">
          <div>
            <span className="report-eyebrow">
              HABITRA / YOUR JOURNEY
            </span>

            <h1>Daily Progress Report</h1>

            <p>
              Honest reflection. Real progress. One day at a time.
            </p>
          </div>
        </header>

        {/* Success Banner */}
        {bannerMessage && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={20} />
            <span>{bannerMessage}</span>
          </div>
        )}

        {/* Date navigation */}
        <section className="report-date-card">
          <div className="date-navigation">
            <button
              type="button"
              className="date-nav-button"
              onClick={() => changeDateByDays(-1)}
              disabled={loading}
              aria-label="Previous day"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              className="today-button"
              onClick={() => setSelectedDate(today)}
              disabled={selectedDate === today || loading}
            >
              Today
            </button>

            <button
              type="button"
              className="date-nav-button"
              onClick={() => changeDateByDays(1)}
              disabled={selectedDate >= today || loading}
              aria-label="Next day"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>

          <label className="report-date-picker">
            <Calendar size={19} />

            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Choose report date"
            />
          </label>
        </section>

        <div className="report-selected-date">
          {formatDate(selectedDate)}
        </div>

        {/* Error state */}
        {error && (
          <div className="report-error" role="alert">
            <div className="report-error-icon">
              <ShieldAlert size={22} />
            </div>

            <div className="report-error-content">
              <strong>Couldn't load your report</strong>
              <p>{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="report-retry-button"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <section className="report-loading">
            <LoaderCircle className="loading-spinner" size={34} />
            <h3>Preparing your daily report</h3>
            <p>Gathering your progress and commitments...</p>
          </section>
        ) : error ? null : reportData ? (
          <div className="report-content">

            {/* Statistics */}
            <section className="report-stats">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    className={`report-stat-card ${stat.type}`}
                    key={stat.type}
                  >
                    <div className="stat-top">
                      <span>{stat.label}</span>
                      <div className="stat-icon">
                        <Icon size={20} />
                      </div>
                    </div>

                    <strong className="stat-value">
                      {stat.value}
                    </strong>
                  </article>
                );
              })}
            </section>

            {/* Habit Check-ins Section (From Email / Check-ins) */}
            {habitEntries.length > 0 && (
              <section className="outcomes-section" style={{ marginBottom: '2rem' }}>
                <div className="section-heading outcomes-heading">
                  <div className="section-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h2>Habit Check-in Logs</h2>
                    <p>Outcomes and reasons recorded for today's habits.</p>
                  </div>
                </div>

                <div className="commitments-list">
                  {habitEntries.map((entry) => {
                    const isCompleted = entry.outcome === 'Completed';
                    return (
                      <article
                        key={entry._id}
                        className={`commitment-card ${isCompleted ? 'commitment-completed' : 'commitment-missed'}`}
                      >
                        <div className="commitment-main">
                          <div className="commitment-information">
                            <h3>{entry.habit?.title || 'Habit Session'}</h3>
                            <p>
                              {entry.habit?.time ? `Scheduled: ${entry.habit.time}` : 'Flexible timing'}
                              <span className="detail-dot">•</span>
                              {entry.habit?.durationMinutes ? `${entry.habit.durationMinutes} minutes` : ''}
                            </p>
                          </div>
                          <span className={`status-badge ${isCompleted ? 'status-completed' : 'status-missed'}`}>
                            {entry.outcome}
                          </span>
                        </div>

                        {entry.note && (
                          <div className="missed-detail" style={{ marginTop: '0.75rem' }}>
                            <div className="missed-detail-title">
                              <MessageSquare size={16} />
                              <strong>Note / Reason: {entry.note}</strong>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Commitment details */}
            <section className="outcomes-section">
              <div className="section-heading outcomes-heading">
                <div className="section-icon">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h2>Detailed Outcomes</h2>
                  <p>Your commitments and their final status.</p>
                </div>
              </div>

              {commitments.length > 0 ? (
                <div className="commitments-list">
                  {commitments.map((item) => {
                    const isCompleted = item.status === 'Completed';
                    const isMissed = item.status === 'Missed';

                    return (
                      <article
                        className={`commitment-card ${
                          isCompleted
                            ? 'commitment-completed'
                            : isMissed
                            ? 'commitment-missed'
                            : 'commitment-unconfirmed'
                        }`}
                        key={item._id}
                      >
                        <div className="commitment-main">
                          <div className="commitment-information">
                            <h3>{item.title}</h3>

                            <p>
                              {item.startTime
                                ? `Scheduled: ${item.startTime}`
                                : 'Flexible timing'}

                              <span className="detail-dot">•</span>

                              {item.durationMinutes
                                ? `${item.durationMinutes} minutes`
                                : 'Flexible duration'}
                            </p>
                          </div>

                          <span
                            className={`status-badge ${
                              isCompleted
                                ? 'status-completed'
                                : isMissed
                                ? 'status-missed'
                                : 'status-unconfirmed'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {isMissed && item.missedReason && (
                          <div className="missed-detail">
                            <div className="missed-detail-title">
                              <XCircle size={16} />
                              <strong>Reason: {item.missedReason}</strong>
                            </div>

                            {item.missedNote && (
                              <p>
                                <MessageSquare size={15} />
                                <span>{item.missedNote}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                habitEntries.length === 0 && (
                  <div className="report-empty">
                    <div className="empty-icon">
                      <Calendar size={28} />
                    </div>

                    <h3>No commitments recorded</h3>

                    <p>
                      There are no commitments logged for this date.
                      Your report will appear here when you have activity.
                    </p>
                  </div>
                )
              )}
            </section>
          </div>
        ) : (
          <div className="report-empty">
            <h3>No report available</h3>
            <p>There is no report data available for this date.</p>
          </div>
        )}
      </div>

      {/* Modal: Record Reason When User Clicks "Not Completed" in Email */}
      {showReasonModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#dc2626', marginBottom: '0.5rem' }}>
              <AlertCircle size={22} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#111827' }}>Habit Not Completed</h3>
            </div>

            <p style={{ color: '#4b5563', fontSize: '0.95rem', marginTop: 0, marginBottom: '1.25rem' }}>
              What prevented you from completing <strong>"{targetHabitTitle}"</strong>?
            </p>

            <form onSubmit={handleSubmitMissedReason}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  Select a reason
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                >
                  {REASON_OPTIONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  Specific details (optional)
                </label>
                <textarea
                  rows={3}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Write what happened specifically..."
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowReasonModal(false);
                    setSearchParams({ date: selectedDate });
                  }}
                  style={{ padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReason}
                  style={{
                    padding: '0.65rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#111827',
                    color: '#ffffff',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={15} />
                  {submittingReason ? 'Saving...' : 'Save to Daily Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}