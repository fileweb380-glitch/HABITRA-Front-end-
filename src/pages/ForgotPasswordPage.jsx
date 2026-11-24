import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await axios.post('https://habitra-backend-1.onrender.com/api/auth/forgot-password', { email });
      setSuccessMsg('If an account exists with this email, you will receive a password reset link shortly.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Reset Your Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter your registered email address and we'll send you a secure link to reset your password.
          </p>
        </div>

        <ErrorMessage message={error} />

        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', lineHeight: 1.5 }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            required 
          />

          <Button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', background: 'var(--accent)', color: '#171717', padding: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" /> Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <Link to="/login" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}