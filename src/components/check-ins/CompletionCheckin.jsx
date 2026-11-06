import React from 'react';
import Button from '../common/Button';

export default function CompletionCheckin({ onComplete, onMissed }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button onClick={onComplete}>Complete</Button>
      <Button variant="secondary" onClick={onMissed}>Missed</Button>
    </div>
  );
}