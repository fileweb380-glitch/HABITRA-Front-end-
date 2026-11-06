import React, { useState } from 'react';
import Button from '../common/Button';

export default function MissedReasonForm({ onSubmit, onCancel }) {
  const [reasonCode, setReasonCode] = useState('forgot');
  const [explanation, setExplanation] = useState('');

  return (
    <div>
      <h3>Why was this commitment not completed?</h3>
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <select value={reasonCode} onChange={e => setReasonCode(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
          <option value="forgot">I forgot.</option>
          <option value="urgent">An urgent situation came up.</option>
          <option value="out_of_time">I ran out of time.</option>
          <option value="unmotivated">I did not feel motivated.</option>
          <option value="other">Something else.</option>
        </select>
      </div>
      <div className="form-group">
        <label>Optional explanation</label>
        <textarea value={explanation} onChange={e => setExplanation(e.target.value)} rows="3" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ reasonCode, explanation })}>Save Reason</Button>
      </div>
    </div>
  );
}