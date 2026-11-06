import React, { useState } from 'react';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { Calendar, Clock, Plus, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function PlanTomorrowPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal projects');
  const [scheduledTime, setScheduledTime] = useState('06:00');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [isFlexible, setIsFlexible] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Calculate tomorrow's date string (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const handleAddCommitment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('habitra_token');
      await axios.post('http://localhost:5000/api/commitments', {
        title,
        description,
        category,
        date: tomorrowStr,
        time: isFlexible ? null : scheduledTime,
        durationMinutes: Number(durationMinutes),
        isFlexible
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg(`Successfully planned "${title}" for tomorrow at ${isFlexible ? 'Flexible Time' : scheduledTime} (${durationMinutes} mins)! Email notification and alarm scheduled.`);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save commitment');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Plan Tomorrow</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Lock in your schedule for {tomorrow.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}. Wake up with absolute clarity.
        </p>
      </div>

      <ErrorMessage message={error} />
      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleAddCommitment}>
          <div className="form-group">
            <label>Commitment Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Read a book" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Category / Life Area</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: '#ffffff' }}>
              <option value="Learning and education">Learning and education</option>
              <option value="Health and exercise">Health and exercise</option>
              <option value="Work and business">Work and business</option>
              <option value="Personal projects">Personal projects</option>
              <option value="Rest and free time">Rest and free time</option>
            </select>
          </div>

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
              id="flexible" 
              checked={isFlexible} 
              onChange={e => setIsFlexible(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
            />
            <label htmlFor="flexible" style={{ margin: 0, cursor: 'pointer', fontWeight: 500 }}>
              Set as flexible timing (no fixed alarm time required)
            </label>
          </div>

          <Button type="submit" style={{ width: '100%', background: 'var(--accent)', color: '#171717' }}>
            <Plus size={18} /> Save & Schedule Commitment for Tomorrow
          </Button>
        </form>
      </div>
    </div>
  );
}