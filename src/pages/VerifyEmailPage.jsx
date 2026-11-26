   
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
  const pending = searchParams.get('pending') === '1';

  const [loading, setLoading] = useState(!pending);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [checking, setChecking] = useState(false);

  // Check Firebase verification through the backend.
  const checkVerification = async () => {
    if (!email) {
      setError('Your verification email address is missing.');
      return;
    }

    setChecking(true);
    setError('');

    try {
      await authService.verifyFirebaseEmail(email);

      setVerified(true);
      setError('');
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Your email has not been verified yet. Please check your inbox and try again.';

      setError(message);
      setVerified(false);
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  // Automatically check when Firebase redirects back
  // without the pending parameter.
  useEffect(() => {
    if (pending) {
      setLoading(false);
      return;
    }

    if (!email) {
      setError('Your verification email address is missing.');
      setLoading(false);
      return;
    }

    let active = true;

    const verify = async () => {
      try {
        await authService.verifyFirebaseEmail(email);

        if (active) {
          setVerified(true);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Verification could not be confirmed. Please try again.'
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
  }, [email, pending]);

  // Resend using Firebase Authentication directly.
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
        err.message ||
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

        {/* LOADING */}
        {loading ? (
          <>
            <Loader2
              size={40}
              className="spin"
              style={{
                color: 'var(--accent)',
                marginBottom: '1rem'
              }}
            />

            <h2>Checking Your Email...</h2>

            <p>
              Please wait while we confirm your HABITRA account.
            </p>
          </>
        ) : verified ? (

          /* SUCCESS */
          <>
            <CheckCircle2
              size={52}
              style={{
                color: 'var(--success)',
                marginBottom: '1rem'
              }}
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

          /* NEW REGISTRATION */
          <>
            <Mail
              size={48}
              style={{
                color: 'var(--accent)',
                marginBottom: '1rem'
              }}
            />

            <h2>Check Your Inbox</h2>

            <p>We've sent a verification link to:</p>

            <strong
              style={{ overflowWrap: 'anywhere' }}
            >
              {email}
            </strong>

            <p style={{ marginTop: '1rem' }}>
              Open the email from Firebase and click
              the verification link to activate your HABITRA account.
            </p>

            <ErrorMessage message={error} />

            {resendMessage && (
              <p
                style={{
                  color: 'var(--success)',
                  marginTop: '1rem'
                }}
              >
                {resendMessage}
              </p>
            )}

            <Button
              onClick={handleResend}
              disabled={resending || checking}
              style={{
                width: '100%',
                marginTop: '1rem'
              }}
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

            <Button
              onClick={checkVerification}
              disabled={checking || resending}
              variant="secondary"
              style={{
                width: '100%',
                marginTop: '0.75rem'
              }}
            >
              {checking ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  I've verified my email
                </>
              )}
            </Button>

            <Link
              to="/login"
              style={{
                display: 'block',
                marginTop: '1.5rem'
              }}
            >
              Back to Sign In
            </Link>
          </>

        ) : (

          /* VERIFICATION NOT CONFIRMED */
          <>
            <XCircle
              size={50}
              style={{
                color: 'var(--danger)',
                marginBottom: '1rem'
              }}
            />

            <h2>Verification Not Confirmed</h2>

            <p>
              We couldn't confirm your email yet.
              Make sure you've clicked the verification link
              in your Firebase email.
            </p>

            <ErrorMessage message={error} />

            <Button
              onClick={checkVerification}
              disabled={checking}
              style={{
                width: '100%',
                marginTop: '1rem'
              }}
            >
              {checking ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Check verification again
                </>
              )}
            </Button>

            <Button
              onClick={() =>
                navigate(
                  `/verify-email?email=${encodeURIComponent(email || '')}&pending=1`
                )
              }
              variant="secondary"
              style={{
                width: '100%',
                marginTop: '0.75rem'
              }}
            >
              Request another email
            </Button>

            <Link
              to="/login"
              style={{
                display: 'block',
                marginTop: '1.5rem'
              }}
            >
              Back to Sign In
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               