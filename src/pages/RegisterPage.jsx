import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone, setTimezone] = useState('Africa/Addis_Ababa');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Pass fullName, email, password, and selected timezone to register service
      await register(fullName, email, password, timezone);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '3rem', marginBottom: '4rem' }}>
      <h2>Create a HABITRA Account</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Start your journey to daily consistency.
      </p>
      
      <ErrorMessage message={error} />
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <Input 
          label="Full Name" 
          value={fullName} 
          onChange={e => setFullName(e.target.value)} 
          placeholder="e.g. Abdulaziz" 
          required 
        />

        <Input 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="name@example.com" 
          required 
        />

        {/* Password field with show/hide toggle icon */}
        <div className="form-group" style={{ position: 'relative' }}>
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Input 
          label="Confirm Password" 
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          placeholder="Re-enter password" 
          required 
        />

        {/* Timezone Selection Mode */}
        <div className="form-group">
          <label>Your Time Zone</label>
          <select 
            value={timezone} 
            onChange={e => setTimezone(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}
          >
            <option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option>
            <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
            <option value="UTC">UTC / Greenwich Mean Time</option>
            <option value="America/New_York">America/New York (EST/EDT)</option>
            <option value="America/Los_Angeles">America/Los Angeles (PST/PDT)</option>
            <option value="Europe/London">Europe/London (GMT/BST)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
          </select>
        </div>

        <Button type="submit" style={{ width: '100%', marginTop: '1rem', background: 'var(--accent)', color: '#171717' }}>
          Register & Continue
        </Button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sign In</Link>
      </p>
    </div>
  );
}