import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Button from '../common/Button';

export default function CommitmentCard({ commitment, onUpdateStatus }) {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <strong>{commitment.title}</strong>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Status: <span style={{ fontWeight: 600 }}>{commitment.status}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {commitment.status !== 'Completed' && (
          <Button style={{ background: 'var(--success)', padding: '0.5rem 1rem' }} onClick={() => onUpdateStatus(commitment._id, 'Completed')}>
            <CheckCircle2 size={16} /> Complete
          </Button>
        )}
        {commitment.status !== 'Missed' && (
          <Button style={{ background: 'var(--danger)', padding: '0.5rem 1rem' }} onClick={() => onUpdateStatus(commitment._id, 'Missed')}>
            <XCircle size={16} /> Missed
          </Button>
        )}
      </div>
    </div>
  );
}