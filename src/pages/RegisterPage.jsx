
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

import {
  Eye,
  EyeOff,
  Target,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone, setTimezone] = useState('Africa/Addis_Ababa');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        cleanName,
        cleanEmail,
        password,
        timezone
      );

      if (!user?.token) {
        throw new Error(
          'Account created, but authentication failed. Please sign in.'
        );
      }

      navigate('/dashboard', { replace: true });

    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-decoration register-decoration-one" />
      <div className="register-decoration register-decoration-two" />

      <div className="register-layout">

        {/* LEFT BRAND SECTION */}
        <section className="register-brand-section">

          <Link to="/" className="register-brand">
            <span className="register-brand-icon">
              <Target size={25} />
            </span>
            <span>HABITRA</span>
          </Link>

          <div className="register-brand-content">

            <div className="register-eyebrow">
              <Sparkles size={15} />
              <span>START SOMETHING MEANINGFUL</span>
            </div>

            <h1>
              Your next chapter
              <span> starts here.</span>
            </h1>

            <p>
              Create a space for your goals, build habits
              that matter, and turn your intentions into
              consistent daily actions.
            </p>

            <div className="register-benefits">

              <div className="register-benefit">
                <span className="register-benefit-icon">01</span>
                <div>
                  <strong>Define your direction</strong>
                  <p>Know what you're working towards.</p>
                </div>
              </div>

              <div className="register-benefit">
                <span className="register-benefit-icon">02</span>
                <div>
                  <strong>Build your routine</strong>
                  <p>Turn meaningful actions into habits.</p>
                </div>
              </div>

              <div className="register-benefit">
                <span className="register-benefit-icon">03</span>
                <div>
                  <strong>See your progress</strong>
                  <p>Reflect, improve, and keep moving.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="register-brand-footer">
            <span>Progress is built one day at a time.</span>
            <span>© {new Date().getFullYear()} HABITRA</span>
          </div>

        </section>

        {/* RIGHT REGISTRATION SECTION */}
        <section className="register-form-section">

          <div className="register-form-card">

            <Link to="/" className="register-mobile-brand">
              <Target size={23} />
              <span>HABITRA</span>
            </Link>

            <div className="register-heading">

              <div className="register-heading-icon">
                <Sparkles size={24} />
              </div>

              <span className="register-subtitle">
                CREATE YOUR ACCOUNT
              </span>

              <h2>Let's get started.</h2>

              <p>
                A few details, then you're ready to build
                a more consistent routine.
              </p>

            </div>

            <ErrorMessage message={error} />

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}
              <div className="register-field">
                <Input
                  label="Full name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                />
              </div>

              {/* EMAIL */}
              <div className="register-field">
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

              {/* PASSWORD */}
              <div className="register-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="register-password-wrapper">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />
                    }
                  </button>
                </div>

                <span className="register-field-hint">
                  Use at least 8 characters.
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="register-field">
                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <div className="register-password-wrapper">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />
                    }
                  </button>
                </div>
              </div>

              {/* TIMEZONE */}
              <div className="register-field">
                <label htmlFor="register-timezone">
                  Your time zone
                </label>

                <select
                  id="register-timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  required
                >
                  <option value="Africa/Addis_Ababa">
                    Africa/Addis Ababa (EAT)
                  </option>

                  <option value="Africa/Nairobi">
                    Africa/Nairobi (EAT)
                  </option>

                  <option value="UTC">
                    UTC / Greenwich Mean Time
                  </option>

                  <option value="America/New_York">
                    America/New York (ET)
                  </option>

                  <option value="America/Los_Angeles">
                    America/Los Angeles (PT)
                  </option>

                  <option value="Europe/London">
                    Europe/London
                  </option>

                  <option value="Asia/Dubai">
                    Asia/Dubai (GST)
                  </option>
                </select>

                <span className="register-field-hint">
                  Used to organize your daily schedule and reminders.
                </span>
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <span className="register-button-loading">
                    <span className="register-spinner" />
                    Creating account...
                  </span>
                ) : (
                  <span className="register-button-content">
                    Create account
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>

            </form>

            <div className="register-divider">
              <span>ALREADY A MEMBER?</span>
            </div>

            <p className="register-login-text">
              Already have an account?
              <Link to="/login"> Sign in</Link>
            </p>

            <div className="register-security-note">
              <ShieldCheck size={16} />
              <span>Your information is handled securely.</span>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}
