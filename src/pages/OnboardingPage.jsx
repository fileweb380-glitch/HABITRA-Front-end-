import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { ShieldCheck, Target, Bell, ArrowRight, CheckCircle2, Zap, Smile, Compass } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  
  // 1. Treatment Mode Choice
  const [treatmentMode, setTreatmentMode] = useState('command'); // Default: 'command' | 'positive' | 'calm'
  
  // 2. Life Areas Choice
  const [selectedAreas, setSelectedAreas] = useState(['Health and exercise', 'Work and business']);
  
  // 3. Reminders Choice
  const [startOfDay, setStartOfDay] = useState('08:00');
  const [reminderPref, setReminderPref] = useState('both');
  
  const navigate = useNavigate();

  const treatmentOptions = [
    {
      id: 'command',
      title: 'Strict & Direct (Command)',
      icon: Zap,
      description: 'Clear, direct, no-nonsense accountability. Keeps you sharp and focused on execution without fluff.'
    },
    {
      id: 'positive',
      title: 'Encouraging & Upbeat (Happy)',
      icon: Smile,
      description: 'Warm, highly supportive tone. Celebrates every win and offers positive reinforcement for daily progress.'
    },
    {
      id: 'calm',
      title: 'Calm & Mindful',
      icon: Compass,
      description: 'Quiet, balanced guidance. Focuses on steady consistency, clarity, and reflection.'
    }
  ];

  const lifeAreas = [
    'Learning and education',
    'Health and exercise',
    'Work and business',
    'Family and relationships',
    'Prayer and spiritual life',
    'Personal projects',
    'Rest and free time'
  ];

  const toggleArea = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleFinish = async () => {
    // Save chosen treatmentMode and preferences to user account / backend here if needed
    localStorage.setItem('habitra_treatment_mode', treatmentMode);
    
    // Proceed directly to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '640px', marginTop: '3rem', marginBottom: '4rem' }}>
      
      {/* Header Progress */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Welcome to HABITRA</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Personalize your experience • Step {step} of 3</p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        
        {/* STEP 1: How should HABITRA treat you? */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>How Should HABITRA Treat You?</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Select the interaction style that best keeps you accountable. HABITRA will tailor its notifications, check-ins, and messages to match:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {treatmentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = treatmentMode === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setTreatmentMode(opt.id)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius)',
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                      backgroundColor: isSelected ? 'var(--bg-secondary)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isSelected ? 'var(--accent)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: isSelected ? '#171717' : 'var(--text-primary)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '1rem' }}>{opt.title}</strong>
                        {isSelected && <CheckCircle2 size={18} style={{ color: 'var(--accent)' }} />}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setStep(2)} style={{ background: 'var(--accent)', color: '#171717' }}>
                Next: Select Life Areas <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Core Life Areas */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Select Core Life Areas</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Choose the areas of life you want to focus on:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {lifeAreas.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <div
                    key={area}
                    onClick={() => toggleArea(area)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius)',
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-color)'}`,
                      backgroundColor: isSelected ? 'var(--bg-secondary)' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '0.9rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{area}</span>
                    {isSelected && <CheckCircle2 size={16} style={{ color: 'var(--accent)' }} />}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} style={{ background: 'var(--accent)', color: '#171717' }}>
                Next: Schedule <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Reminders & Finish */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Reminders & Schedule</h3>
            </div>

            <div className="form-group">
              <label>Preferred Start-of-Day Time</label>
              <input
                type="time"
                value={startOfDay}
                onChange={(e) => setStartOfDay(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label>Notification Channels</label>
              <select
                value={reminderPref}
                onChange={(e) => setReminderPref(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: '#ffffff' }}
              >
                <option value="both">Both Email & Web Push Notifications</option>
                <option value="email">Email Reminders Only</option>
                <option value="push">Web Push Notifications Only</option>
                <option value="none">No Automated Reminders</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleFinish} style={{ background: 'var(--accent)', color: '#171717' }}>
                Complete Setup & Go to Dashboard <CheckCircle2 size={16} />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}