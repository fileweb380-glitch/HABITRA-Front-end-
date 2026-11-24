
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Lock,
  Target,
  TrendingUp,
  Sparkles,
  LoaderCircle,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';


const API_URL = 'https://habitra-backend-1.onrender.com/api';

const reflectionQuestions = [
  {
    key: 'wentWell',
    number: '01',
    title: 'What went well this week?',
    description: 'Recognize your progress and positive moments.',
    placeholder: 'Celebrate your wins and consistent moments...'
  },
  {
    key: 'struggledWith',
    number: '02',
    title: 'What did I struggle with?',
    description: 'Identify obstacles that made things difficult.',
    placeholder: 'What challenged you or interrupted your progress?'
  },
  {
    key: 'accomplishments',
    number: '03',
    title: 'What did I accomplish?',
    description: 'Record the meaningful things you achieved.',
    placeholder: 'Write down your milestones and achievements...'
  },
  {
    key: 'improve',
    number: '04',
    title: 'What would I like to improve?',
    description: 'Think about one or two things you can do better.',
    placeholder: 'What would you like to approach differently?'
  },
  {
    key: 'priorities',
    number: '05',
    title: 'What are my priorities for next week?',
    description: 'Choose what deserves your attention next.',
    placeholder: 'List your most important priorities for next week...'
  }
];

const initialReflection = {
  wentWell: '',
  struggledWith: '',
  accomplishments: '',
  improve: '',
  priorities: ''
};

export default function WeeklyReportPage() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [reflection, setReflection] = useState(initialReflection);

  const [isLocked, setIsLocked] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const fetchWeeklyReport = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('habitra_token');

      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const res = await axios.get(`${API_URL}/reports/weekly`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = res.data;
      setWeeklyData(data);

      if (data?.reflection) {
        setReflection({
          wentWell: data.reflection.wentWell || '',
          struggledWith: data.reflection.struggledWith || '',
          accomplishments: data.reflection.accomplishments || '',
          improve: data.reflection.improve || '',
          priorities: data.reflection.priorities || ''
        });

        const savedDate = new Date(data.reflection.createdAt);
        const now = new Date();

        if (!Number.isNaN(savedDate.getTime())) {
          const diffDays =
            (now.getTime() - savedDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (diffDays >= 0 && diffDays < 7) {
            const remaining = Math.ceil(7 - diffDays);
            setIsLocked(true);
            setDaysRemaining(remaining);
          } else {
            setIsLocked(false);
            setDaysRemaining(0);
          }
        } else {
          setIsLocked(false);
          setDaysRemaining(0);
        }
      } else {
        setReflection(initialReflection);
        setIsLocked(false);
        setDaysRemaining(0);
      }
    } catch (err) {
      console.error('Weekly report error:', err);

      alert(
        err.response?.data?.error ||
        err.message ||
        'Failed to load your weekly report. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyReport();
  }, [fetchWeeklyReport]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setReflection((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSaveReflection = async (e) => {
    e.preventDefault();

    if (isLocked || saving) return;

    const hasEmptyField = Object.values(reflection).some(
      (value) => !value.trim()
    );

    if (hasEmptyField) {
      alert('Please complete all five reflection questions.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('habitra_token');

      if (!token) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const res = await axios.post(
        `${API_URL}/reports/weekly/reflection`,
        reflection,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsLocked(true);
      setDaysRemaining(7);

      alert(res.data?.message || 'Your weekly reflection was saved successfully!');

      // Refresh the report to get the latest server data.
      await fetchWeeklyReport();
    } catch (err) {
      console.error('Save reflection error:', err);

      alert(
        err.response?.data?.error ||
        err.message ||
        'Failed to save your weekly reflection. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="weekly-page">
        <div className="weekly-loading">
          <div className="weekly-loading-icon">
            <LoaderCircle size={30} />
          </div>

          <h2>Preparing your weekly report</h2>
          <p>Gathering your progress and achievements...</p>
        </div>
      </main>
    );
  }

  const completionRate = Number(weeklyData?.completionRate) || 0;
  const completedCommitments =
    Number(weeklyData?.completedCommitments) || 0;
  const completedHabits = Number(weeklyData?.completedHabits) || 0;

  const safeCompletionRate = Math.min(
    100,
    Math.max(0, completionRate)
  );

  return (
    <main className="weekly-page">
      <div className="weekly-container">

        {/* Page Header */}
        <header className="weekly-header">
          <div className="weekly-header-content">
            <div className="weekly-eyebrow">
              <CalendarDays size={15} />
              YOUR WEEKLY OVERVIEW
            </div>

            <h1>
              Your progress,
              <span> one week at a time.</span>
            </h1>

            <p>
              Take a moment to understand your journey, celebrate
              your progress, and prepare for a stronger week ahead.
            </p>
          </div>

          <div className="weekly-header-decoration">
            <div className="weekly-decoration-circle">
              <Sparkles size={35} />
            </div>
          </div>
        </header>

        {/* Section Heading */}
        <section className="weekly-section-heading">
          <div>
            <span className="weekly-section-label">YOUR PERFORMANCE</span>
            <h2>This week's overview</h2>
            <p>A simple look at your consistency and completed work.</p>
          </div>

          <button
            type="button"
            className="weekly-refresh-button"
            onClick={fetchWeeklyReport}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh report
          </button>
        </section>

        {/* Metrics */}
        <section className="weekly-stats-grid">
          <article className="weekly-stat-card weekly-stat-primary">
            <div className="weekly-stat-top">
              <div className="weekly-stat-icon">
                <TrendingUp size={21} />
              </div>
              <span className="weekly-stat-caption">CONSISTENCY</span>
            </div>

            <div className="weekly-stat-value">
              {safeCompletionRate}%
            </div>

            <div className="weekly-progress-track">
              <div
                className="weekly-progress-fill"
                style={{ width: `${safeCompletionRate}%` }}
              />
            </div>

            <p>Weekly completion rate</p>
          </article>

          <article className="weekly-stat-card">
            <div className="weekly-stat-top">
              <div className="weekly-stat-icon weekly-icon-sage">
                <CheckCircle2 size={21} />
              </div>
              <span className="weekly-stat-caption">COMMITMENTS</span>
            </div>

            <div className="weekly-stat-value">
              {completedCommitments}
            </div>

            <p>Commitments completed</p>
          </article>

          <article className="weekly-stat-card">
            <div className="weekly-stat-top">
              <div className="weekly-stat-icon weekly-icon-gold">
                <Target size={21} />
              </div>
              <span className="weekly-stat-caption">HABITS</span>
            </div>

            <div className="weekly-stat-value">
              {completedHabits}
            </div>

            <p>Habits successfully completed</p>
          </article>
        </section>

        {/* Reflection Section */}
        <section className="weekly-reflection-card">
          <div className="weekly-reflection-header">
            <div className="weekly-reflection-heading">
              <div className="weekly-reflection-icon">
                <FileText size={22} />
              </div>

              <div>
                <span className="weekly-section-label">
                  PERSONAL REVIEW
                </span>
                <h2>Weekly reflection</h2>
                <p>
                  Five questions to help you learn from this week.
                </p>
              </div>
            </div>

            {isLocked && (
              <div className="weekly-lock-badge">
                <Lock size={14} />
                Locked
              </div>
            )}
          </div>

          {isLocked && (
            <div className="weekly-locked-notice">
              <div className="weekly-locked-icon">
                <Lock size={19} />
              </div>

              <div>
                <strong>Your reflection is protected.</strong>
                <p>
                  You have already completed this review.
                  Your answers will become available for editing
                  when the next review window opens in{' '}
                  <strong>{daysRemaining} day(s)</strong>.
                </p>
              </div>
            </div>
          )}

          {!isLocked && (
            <div className="weekly-reflection-tip">
              <Sparkles size={17} />
              Be honest with yourself. Progress comes from
              understanding, not perfection.
            </div>
          )}

          <form
            className="weekly-reflection-form"
            onSubmit={handleSaveReflection}
          >
            {reflectionQuestions.map((question) => (
              <div
                className="weekly-question"
                key={question.key}
              >
                <div className="weekly-question-heading">
                  <span className="weekly-question-number">
                    {question.number}
                  </span>

                  <div>
                    <label htmlFor={question.key}>
                      {question.title}
                    </label>
                    <p>{question.description}</p>
                  </div>
                </div>

                <textarea
                  id={question.key}
                  name={question.key}
                  rows={3}
                  value={reflection[question.key]}
                  onChange={handleChange}
                  disabled={isLocked || saving}
                  required
                  placeholder={question.placeholder}
                />
              </div>
            ))}

            <div className="weekly-form-footer">
              <div className="weekly-form-note">
                <Lock size={15} />
                {isLocked
                  ? `Available again in ${daysRemaining} day(s)`
                  : 'Your reflection locks for 7 days after saving.'}
              </div>

              <button
                type="submit"
                className="weekly-save-button"
                disabled={isLocked || saving}
              >
                {saving ? (
                  <>
                    <LoaderCircle className="weekly-spin" size={18} />
                    Saving...
                  </>
                ) : isLocked ? (
                  <>
                    <Lock size={17} />
                    Reflection locked
                  </>
                ) : (
                  <>
                    Save weekly reflection
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Bottom Message */}
        <section className="weekly-bottom-message">
          <div className="weekly-bottom-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <h3>Every week is another opportunity.</h3>
            <p>
              You don't need a perfect week. You need to keep
              learning, adjusting, and showing up.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
