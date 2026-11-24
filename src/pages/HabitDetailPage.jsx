import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import { Repeat, Calendar, Clock, ArrowLeft, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [days, setDays] = useState([]);
  const [monthlyDate, setMonthlyDate] = useState(1);
  const [time, setTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchHabitDetail();
  }, [id]);

  const fetchHabitDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('habitra_token');
      const res = await axios.get(`https://habitra-backend-1.onrender.com/api/habits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = (res.data || []).find(h => h._id === id);
      if (found) {
        setHabit(found);
        setTitle(found.title || '');
        setCategory(found.category || 'Personal projects');
        setFrequency(found.frequency || 'daily');
        setDays(found.days || []);
        setMonthlyDate(found.monthlyDate || 1);
        setTime(found.time || '');
        setDurationMinutes(found.durationMinutes || 30);
      } else {
        setError('Habit not found');
      }
    } catch (err) {
      setError('Failed to load habit details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

 const handleUpdateHabit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('habitra_token');
      const payload = {
        title,
        category,
        frequency,
        days: frequency === 'weekly' ? days : undefined,
        monthlyDate: frequency === 'monthly' ? Number(monthlyDate) : undefined,
        time,
        durationMinutes: Number(durationMinutes)
      };

      const res = await axios.put(`https://habitra-backend-1.onrender.com/api/habits/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Directly update state with the fresh response from backend
      setHabit(res.data);
      if (res.data.durationMinutes !== undefined) {
        setDurationMinutes(res.data.durationMinutes);
      }
      setIsEditing(false);
      setSuccessMsg('Habit updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update habit');
    }
  };

  const handleDeleteHabit = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this habit?')) {
      return;
    }

    try {
      const token = localStorage.getItem('habitra_token');
      await axios.delete(`https://habitra-backend-1.onrender.com/api/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete habit');
    }
  };

  return (
    <div className="habit-detail-page">
      
      {/* Back Button */}
      <button onClick={() => navigate('/')} type="button">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <ErrorMessage message={error} />
      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--muted)' }}>Loading habit specifications...</p>
        </div>
      ) : habit ? (
        <div className="card">
          
          <div>
            <div>
              <span>
                {habit.category}
              </span>
              <h1>{habit.title}</h1>
            </div>
            <div>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(!isEditing)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
              >
                <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit'}
              </Button>
              <Button 
                onClick={handleDeleteHabit}
                style={{ background: 'var(--danger)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', border: 'none' }}
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateHabit}>
              <Input label="Habit Title" value={title} onChange={e => setTitle(e.target.value)} required />
              
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Frequency</label>
                <select 
                  value={frequency} 
                  onChange={e => setFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {frequency === 'weekly' && (
                <div className="form-group">
                  <label>Select Days</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {daysOfWeek.map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        style={{
                          border: `1px solid ${days.includes(day) ? 'var(--primary)' : 'var(--border)'}`,
                          background: days.includes(day) ? 'var(--primary)' : '#ffffff',
                          color: days.includes(day) ? '#ffffff' : 'var(--ink)'
                        }}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {frequency === 'monthly' && (
                <div className="form-group">
                  <label>Day of Month (1-31)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    value={monthlyDate} 
                    onChange={e => setMonthlyDate(e.target.value)} 
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Scheduled Time</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Minutes)</label>
                  <input 
                    type="number" 
                    value={durationMinutes} 
                    onChange={e => setDurationMinutes(e.target.value)} 
                  />
                </div>
              </div>

              <button type="submit">
                Save Changes
              </button>
            </form>
          ) : (
            <>
              {/* Detailed Specifications Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <span>Frequency & Schedule</span>
                  <div>
                    {habit.frequency}
                  </div>
                  {habit.frequency === 'weekly' && habit.days?.length > 0 && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                      <strong>Days:</strong> {habit.days.join(', ')}
                    </div>
                  )}
                  {habit.frequency === 'monthly' && habit.monthlyDate && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                      <strong>Day of Month:</strong> {habit.monthlyDate}
                    </div>
                  )}
                </div>

                <div>
                  <span>Time & Duration</span>
                  <div>
                    {habit.time || 'Flexible timing'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
                    <strong>Duration:</strong> {habit.durationMinutes || 30} minutes
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  Created on: {new Date(habit.createdAt).toLocaleDateString()}
                </span>
                <Button onClick={() => navigate('/')} style={{ background: 'var(--primary)', color: '#ffffff' }}>
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}

        </div>
      ) : null}

    </div>
  );
}