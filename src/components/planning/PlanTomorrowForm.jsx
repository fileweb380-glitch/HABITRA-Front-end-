import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { Plus } from 'lucide-react';

export default function PlanTomorrowForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [scheduledDate, setScheduledDate] = useState(tomorrow.toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, scheduledDate });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Plan Tomorrow</h3>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Commitment title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}
        />
        <input
          type="date"
          value={scheduledDate}
          onChange={e => setScheduledDate(e.target.value)}
          style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}
        />
        <Button type="submit"><Plus size={18} /> Add</Button>
      </div>
    </form>
  );
}