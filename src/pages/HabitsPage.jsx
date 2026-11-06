import React, { useState, useEffect } from 'react';
import { habitService } from '../features/habits/habitService';
import Button from '../components/common/Button';
import { Plus, Check, X } from 'lucide-react';
import { getCurrentDateString } from '../lib/dateTime';

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const todayStr = getCurrentDateString();

  const fetchHabits = async () => {
    try {
      const data = await habitService.getHabits();
      setHabits(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHabits(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await habitService.createHabit({ title });
      setTitle('');
      fetchHabits();
    } catch (err) { console.error(err); }
  };

  const handleLog = async (habitId, outcome) => {
    try {
      await habitService.logEntry(habitId, { date: todayStr, outcome });
      fetchHabits();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <h2>Recurring Habits</h2>
      <form onSubmit={handleCreate} className="card" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <input type="text" placeholder="New habit title..." value={title} onChange={e => setTitle(e.target.value)} required style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }} />
        <Button type="submit"><Plus size={18} /> Add Habit</Button>
      </form>
      <div>
        {habits.map(h => (
          <div key={h._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{h.title}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recurrence: {h.recurrence}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button style={{ background: 'var(--success)' }} onClick={() => handleLog(h._id, 'Completed')}><Check size={16} /> Done</Button>
              <Button style={{ background: 'var(--danger)' }} onClick={() => handleLog(h._id, 'Missed')}><X size={16} /> Missed</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}