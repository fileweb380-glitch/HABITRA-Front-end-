
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import axios from 'axios';

import {
  User,
  ShieldCheck,
  Clock,
  Bell,
  Lock,
  Trash2,
  LogOut,
  CheckCircle2,
  Zap,
  Smile,
  Compass,
  AlertTriangle,
  MailCheck,
  Settings2,
  LoaderCircle,
  Save,
  Eye,
  EyeOff,
  Globe,
  KeyRound
} from 'lucide-react';


const API_URL =
  `${import.meta.env.VITE_API_URL || 'https://habitra-backend-1.onrender.com'}/api`;

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const treatmentOptions = [
  {
    id: 'command',
    title: 'Strict & Direct',
    subtitle: 'Clear, direct, no-nonsense accountability.',
    description: 'HABITRA keeps you focused and accountable.',
    icon: Zap
  },
  {
    id: 'positive',
    title: 'Encouraging & Upbeat',
    subtitle: 'Warm support and positive reinforcement.',
    description: 'HABITRA encourages you through your journey.',
    icon: Smile
  },
  {
    id: 'calm',
    title: 'Calm & Mindful',
    subtitle: 'Quiet, balanced guidance.',
    description: 'HABITRA helps you build steady consistency.',
    icon: Compass
  }
];

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error ||
  err.response?.data?.message ||
  err.message ||
  fallback;

export default function SettingsPage() {
  const { user, setUser, logout, resendVerification } = useAuth();
  const navigate = useNavigate();

  // Profile
  const [fullName, setFullName] = useState(
    user?.fullName || user?.name || ''
  );
  const [email, setEmail] = useState(user?.email || '');

  // Preferences
  const [treatmentMode, setTreatmentMode] = useState(
    localStorage.getItem('habitra_treatment_mode') ||
    user?.treatmentMode ||
    'command'
  );

  const [startOfDay, setStartOfDay] = useState(
    user?.startOfDay || '08:00'
  );

  const [timezone, setTimezone] = useState(
    user?.timezone || 'Africa/Addis_Ababa'
  );

  const [reminderPref, setReminderPref] = useState(
    user?.reminderPref || 'both'
  );

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Independent loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Sync context changes
  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || user.name || '');
    setEmail(user.email || '');
    setStartOfDay(user.startOfDay || '08:00');
    setTimezone(user.timezone || 'Africa/Addis_Ababa');
    setReminderPref(user.reminderPref || 'both');

    if (user.treatmentMode) {
      setTreatmentMode(user.treatmentMode);
    }
  }, [user]);

  const getToken = () => {
    const token = localStorage.getItem('habitra_token');

    if (!token) {
      throw new Error('Your session has expired. Please log in again.');
    }

    return token;
  };

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  // =====================================
  // RESEND EMAIL VERIFICATION
  // =====================================

  const handleResendVerification = async () => {
    if (resendingEmail) return;

    setResendingEmail(true);

    try {
      const token = getToken();

      const res = await axios.post(
        `${API_URL}/auth/resend-verification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        res.data?.message ||
        'Verification email sent successfully!'
      );
    } catch (err) {
      console.error('Verification email error:', err);

      alert(
        getErrorMessage(
          err,
          'Failed to resend verification email.'
        )
      );
    } finally {
      setResendingEmail(false);
    }
  };

  // =====================================
  // PUSH NOTIFICATION SUBSCRIPTION
  // =====================================

  const getPushSubscription = async () => {
    const shouldEnablePush =
      reminderPref === 'push' || reminderPref === 'both';

    if (!shouldEnablePush) return null;

    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('Notification' in window)
    ) {
      console.warn('This browser does not support web push notifications.');
      return null;
    }

    try {
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        console.warn('Notification permission was not granted.');
        return null;
      }

      const registration = await navigator.serviceWorker.ready;

      // Reuse an existing subscription when possible.
      let subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        return subscription.toJSON();
      }

      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        console.warn('VAPID public key is missing.');
        return null;
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      return subscription.toJSON();
    } catch (err) {
      console.warn('Push subscription error:', err);
      return null;
    }
  };

  // =====================================
  // UPDATE PROFILE & GENERAL SETTINGS
  // =====================================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (savingProfile) return;

    if (!fullName.trim() || !email.trim()) {
      alert('Please enter your full name and email address.');
      return;
    }

    setSavingProfile(true);

    try {
      const token = getToken();
      const pushSubscription = await getPushSubscription();

      const payload = {
        name: fullName.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        startOfDay,
        timezone,
        reminderPref,
        treatmentMode,
        pushSubscription
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      let res;

      try {
        res = await axios.patch(
          `${API_URL}/users/profile`,
          payload,
          config
        );
      } catch (patchErr) {
        if (patchErr.response?.status === 404) {
          res = await axios.patch(
            `${API_URL}/users/me`,
            payload,
            config
          );
        } else {
          throw patchErr;
        }
      }

      localStorage.setItem(
        'habitra_treatment_mode',
        treatmentMode
      );

      const updatedUser = res.data?.user || res.data;

      if (setUser) {
        setUser((previousUser) => ({
          ...previousUser,
          ...(updatedUser || {}),
          fullName: fullName.trim(),
          name: fullName.trim(),
          email: email.trim(),
          startOfDay,
          timezone,
          reminderPref,
          treatmentMode
        }));
      }

      alert(
        res.data?.message ||
        'Your profile and preferences have been updated successfully!'
      );
    } catch (err) {
      console.error('Profile update error:', err);

      alert(
        getErrorMessage(
          err,
          'Failed to update your settings.'
        )
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =====================================
  // CHANGE PASSWORD
  // =====================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (changingPassword) return;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert('Please complete all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      alert('Your new password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('Your new passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      alert('Your new password must be different from your current password.');
      return;
    }

    setChangingPassword(true);

    try {
      const token = getToken();

      const res = await axios.post(
        `${API_URL}/users/change-password`,
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      alert(
        res.data?.message ||
        'Your password has been updated successfully!'
      );
    } catch (err) {
      console.error('Password update error:', err);

      alert(
        getErrorMessage(
          err,
          'Failed to change your password.'
        )
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================
  // DELETE ACCOUNT
  // =====================================

  const handleDeleteAccount = async () => {
    if (deletingAccount) return;

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your HABITRA account and its data? This action cannot be undone.'
    );

    if (!confirmed) return;

    const finalConfirmation = window.confirm(
      'Please confirm one more time: permanently delete this account?'
    );

    if (!finalConfirmation) return;

    setDeletingAccount(true);

    try {
      const token = getToken();

      const res = await axios.delete(
        `${API_URL}/users/account`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        res.data?.message ||
        'Your account has been deleted successfully.'
      );

      await Promise.resolve(logout());
      navigate('/');
    } catch (err) {
      console.error('Account deletion error:', err);

      alert(
        getErrorMessage(
          err,
          'Failed to delete your account.'
        )
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to sign out of HABITRA?'
    );

    if (!confirmed) return;

    try {
      await Promise.resolve(logout());
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      alert('Unable to sign out. Please try again.');
    }
  };

  return (
    <main className="settings-page">
      <div className="settings-container">

        {/* PAGE HEADER */}
        <header className="settings-header">
          <div className="settings-header-content">
            <div className="settings-eyebrow">
              <Settings2 size={15} />
              PERSONALIZE YOUR EXPERIENCE
            </div>

            <h1>
              Your space.
              <span> Your settings.</span>
            </h1>

            <p>
              Manage your account, build your preferred routine,
              and decide how HABITRA supports your consistency.
            </p>
          </div>

          <div className="settings-header-decoration">
            <Settings2 size={42} />
          </div>
        </header>

        {/* EMAIL VERIFICATION */}
        <section
          className={`settings-verification ${
            user?.isVerified
              ? 'settings-verification-success'
              : 'settings-verification-warning'
          }`}
        >
          <div className="settings-verification-content">
            <div className="settings-verification-icon">
              {user?.isVerified ? (
                <MailCheck size={23} />
              ) : (
                <AlertTriangle size={23} />
              )}
            </div>

            <div>
              <h3>
                {user?.isVerified
                  ? 'Your email is verified'
                  : 'Email verification required'}
              </h3>

              <p>
                {user?.isVerified
                  ? 'Your email address is verified and your account is active.'
                  : 'Verify your email address to help secure your HABITRA account.'}
              </p>
            </div>
          </div>

          {!user?.isVerified && (
            <button
              type="button"
              className="settings-verify-button"
              onClick={handleResendVerification}
              disabled={resendingEmail}
            >
              {resendingEmail ? (
                <>
                  <LoaderCircle className="settings-spin" size={16} />
                  Sending...
                </>
              ) : (
                'Resend verification'
              )}
            </button>
          )}
        </section>

        {/* GENERAL SETTINGS FORM */}
        <form
          className="settings-form"
          onSubmit={handleUpdateProfile}
        >

          {/* PROFILE */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-card-icon">
                <User size={21} />
              </div>

              <div>
                <span className="settings-section-label">YOUR IDENTITY</span>
                <h2>Profile details</h2>
                <p>Keep your personal information up to date.</p>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <label htmlFor="settings-name">Full name</label>
                <input
                  id="settings-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="settings-field">
                <label htmlFor="settings-email">Email address</label>
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          </section>

          {/* ACCOUNTABILITY STYLE */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-card-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <span className="settings-section-label">YOUR EXPERIENCE</span>
                <h2>Accountability style</h2>
                <p>
                  Choose how HABITRA communicates with you.
                </p>
              </div>
            </div>

            <div className="settings-treatment-options">
              {treatmentOptions.map((option) => {
                const Icon = option.icon;
                const selected = treatmentMode === option.id;

                return (
                  <button
                    type="button"
                    key={option.id}
                    className={`settings-treatment-option ${
                      selected ? 'selected' : ''
                    }`}
                    onClick={() => setTreatmentMode(option.id)}
                    aria-pressed={selected}
                  >
                    <div className="settings-treatment-icon">
                      <Icon size={21} />
                    </div>

                    <div className="settings-treatment-copy">
                      <strong>{option.title}</strong>
                      <span>{option.subtitle}</span>
                    </div>

                    <div className="settings-treatment-check">
                      {selected && <CheckCircle2 size={20} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SCHEDULE */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-card-icon">
                <Clock size={21} />
              </div>

              <div>
                <span className="settings-section-label">YOUR DAILY ROUTINE</span>
                <h2>Schedule & timezone</h2>
                <p>Set your preferred daily starting point.</p>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field">
                <label htmlFor="settings-start-time">
                  <Clock size={15} />
                  Start-of-day time
                </label>

                <input
                  id="settings-start-time"
                  type="time"
                  value={startOfDay}
                  onChange={(e) => setStartOfDay(e.target.value)}
                  required
                />

                <small>When your HABITRA day begins.</small>
              </div>

              <div className="settings-field">
                <label htmlFor="settings-timezone">
                  <Globe size={15} />
                  Local timezone
                </label>

                <select
                  id="settings-timezone"
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
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">
                    America/New York
                  </option>
                  <option value="America/Los_Angeles">
                    America/Los Angeles
                  </option>
                  <option value="Europe/London">
                    Europe/London
                  </option>
                  <option value="Asia/Dubai">
                    Asia/Dubai
                  </option>
                </select>

                <small>Used for your schedule and reminders.</small>
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-card-icon">
                <Bell size={21} />
              </div>

              <div>
                <span className="settings-section-label">STAY ON TRACK</span>
                <h2>Notification preferences</h2>
                <p>Choose how you want to receive reminders.</p>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="settings-reminders">
                Reminder channels
              </label>

              <select
                id="settings-reminders"
                value={reminderPref}
                onChange={(e) => setReminderPref(e.target.value)}
              >
                <option value="both">
                  Email and web push notifications
                </option>
                <option value="email">Email only</option>
                <option value="push">Web push only</option>
                <option value="none">No automated reminders</option>
              </select>

              <small>
                Browser permission is required for web push notifications.
              </small>
            </div>
          </section>

          {/* SAVE SETTINGS */}
          <div className="settings-save-area">
            <div className="settings-save-description">
              <CheckCircle2 size={17} />
              Your changes are saved to your account.
            </div>

            <button
              type="submit"
              className="settings-primary-button"
              disabled={savingProfile}
            >
              {savingProfile ? (
                <>
                  <LoaderCircle className="settings-spin" size={18} />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save general settings
                </>
              )}
            </button>
          </div>
        </form>

        {/* PASSWORD & SECURITY */}
        <section className="settings-card settings-security-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <Lock size={21} />
            </div>

            <div>
              <span className="settings-section-label">ACCOUNT PROTECTION</span>
              <h2>Password & security</h2>
              <p>Update your password to keep your account secure.</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="settings-field settings-password-field">
              <label htmlFor="current-password">Current password</label>

              <div className="settings-password-input">
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="settings-fields-grid">
              <div className="settings-field settings-password-field">
                <label htmlFor="new-password">New password</label>

                <div className="settings-password-input">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="settings-field settings-password-field">
                <label htmlFor="confirm-password">Confirm new password</label>

                <div className="settings-password-input">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Enter new password again"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-password-footer">
              <div className="settings-password-hint">
                <KeyRound size={16} />
                Use a password you haven't used elsewhere.
              </div>

              <button
                type="submit"
                className="settings-secondary-button"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <LoaderCircle className="settings-spin" size={17} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={17} />
                    Update password
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ACCOUNT ACTIONS */}
        <section className="settings-danger-card">
          <div className="settings-danger-heading">
            <AlertTriangle size={21} />
            <div>
              <h2>Account actions</h2>
              <p>Manage your HABITRA session and account.</p>
            </div>
          </div>

          <div className="settings-action-row">
            <div className="settings-action-copy">
              <strong>Sign out</strong>
              <span>Sign out of HABITRA on this device.</span>
            </div>

            <button
              type="button"
              className="settings-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>

          <div className="settings-action-row settings-delete-row">
            <div className="settings-action-copy">
              <strong>Delete account</strong>
              <span>
                Permanently delete your account and associated data.
              </span>
            </div>

            <button
              type="button"
              className="settings-delete-button"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? (
                <>
                  <LoaderCircle className="settings-spin" size={17} />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={17} />
                  Delete account
                </>
              )}
            </button>
          </div>
        </section>

        <footer className="settings-footer">
          <span>HABITRA</span>
          <p>Build consistency. One day at a time.</p>
        </footer>

      </div>
    </main>
  );
}
