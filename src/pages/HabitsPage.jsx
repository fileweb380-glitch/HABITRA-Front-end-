import React, { useState, useEffect } from 'react';
import {
  Plus,
  Repeat,
  CalendarDays,
  Clock3,
  Timer,
  Sparkles,
  Check,
  BellRing
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://habitra-backend-1.onrender.com';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const FREQUENCIES = [
  { id: 'daily', label: 'Daily', description: 'Every day', icon: Repeat },
  { id: 'weekly', label: 'Weekly', description: 'Selected days', icon: CalendarDays },
  { id: 'monthly', label: 'Monthly', description: 'Once a month', icon: CalendarDays },
  { id: 'yearly', label: 'Yearly', description: 'Once a year', icon: Sparkles }
];

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export default function HabitsPage() {
  const [frequency, setFrequency] = useState('daily');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health and exercise');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [reminderPref, setReminderPref] = useState('both');

  const [isFlexibleTime, setIsFlexibleTime] = useState(false);
  const [isFlexibleDuration, setIsFlexibleDuration] = useState(false);

  const [selectedDays, setSelectedDays] = useState([]);
  const [monthlyDate, setMonthlyDate] = useState('1');
  const [yearlyMonth, setYearlyMonth] = useState('1');
  const [yearlyDay, setYearlyDay] = useState('1');

  const [existingCommitments, setExistingCommitments] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

  useEffect(() => {
    const fetchExistingSchedules = async () => {
      const token = localStorage.getItem('habitra_token');

      if (!token) {
        setIsLoadingSchedules(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/commitments`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const commitments = Array.isArray(response.data)
          ? response.data
          : response.data?.commitments || [];

        setExistingCommitments(commitments);
      } catch (err) {
        console.error('Failed to fetch commitments:', err);
        alert('⚠️ Could not load your existing commitments.');
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    fetchExistingSchedules();
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((previousDays) =>
      previousDays.includes(day)
        ? previousDays.filter((item) => item !== day)
        : [...previousDays, day]
    );
  };

  const isValidNumber = (value, min, max) => {
    const number = Number(value);

    return (
      Number.isInteger(number) &&
      number >= min &&
      number <= max
    );
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert('⚠️ Please enter your habit title.');
      return;
    }

    if (frequency === 'weekly' && selectedDays.length === 0) {
      alert('⚠️ Please select at least one day of the week.');
      return;
    }

    if (
      frequency === 'monthly' &&
      !isValidNumber(monthlyDate, 1, 31)
    ) {
      alert('⚠️ Please enter a valid monthly date between 1 and 31.');
      return;
    }

    if (frequency === 'yearly') {
      const month = Number(yearlyMonth);
      const day = Number(yearlyDay);

      if (!isValidNumber(month, 1, 12)) {
        alert('⚠️ Please select a valid month.');
        return;
      }

      const daysInMonth = new Date(2000, month, 0).getDate();

      if (!isValidNumber(day, 1, daysInMonth)) {
        alert(`⚠️ Selected month has a maximum of ${daysInMonth} days.`);
        return;
      }
    }

    if (
      !isFlexibleDuration &&
      !isValidNumber(durationMinutes, 5, 480)
    ) {
      alert('⚠️ Duration must be between 5 and 480 minutes.');
      return;
    }

    if (!isFlexibleTime && !scheduledTime) {
      alert('⚠️ Please select a scheduled time or enable Flexible Time.');
      return;
    }

    const token = localStorage.getItem('habitra_token');

    if (!token) {
      alert('🔒 Your session has expired. Please log in again.');
      return;
    }

    if (!isFlexibleTime && scheduledTime) {
      const clash = existingCommitments.find(
        (commitment) => commitment.time === scheduledTime
      );

      if (clash) {
        alert(
          `⚠️ Schedule Clash!\nThe time ${scheduledTime} is already used by "${clash.title}".`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const habitData = {
        title: trimmedTitle,
        category,
        frequency,
        time: isFlexibleTime ? null : scheduledTime,
        durationMinutes: isFlexibleDuration
          ? null
          : Number(durationMinutes),
        isFlexibleTime,
        isFlexibleDuration,
        reminderPref,
        days: frequency === 'weekly' ? selectedDays : undefined,
        monthlyDate:
          frequency === 'monthly'
            ? Number(monthlyDate)
            : undefined,
        yearlyDate:
          frequency === 'yearly'
            ? {
                month: Number(yearlyMonth),
                day: Number(yearlyDay)
              }
            : undefined
      };

      await axios.post(
        `${API_BASE_URL}/api/habits`,
        habitData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        `✅ Habit Created Successfully!\n\n"${trimmedTitle}" has been added to your ${frequency} habits.`
      );

      setTitle('');
      setCategory('Health and exercise');
      setDurationMinutes('30');
      setScheduledTime('08:00');
      setReminderPref('both');
      setIsFlexibleTime(false);
      setIsFlexibleDuration(false);
      setSelectedDays([]);
      setMonthlyDate('1');
      setYearlyMonth('1');
      setYearlyDay('1');

    } catch (err) {
      console.error('Habit creation error:', err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to create habit.';

      alert(`❌ Unable to Create Habit!\n\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="habits-page">
      <div className="habits-container">

        <header className="habits-header">
          <div className="habits-header-icon">
            <Repeat size={25} />
          </div>

          <div className="habits-header-content">
            <span className="habits-eyebrow">
              BUILD YOUR ROUTINE
            </span>

            <h1>Habits Management</h1>

            <p>
              Create meaningful routines and make consistency part of your everyday life.
            </p>
          </div>
        </header>

        <section className="frequency-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">STEP 01</span>
              <h2>Choose your frequency</h2>
              <p>How often do you want to practice this habit?</p>
            </div>
          </div>

          <div className="frequency-grid">
            {FREQUENCIES.map((item) => {
              const Icon = item.icon;
              const isSelected = frequency === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`frequency-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setFrequency(item.id)}
                  aria-pressed={isSelected}
                  disabled={isSubmitting}
                >
                  <div className="frequency-card-top">
                    <div className="frequency-icon">
                      <Icon size={20} />
                    </div>

                    {isSelected && (
                      <span className="frequency-check">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="habit-form-card">
          <div className="form-card-header">
            <div className="form-card-icon">
              <Sparkles size={21} />
            </div>

            <div>
              <span className="section-eyebrow">STEP 02</span>
              <h2>Configure your habit</h2>
              <p>Give your new habit a clear structure.</p>
            </div>
          </div>

          <form onSubmit={handleCreateHabit}>

            <div className="form-group">
              <label htmlFor="habitTitle">
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Habit Title
              </label>

              <input
                id="habitTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning workout, Reading"
                maxLength={100}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="habitCategory">
                Life Area / Category
              </label>

              <select
                id="habitCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Health and exercise">Health and exercise</option>
                <option value="Learning and education">Learning and education</option>
                <option value="Work and business">Work and business</option>
                <option value="Personal projects">Personal projects</option>
                <option value="Prayer and spiritual life">Prayer and spiritual life</option>
              </select>
            </div>

            {frequency === 'weekly' && (
              <div className="form-group frequency-options">
                <label>Select Days of the Week</label>

                <div className="days-grid">
                  {DAYS_OF_WEEK.map((day) => {
                    const active = selectedDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        className={`day-button ${active ? 'active' : ''}`}
                        onClick={() => toggleDay(day)}
                        disabled={isSubmitting}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {frequency === 'monthly' && (
              <div className="form-group frequency-options">
                <label htmlFor="monthlyDate">
                  Day of the Month
                </label>

                <input
                  id="monthlyDate"
                  type="number"
                  min="1"
                  max="31"
                  value={monthlyDate}
                  onChange={(e) => setMonthlyDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {frequency === 'yearly' && (
              <div className="frequency-options">
                <div className="yearly-grid">
                  <div className="form-group">
                    <label htmlFor="yearlyMonth">Month</label>

                    <select
                      id="yearlyMonth"
                      value={yearlyMonth}
                      onChange={(e) => setYearlyMonth(e.target.value)}
                      disabled={isSubmitting}
                    >
                      {MONTHS.map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="yearlyDay">Day</label>

                    <input
                      id="yearlyDay"
                      type="number"
                      min="1"
                      max="31"
                      value={yearlyDay}
                      onChange={(e) => setYearlyDay(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="settings-divider">
              <span>TIME & DURATION</span>
            </div>

            <div className="settings-grid">
              <div className="form-group">
                <label htmlFor="habitTime">
                  <Clock3 size={16} /> Scheduled Time
                </label>

                <input
                  id="habitTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  disabled={isFlexibleTime || isSubmitting}
                />

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={isFlexibleTime}
                    onChange={(e) => setIsFlexibleTime(e.target.checked)}
                    disabled={isSubmitting}
                  />

                  <span className="custom-checkbox"></span>
                  <span>Flexible Time</span>
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="habitDuration">
                  <Timer size={16} /> Duration (Minutes)
                </label>

                <input
                  id="habitDuration"
                  type="number"
                  min="5"
                  max="480"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  disabled={isFlexibleDuration || isSubmitting}
                />

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={isFlexibleDuration}
                    onChange={(e) => setIsFlexibleDuration(e.target.checked)}
                    disabled={isSubmitting}
                  />

                  <span className="custom-checkbox"></span>
                  <span>Flexible Duration</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label htmlFor="reminderPref">
                <BellRing size={16} /> Reminder Channel & Alarms
              </label>

              <select
                id="reminderPref"
                value={reminderPref}
                onChange={(e) => setReminderPref(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="both">
                  Email + Web Push (With Loud Alarm)
                </option>
                <option value="email">Email Only (No Alarm)</option>
                <option value="push">
                  Web Push Only (With Loud Alarm)
                </option>
                <option value="none">No Automated Reminders</option>
              </select>

              <span className="field-hint">
                Choose how HABITRA should alert you when it's time for this habit.
              </span>
            </div>

            <button
              type="submit"
              className="create-habit-button"
              style={{ marginTop: '1.5rem' }}
              disabled={isSubmitting || isLoadingSchedules}
            >
              {isSubmitting ? (
                'Creating Habit...'
              ) : (
                <>
                  <Plus size={20} />
                  Create Habit & Configure Schedule
                </>
              )}
            </button>

          </form>
        </section>

      </div>
    </main>
  );
}