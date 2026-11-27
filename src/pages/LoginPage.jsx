
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const user = await login(
        email.trim().toLowerCase(),
        password
      );

      // Confirm successful authentication before redirecting.
      if (user?.token) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(
          'Login response was incomplete. Please try again.'
        );
      }

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to sign in. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-shape login-shape-one" />
      <div className="login-background-shape login-shape-two" />

      <div className="login-layout">

        {/* LEFT: BRAND SECTION */}
        <section className="login-brand-section">
          <Link to="/" className="login-brand">
            <span className="login-brand-icon">
              <Target size={25} strokeWidth={2.2} />
            </span>
            <span>HABITRA</span>
          </Link>

          <div className="login-brand-content">
            <div className="login-eyebrow">
              <Sparkles size={15} />
              <span>YOUR JOURNEY CONTINUES</span>
            </div>

            <h1>
              Every day is a
              <span> new opportunity.</span>
            </h1>

            <p>
              Your goals are waiting. Return to your routine,
              focus on what matters, and keep building the life
              you want.
            </p>

            <div className="login-feature-list">
              <div className="login-feature">
                <span className="login-feature-check">✓</span>
                <span>Stay connected to your goals</span>
              </div>

              <div className="login-feature">
                <span className="login-feature-check">✓</span>
                <span>Build consistent daily habits</span>
              </div>

              <div className="login-feature">
                <span className="login-feature-check">✓</span>
                <span>Track your progress over time</span>
              </div>
            </div>
          </div>

          <div className="login-brand-footer">
            <span>Small steps. Meaningful progress.</span>
            <span>© {new Date().getFullYear()} HABITRA</span>
          </div>
        </section>

        {/* RIGHT: LOGIN FORM */}
        <section className="login-form-section">
          <div className="login-form-card">

            <Link to="/" className="login-mobile-brand">
              <Target size={23} />
              <span>HABITRA</span>
            </Link>

            <div className="login-heading">
              <div className="login-welcome-icon">
                <ShieldCheck size={25} />
              </div>

              <span className="login-subtitle">
                WELCOME BACK
              </span>

              <h2>Sign in to HABITRA</h2>

              <p>
                Continue where you left off. Your progress is waiting.
              </p>
            </div>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} className="login-form">

              <div className="login-input-group">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="login-input-group login-password-group">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <div className="login-forgot-password">
                <Link to="/forgot-password">
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <span className="login-button-loading">
                    <span className="login-spinner" />
                    Signing in...
                  </span>
                ) : (
                  <span className="login-button-content">
                    Sign In
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            <div className="login-divider">
              <span>NEW TO HABITRA?</span>
            </div>

            <p className="login-register-text">
              Don't have an account?
              <Link to="/register"> Create an account</Link>
            </p>

            <Link to="/" className="login-back-home">
              <ArrowLeft size={15} />
              Back to homepage
            </Link>

            <div className="login-security-note">
              <ShieldCheck size={15} />
              <span>Your account and progress are protected.</span>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}


