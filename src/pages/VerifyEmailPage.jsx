  
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Mail,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

import { authService } from '../features/auth/authService';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const pending = searchParams.get('pending') === '1';

  const [loading, setLoading] = useState(Boolean(token));
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [checking, setChecking] = useState(false);

  // Verify using the backend-generated token.
  const checkVerification = async () => {
    if (!token || !email) {
      setError(
        'Your verification link is missing its token or email address.'
      );
      return;
    }

    setChecking(true);
    setError('');

    try {
      await authService.verifyEmail(token, email);

      setVerified(true);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'This verification link is invalid or expired.'
      );

      setVerified(false);
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  // Automatically verify when the user opens the email link.
  useEffect(() => {
    if (!token) {
      setLoading(false);

      if (!pending && !email) {
        setError('Your verification email address is missing.');
      }

      return;
    }

    let active = true;

    const verify = async () => {
      try {
        await authService.verifyEmail(token, email);

        if (active) {
          setVerified(true);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Verification failed. Your link may have expired.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, [token, email]);

  // Resend through backend Nodemailer.
  const handleResend = async () => {
    if (!email || resending) return;

    setResending(true);
    setError('');
    setResendMessage('');

    try {
      const result = await authService.resendVerification(email);

      setResendMessage(
        result.message || 'A new verification email has been sent.'
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to resend verification email.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: '440px',
        marginTop: '5rem',
        marginBottom: '4rem'
      }}
    >
      <div
        className="card"
        style={{
          padding: '2.5rem',
          textAlign: 'center'
        }}
      >
        {loading ? (
          <>
            <Loader2
              size={40}
              className="spin"
              style={{ color: 'var(--accent)', marginBottom: '1rem' }}
            />

            <h2>Verifying Your Email...</h2>

            <p>Please wait while we confirm your HABITRA account.</p>
          </>
        ) : verified ? (
          <>
            <CheckCircle2
              size={52}
              style={{ color: 'var(--success)', marginBottom: '1rem' }}
            />

            <h2>Email Verified!</h2>

            <p>
              Your email has been confirmed successfully.
              Your HABITRA account is now active.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                margin: '1.5rem 0',
                color: 'var(--success)'
              }}
            >
              <ShieldCheck size={19} />
              <span>Account verification complete</span>
            </div>

            <Button
              onClick={() => navigate('/login')}
              style={{ width: '100%' }}
            >
              Proceed to Sign In
              <ArrowRight size={16} />
            </Button>
          </>
        ) : pending ? (
          <>
            <Mail
              size={48}
              style={{ color: 'var(--accent)', marginBottom: '1rem' }}
            />

            <h2>Check Your Inbox</h2>

            <p>We've sent a verification link to:</p>

            <strong style={{ overflowWrap: 'anywhere' }}>
              {email}
            </strong>

            <p style={{ marginTop: '1rem' }}>
              Open your email from HABITRA and click the verification
              link to activate your account.
            </p>

            <ErrorMessage message={error} />

            {resendMessage && (
              <p style={{ color: 'var(--success)', marginTop: '1rem' }}>
                {resendMessage}
              </p>
            )}

            <Button
              onClick={handleResend}
              disabled={resending}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {resending ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Resend verification email
                </>
              )}
            </Button>

            <Link
              to="/login"
              style={{ display: 'block', marginTop: '1.5rem' }}
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <XCircle
              size={50}
              style={{ color: 'var(--danger)', marginBottom: '1rem' }}
            />

            <h2>Verification Not Confirmed</h2>

            <p>
              We couldn't verify your email. Your link may be invalid
              or expired.
            </p>

            <ErrorMessage message={error} />

            {email && (
              <Button
                onClick={handleResend}
                disabled={resending}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {resending ? 'Sending...' : 'Request a new verification email'}
              </Button>
            )}

            <Link
              to="/login"
              style={{ display: 'block', marginTop: '1.5rem' }}
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             