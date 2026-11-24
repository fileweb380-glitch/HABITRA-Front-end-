import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import { CheckCircle2, XCircle, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function CheckInResponsePage() {
  const [searchParams] = useSearchParams();
  const commitmentId = searchParams.get('id');
  const status = searchParams.get('status'); // 'completed' or 'missed'

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Reflection state for 'missed' status
  const [reason, setReason] = useState('Urgent Interruption');
  const [notes, setNotes] = useState('');
  const [treatmentMessage, setTreatmentMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!commitmentId || !status) {
      setError('Invalid check-in link parameters.');
      setLoading(false);
      return;
    }

    if (status === 'completed') {
      submitCheckIn('Completed');
    } else {
      // For missed, we show the reflection form first
      setLoading(false);
    }
  }, [commitmentId, status]);

  const submitCheckIn = async (finalStatus, reflectionData = {}) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('habitra_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.patch(
        `https://habitra-backend-1.onrender.com/api/commitments/${commitmentId}/checkin`,
        { status: finalStatus, ...reflectionData },
        { headers }
      );

      setTreatmentMessage(res.data.motivation || 'Commitment status updated successfully.');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update commitment status.');
    } finally {
      setLoading(false);
    }
  };

  const handleMissedSubmit = (e) => {
    e.preventDefault();
    submitCheckIn('Missed', { reason, notes });
  };

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '5rem', marginBottom: '4rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={32} className="spin" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Logging Your Habit...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Updating your HABITRA consistency history.
            </p>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: status === 'completed' ? '#dcfce7' : '#fef3c7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              {status === 'completed' ? (
                <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
              ) : (
                <MessageSquare size={32} style={{ color: '#d97706' }} />
              )}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {status === 'completed' ? 'Commitment Completed! 🎉' : 'Reflection Logged'}
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius)' }}>
              "{treatmentMessage}"
            </p>

            <Button 
              onClick={() => navigate('/dashboard')} 
              style={{ width: '100%', background: 'var(--accent)', color: '#171717', padding: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Return to Dashboard <ArrowRight size={16} />
            </Button>
          </div>
        ) : status === 'missed' ? (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <XCircle size={32} style={{ color: 'var(--danger)' }} />
            </div>
            
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>What happened?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Consistency is built through honest reflection. Let's capture why this session was missed.
            </p>

            <ErrorMessage message={error} />

            <form onSubmit={handleMissedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>Primary Reason</label>
                <select 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: '#ffffff' }}
                >
                  <option value="Urgent Interruption">Urgent Interruption / Emergency</option>
                  <option value="Fatigue">Lack of Energy / Fatigue</option>
                  <option value="Time Management">Distracted / Poor Time Management</option>
                  <option value="Other">Other Obstacle</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>Quick Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How will you adjust next time?"
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <Button 
                type="submit" 
                style={{ width: '100%', background: 'var(--text-primary)', color: '#ffffff', padding: '0.85rem', fontWeight: 600 }}
              >
                Submit Reflection
              </Button>
            </form>
          </div>
        ) : null}

      </div>
    </div>
  );
}