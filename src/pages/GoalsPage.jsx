import React, { useState, useEffect } from 'react';
import { goalService } from '../features/goals/goalService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Plus } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');

  const fetchGoals = async () => {
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await goalService.createGoal({ title });
      setTitle('');
      fetchGoals();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container">
      <h2>Goals</h2>
      <form onSubmit={handleCreate} className="card" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <input type="text" placeholder="New goal title..." value={title} onChange={e => setTitle(e.target.value)} required style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }} />
        <Button type="submit"><Plus size={18} /> Add Goal</Button>
      </form>
      <div>
        {goals.map(g => (
          <div key={g._id} className="card">
            <strong>{g.title}</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status: {g.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}