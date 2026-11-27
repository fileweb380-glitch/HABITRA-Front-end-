
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

import {
  CheckCircle2,
  ArrowLeft,
  Lock
} from 'lucide-react';

import { authService } from '../features/auth/authService';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      // authService sends { token, password }
      await authService.resetPassword(token, newPassword);

      setSuccess(true);

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);

    } catch (err) {
      console.error('Password reset error:', err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to reset password. The link may have expired.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: '420px',
        marginTop: '4rem',
        marginBottom: '4rem'
      }}
    >
      <div className="card" style={{ padding: '2.5rem' }}>

        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}
          >
            <Lock
              size={22}
              style={{ color: 'var(--accent)' }}
            />
          </div>

          <h2
            style={{
              fontSize: '1.5rem',
              marginBottom: '0.35rem',
              letterSpacing: '-0.02em'
            }}
          >
            Set New Password
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}
          >
            Enter your new secure password below.
          </p>
        </div>

        <ErrorMessage message={error} />

        {success ? (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              padding: '1.25rem',
              borderRadius: 'var(--radius)',
              textAlign: 'center'
            }}
          >
            <CheckCircle2
              size={28}
              style={{
                margin: '0 auto 0.5rem',
                color: 'var(--success)'
              }}
            />

            <strong
              style={{
                display: 'block',
                fontSize: '1rem',
                marginBottom: '0.25rem'
              }}
            >
              Password Updated!
            </strong>

            <p style={{ fontSize: '0.88rem', margin: 0 }}>
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--accent)',
                color: '#171717',
                padding: '0.85rem',
                fontWeight: 600,
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        )}

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.25rem'
          }}
        >
          <Link
            to="/login"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
