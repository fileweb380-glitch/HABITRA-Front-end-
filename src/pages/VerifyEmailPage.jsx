import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email'); // Added email extraction

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !email) {
      setError('Verification token or email is missing.');
      setLoading(false);
      return;
    }

    verifyEmailToken();
  }, [token, email]);

  const verifyEmailToken = async () => {
    try {
      // Fixed: Made GET request with token and email query parameters
      const res = await axios.get(
        `https://habitra-backend-1.onrender.com/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
      );

      if (res.data.token) {
        localStorage.setItem('habitra_token', res.data.token);
      }

      setVerified(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Email verification failed. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', marginTop: '5rem', marginBottom: '4rem' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        
        {loading ? (
          <div>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={32} className="spin" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Verifying Your Email...</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Please wait while we confirm your HABITRA account details.
            </p>
          </div>
        ) : verified ? (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your email address has been confirmed successfully. You are ready to personalize HABITRA and set up your consistency preferences.
            </p>

            <Button 
              onClick={() => navigate('/login')} 
              style={{ width: '100%', background: 'var(--accent)', color: '#171717', padding: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Proceed to Sign In <ArrowRight size={16} />
            </Button>
          </div>
        ) : (
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <XCircle size={32} style={{ color: 'var(--danger)' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Verification Failed</h2>
            
            <ErrorMessage message={error} />

            <div style={{ marginTop: '2rem' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" style={{ width: '100%' }}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}