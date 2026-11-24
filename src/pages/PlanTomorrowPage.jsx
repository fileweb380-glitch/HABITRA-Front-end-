
import React, { useState } from 'react';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Timer,
  Sparkles
} from 'lucide-react';
import axios from 'axios';


const API_URL = 'https://habitra-backend-1.onrender.com/api/commitments';

const categories = [
  'Learning and education',
  'Health and exercise',
  'Work and business',
  'Personal projects',
  'Rest and free time'
];

export default function PlanTomorrowPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal projects');

  const [scheduledTime, setScheduledTime] = useState('06:00');
  const [durationMinutes, setDurationMinutes] = useState('20');

  const [isFlexibleTime, setIsFlexibleTime] = useState(false);
  const [isFlexibleDuration, setIsFlexibleDuration] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

// Calculate tomorrow using local date, not UTC.
const getTomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrowStr = getTomorrowDate();

const formattedTomorrow = tomorrow.toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
});

const handleAddCommitment = async (e) => {
  e.preventDefault();

  const trimmedTitle = title.trim();

  // Validate commitment title.
  if (!trimmedTitle) {
    alert('⚠️ Please enter a commitment title.');
    return;
  }

  // Validate duration.
  if (!isFlexibleDuration) {
    const duration = Number(durationMinutes);

    if (!Number.isInteger(duration) || duration < 5 || duration > 480) {
      alert('⚠️ Duration must be between 5 and 480 minutes.');
      return;
    }
  }

  // Validate scheduled time.
  if (!isFlexibleTime && !scheduledTime) {
    alert('⚠️ Please select a scheduled time or enable Flexible Time.');
    return;
  }

  // Check authentication.
  const token = localStorage.getItem('habitra_token');

  if (!token) {
    alert('🔒 Your session has expired. Please log in again.');
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await axios.post(
      API_URL,
      {
        title: trimmedTitle,
        description: description.trim(),
        category,
        date: tomorrowStr,
        time: isFlexibleTime ? null : scheduledTime,
        durationMinutes: isFlexibleDuration
          ? null
          : Number(durationMinutes),
        isFlexibleTime,
        isFlexibleDuration
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Success alert.
    alert(
      `✅ Success!\n\n"${trimmedTitle}" has been successfully planned for tomorrow!`
    );

    // Reset form after successful submission.
    setTitle('');
    setDescription('');
    setCategory('Personal projects');
    setScheduledTime('06:00');
    setDurationMinutes('20');
    setIsFlexibleTime(false);
    setIsFlexibleDuration(false);

  } catch (err) {
    console.error('Commitment creation error:', err);

    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      'Failed to save commitment. Please try again.';

    // Error alert.
    alert(`❌ Error!\n\n${errorMessage}`);

  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <main className="container plan-tomorrow-page">

      {/* Page Header */}
      <header className="plan-header">
        <div className="plan-header-icon">
          <Calendar size={24} />
        </div>

        <div className="plan-header-content">
          <span className="plan-eyebrow">
            YOUR NEXT DAY STARTS HERE
          </span>

          <h1>Plan Tomorrow</h1>

          <p>
            Organize your priorities today and give tomorrow
            a clear direction.
          </p>
        </div>
      </header>

      {/* Tomorrow Date */}
      <section className="tomorrow-date-card">
        <div className="tomorrow-date-icon">
          <Calendar size={20} />
        </div>

        <div>
          <span className="tomorrow-date-label">
            Planning for
          </span>

          <h2>{formattedTomorrow}</h2>
        </div>

        <div className="tomorrow-date-badge">
          <Sparkles size={15} />
          Tomorrow
        </div>
      </section>

      {/* Notifications */}
      <div className="plan-notifications">
        <ErrorMessage message={error} />

        {successMsg && (
          <div className="plan-success-message" role="status">
            <CheckCircle2 size={21} />

            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <section className="plan-form-card">

        <div className="plan-form-heading">
          <div>
            <span className="plan-eyebrow">
              NEW COMMITMENT
            </span>

            <h2>What will you accomplish?</h2>

            <p>
              Add something meaningful to tomorrow's schedule.
            </p>
          </div>

          <div className="plan-form-heading-icon">
            <Plus size={22} />
          </div>
        </div>

        <form onSubmit={handleAddCommitment} className="plan-form">

          {/* Commitment Title */}
          <div className="plan-form-group">
            <label htmlFor="commitmentTitle">
              Commitment Title
            </label>

            <input
              id="commitmentTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read a book"
              maxLength={100}
              required
            />

            <span className="plan-field-hint">
              Keep it clear and actionable.
            </span>
          </div>

          {/* Description */}
          <div className="plan-form-group">
            <label htmlFor="commitmentDescription">
              Description
              <span className="optional-label">Optional</span>
            </label>

            <textarea
              id="commitmentDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a few details about what you want to do..."
              rows={4}
              maxLength={500}
            />
          </div>

          {/* Category */}
          <div className="plan-form-group">
            <label htmlFor="commitmentCategory">
              Category / Life Area
            </label>

            <select
              id="commitmentCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Section */}
          <div className="plan-section-divider">
            <div className="plan-section-icon">
              <Clock size={19} />
            </div>

            <div>
              <h3>Time & Schedule</h3>
              <p>Choose when you want to Start.</p>
            </div>
          </div>

          <div className="plan-settings-grid">

            {/* Scheduled Time */}
            <div className="plan-form-group">
              <label htmlFor="scheduledTime">
                Scheduled Time
              </label>

              <input
                id="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                disabled={isFlexibleTime}
                required={!isFlexibleTime}
              />
            </div>

            {/* Flexible Time */}
            <label
              className={`plan-toggle-card ${
                isFlexibleTime ? 'active' : ''
              }`}
              htmlFor="flexibleTime"
            >
              <input
                id="flexibleTime"
                type="checkbox"
                checked={isFlexibleTime}
                onChange={(e) => setIsFlexibleTime(e.target.checked)}
              />

              <span className="plan-custom-checkbox">
                <CheckCircle2 size={15} />
              </span>

              <span className="plan-toggle-content">
                <strong>Flexible Time</strong>
                <small>Complete it whenever convenient.</small>
              </span>
            </label>

          </div>

          {/* Duration Section */}
          <div className="plan-section-divider duration-divider">
            <div className="plan-section-icon">
              <Timer size={19} />
            </div>

            <div>
              <h3>Duration</h3>
              <p>Decide how much time to dedicate.</p>
            </div>
          </div>

          <div className="plan-settings-grid">

            {/* Duration */}
            <div className="plan-form-group">
              <label htmlFor="durationMinutes">
                Duration (Minutes)
              </label>

              <input
                id="durationMinutes"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                min="5"
                max="480"
                step="1"
                disabled={isFlexibleDuration}
                required={!isFlexibleDuration}
              />
            </div>

            {/* Flexible Duration */}
            <label
              className={`plan-toggle-card ${
                isFlexibleDuration ? 'active' : ''
              }`}
              htmlFor="flexibleDuration"
            >
              <input
                id="flexibleDuration"
                type="checkbox"
                checked={isFlexibleDuration}
                onChange={(e) =>
                  setIsFlexibleDuration(e.target.checked)
                }
              />

              <span className="plan-custom-checkbox">
                <CheckCircle2 size={15} />
              </span>

              <span className="plan-toggle-content">
                <strong>Flexible Duration</strong>
                <small>Work at your own pace.</small>
              </span>
            </label>

          </div>

          {/* Submit */}
          <div className="plan-submit-area">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="plan-submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="plan-spinner" />
                  Saving Commitment...
                </>
              ) : (
                <>
                  <Plus size={19} />
                  Save & Schedule for Tomorrow
                </>
              )}
            </Button>

            <p className="plan-submit-note">
              Your commitment will be added to tomorrow's schedule.
            </p>
          </div>

        </form>
      </section>

      {/* Bottom Note */}
      <div className="plan-bottom-note">
        <Sparkles size={17} />

        <p>
          A little planning today can make tomorrow feel
          much more manageable.
        </p>
      </div>

    </main>
  );
}
