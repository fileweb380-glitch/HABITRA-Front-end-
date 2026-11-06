import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { Repeat, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function HabitsPage() {
  const [frequency, setFrequency] = useState('daily'); // daily, weekly, monthly, yearly
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health and exercise');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [isFlexible, setIsFlexible] = useState(false);
  
  // Weekly specific
  const [selectedDays, setSelectedDays] = useState([]);
  
  // Monthly specific
  const [monthlyDate, setMonthlyDate] = useState(1);
  
  // Yearly specific
  const [yearlyMonth, setYearlyMonth] = useState(1);
  const [yearlyDay, setYearlyDay] = useState(1);

  const [existingCommitments, setExistingCommitments] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchExistingSchedules();
  }, []);

  const fetchExistingSchedules = async () => {
    try {
      const token = localStorage.getItem('habitra_token');
      const res = await axios.get('http://localhost:5000/api/commitments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExistingCommitments(res.data || []);
    } catch (err) {
      console.error('Could not fetch existing commitments for clash check', err);
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // SMART CLASH DETECTION: Check if scheduledTime overlaps with any existing "Plan Tomorrow" commitment
    if (!isFlexible && scheduledTime) {
      const clash = existingCommitments.find(c => c.time === scheduledTime);
      if (clash) {
        setError(`Schedule Clash: The time slot ${scheduledTime} already conflicts with your planned commitment "${clash.title}". Please choose a different time or make it flexible.`);
        return;
      }
    }

    try {
      const token = localStorage.getItem('habitra_token');
      await axios.post('http://localhost:5000/api/habits', {
        title,
        category,
        frequency,
        time: isFlexible ? null : scheduledTime,
        durationMinutes: Number(durationMinutes),
        isFlexible,
        days: frequency === 'weekly' ? selectedDays : undefined,
        monthlyDate: frequency === 'monthly' ? Number(monthlyDate) : undefined,
        yearlyDate: frequency === 'yearly' ? { month: Number(yearlyMonth), day: Number(yearlyDay) } : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg(`Successfully created ${frequency} habit "${title}"! Reminders and notifications configured.`);
      setTitle('');
      setSelectedDays([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create habit');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem', marginBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Habits Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Build sustainable recurring routines across daily, weekly, monthly, and yearly intervals.</p>
      </div>

      <ErrorMessage message={error} />
      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Frequency Cards Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { id: 'daily', label: 'Daily Habit' },
          { id: 'weekly', label: 'Weekly Habit' },
          { id: 'monthly', label: 'Monthly Habit' },
          { id: 'yearly', label: 'Yearly Habit' }
        ].map((item) => {
          const isSelected = frequency === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setFrequency(item.id)}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius)',
                border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                backgroundColor: isSelected ? 'var(--bg-secondary)' : '#ffffff',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: isSelected ? 700 : 500,
                transition: 'all 0.15s ease'
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleCreateHabit}>
          <div className="form-group">
            <label>{frequency.charAt(0).toUpperCase() + frequency.slice(1)} Habit Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Morning Jog or Quarterly Review" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Life Area / Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: '#ffffff' }}>
              <option value="Health and exercise">Health and exercise</option>
              <option value="Learning and education">Learning and education</option>
              <option value="Work and business">Work and business</option>
              <option value="Personal projects">Personal projects</option>
              <option value="Prayer and spiritual life">Prayer and spiritual life</option>
            </select>
          </div>

          {/* WEEKLY: Day selector */}
          {frequency === 'weekly' && (
            <div className="form-group">
              <label>Select Days of the Week</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {daysOfWeek.map(day => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        border: `1px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
                        backgroundColor: active ? 'var(--accent)' : '#ffffff',
                        color: active ? '#171717' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MONTHLY: Date selector */}
          {frequency === 'monthly' && (
            <div className="form-group">
              <label>Day of the Month (1 - 31)</label>
              <input 
                type="number" 
                min="1" 
                max="31" 
                value={monthlyDate} 
                onChange={e => setMonthlyDate(e.target.value)} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
              />
            </div>
          )}

          {/* YEARLY: Month & Day selector */}
          {frequency === 'yearly' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-group">
              <div>
                <label>Month</label>
                <select value={yearlyMonth} onChange={e => setYearlyMonth(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: '#ffffff' }}>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Day</label>
                <input type="number" min="1" max="31" value={yearlyDay} onChange={e => setYearlyDay(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Scheduled Time</label>
              <input 
                type="time" 
                value={scheduledTime} 
                onChange={e => setScheduledTime(e.target.value)} 
                disabled={isFlexible}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', opacity: isFlexible ? 0.5 : 1 }} 
              />
            </div>

            <div className="form-group">
              <label>Duration (Minutes)</label>
              <input 
                type="number" 
                value={durationMinutes} 
                onChange={e => setDurationMinutes(e.target.value)} 
                min="5" 
                max="480" 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <input 
              type="checkbox" 
              id="habitFlexible" 
              checked={isFlexible} 
              onChange={e => setIsFlexible(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <label htmlFor="habitFlexible" style={{ margin: 0, cursor: 'pointer', fontWeight: 500 }}>
              Flexible timing (bypass schedule clash checks)
            </label>
          </div>

          <Button type="submit" style={{ width: '100%', background: 'var(--accent)', color: '#171717' }}>
            <Plus size={18} /> Create Habit & Configure Alarms
          </Button>
        </form>
      </div>
    </div>
  );
}

  