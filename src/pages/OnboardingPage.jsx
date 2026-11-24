
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import {
  ShieldCheck,
  Target,
  Bell,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Smile,
  Compass,
  BookOpen,
  Heart,
  BriefcaseBusiness,
  Users,
  Moon,
  Lightbulb,
  Coffee,
  Sparkles
} from 'lucide-react';


export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [treatmentMode, setTreatmentMode] = useState('command');

  const [selectedAreas, setSelectedAreas] = useState([
    'Health and exercise',
    'Work and business'
  ]);

  const [startOfDay, setStartOfDay] = useState('08:00');
  const [reminderPref, setReminderPref] = useState('both');

  const navigate = useNavigate();

  const treatmentOptions = [
    {
      id: 'command',
      title: 'Strict & Direct',
      subtitle: 'Clear accountability',
      icon: Zap,
      description:
        'Direct, honest guidance that keeps you focused on your commitments and taking action.'
    },
    {
      id: 'positive',
      title: 'Encouraging & Upbeat',
      subtitle: 'Positive motivation',
      icon: Smile,
      description:
        'Warm encouragement that celebrates progress and helps you stay motivated.'
    },
    {
      id: 'calm',
      title: 'Calm & Mindful',
      subtitle: 'Balanced guidance',
      icon: Compass,
      description:
        'Quiet, thoughtful guidance focused on steady progress, clarity, and reflection.'
    }
  ];

  const lifeAreas = [
    {
      id: 'Learning and education',
      icon: BookOpen,
      description: 'Study, reading and new skills'
    },
    {
      id: 'Health and exercise',
      icon: Heart,
      description: 'Movement, exercise and wellbeing'
    },
    {
      id: 'Work and business',
      icon: BriefcaseBusiness,
      description: 'Career, work and business goals'
    },
    {
      id: 'Family and relationships',
      icon: Users,
      description: 'Family, friends and relationships'
    },
    {
      id: 'Prayer and spiritual life',
      icon: Moon,
      description: 'Spiritual growth and reflection'
    },
    {
      id: 'Personal projects',
      icon: Lightbulb,
      description: 'Creative ideas and personal goals'
    },
    {
      id: 'Rest and free time',
      icon: Coffee,
      description: 'Rest, hobbies and personal time'
    }
  ];

  const toggleArea = (area) => {
    setError('');

    setSelectedAreas((previous) =>
      previous.includes(area)
        ? previous.filter((item) => item !== area)
        : [...previous, area]
    );
  };

  const goToNextStep = () => {
    setError('');

    if (step === 2 && selectedAreas.length === 0) {
      setError('Please select at least one life area to continue.');
      return;
    }

    setStep((previous) => Math.min(previous + 1, 3));
  };

  const goToPreviousStep = () => {
    setError('');
    setStep((previous) => Math.max(previous - 1, 1));
  };

  const handleFinish = () => {
    if (saving) return;

    setError('');

    if (selectedAreas.length === 0) {
      setStep(2);
      setError('Please select at least one life area.');
      return;
    }

    setSaving(true);

    try {
      const preferences = {
        treatmentMode,
        selectedAreas,
        startOfDay,
        reminderPref,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(
        'habitra_treatment_mode',
        treatmentMode
      );

      localStorage.setItem(
        'habitra_onboarding_preferences',
        JSON.stringify(preferences)
      );

      navigate('/dashboard');
    } catch (err) {
      setError('Unable to save your preferences. Please try again.');
      setSaving(false);
    }
  };

  return (
    <main className="onboarding-page">

      <div className="onboarding-decoration onboarding-decoration-one" />
      <div className="onboarding-decoration onboarding-decoration-two" />

      <div className="onboarding-container">

        {/* BRAND */}
        <header className="onboarding-header">
          <a href="/" className="onboarding-brand">
            <span className="onboarding-brand-icon">
              <Target size={23} />
            </span>
            <span>HABITRA</span>
          </a>

          <span className="onboarding-header-label">
            YOUR PERSONAL SPACE
          </span>
        </header>

        {/* INTRO */}
        <section className="onboarding-intro">
          <div className="onboarding-welcome-tag">
            <Sparkles size={15} />
            <span>LET'S MAKE IT PERSONAL</span>
          </div>

          <h1>
            Welcome to
            <span> HABITRA.</span>
          </h1>

          <p>
            A few thoughtful choices will help us create an
            experience that works with your routine and goals.
          </p>
        </section>

        {/* PROGRESS */}
        <section className="onboarding-progress">

          <div className="onboarding-progress-top">
            <span>YOUR SETUP</span>
            <strong>STEP {step} OF 3</strong>
          </div>

          <div
            className="onboarding-progress-track"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
          >
            <div
              className="onboarding-progress-fill"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="onboarding-step-labels">
            <span className={step >= 1 ? 'active' : ''}>
              Your style
            </span>
            <span className={step >= 2 ? 'active' : ''}>
              Life areas
            </span>
            <span className={step >= 3 ? 'active' : ''}>
              Schedule
            </span>
          </div>

        </section>

        {/* MAIN CARD */}
        <section className="onboarding-card">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="onboarding-step-content">

              <div className="onboarding-step-heading">
                <div className="onboarding-step-icon">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <span className="onboarding-section-label">
                    STEP 01
                  </span>
                  <h2>How should HABITRA guide you?</h2>
                </div>
              </div>

              <p className="onboarding-description">
                Everyone responds differently to accountability.
                Choose the communication style that feels right for you.
              </p>

              <div className="treatment-options">

                {treatmentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = treatmentMode === option.id;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`treatment-option ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => setTreatmentMode(option.id)}
                      aria-pressed={isSelected}
                    >
                      <span className="treatment-option-icon">
                        <Icon size={21} />
                      </span>

                      <span className="treatment-option-content">
                        <span className="treatment-option-title">
                          {option.title}
                        </span>

                        <span className="treatment-option-subtitle">
                          {option.subtitle}
                        </span>

                        <span className="treatment-option-description">
                          {option.description}
                        </span>
                      </span>

                      <span className="treatment-option-check">
                        {isSelected && <CheckCircle2 size={21} />}
                      </span>
                    </button>
                  );
                })}

              </div>

              <div className="onboarding-note">
                <Sparkles size={17} />
                <span>
                  You can change your communication style later in Settings.
                </span>
              </div>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="onboarding-step-content">

              <div className="onboarding-step-heading">
                <div className="onboarding-step-icon">
                  <Target size={23} />
                </div>

                <div>
                  <span className="onboarding-section-label">
                    STEP 02
                  </span>
                  <h2>What matters in your life?</h2>
                </div>
              </div>

              <p className="onboarding-description">
                Select the areas where you want to make progress.
                You can choose more than one.
              </p>

              <div className="life-area-summary">
                <span>Your selected areas</span>
                <strong>{selectedAreas.length} selected</strong>
              </div>

              <div className="life-area-grid">

                {lifeAreas.map((area) => {
                  const Icon = area.icon;
                  const isSelected = selectedAreas.includes(area.id);

                  return (
                    <button
                      type="button"
                      key={area.id}
                      className={`life-area-option ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => toggleArea(area.id)}
                      aria-pressed={isSelected}
                    >
                      <span className="life-area-icon">
                        <Icon size={20} />
                      </span>

                      <span className="life-area-content">
                        <strong>{area.id}</strong>
                        <small>{area.description}</small>
                      </span>

                      <span className="life-area-check">
                        {isSelected && <CheckCircle2 size={19} />}
                      </span>
                    </button>
                  );
                })}

              </div>

              <div className="onboarding-note">
                <Target size={17} />
                <span>
                  Start with the areas that matter most. You can adjust
                  your goals as your priorities change.
                </span>
              </div>

            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="onboarding-step-content">

              <div className="onboarding-step-heading">
                <div className="onboarding-step-icon">
                  <Bell size={23} />
                </div>

                <div>
                  <span className="onboarding-section-label">
                    STEP 03
                  </span>
                  <h2>Set your daily rhythm.</h2>
                </div>
              </div>

              <p className="onboarding-description">
                Choose when your day begins and how you'd like
                HABITRA to remind you about your commitments.
              </p>

              <div className="schedule-field">

                <label htmlFor="onboarding-start-time">
                  Preferred start-of-day time
                </label>

                <div className="schedule-input-wrapper">
                  <span className="schedule-input-icon">
                    <Target size={19} />
                  </span>

                  <input
                    id="onboarding-start-time"
                    type="time"
                    value={startOfDay}
                    onChange={(e) => setStartOfDay(e.target.value)}
                    required
                  />
                </div>

                <small>
                  Your daily schedule will use this preferred start time.
                </small>

              </div>

              <div className="schedule-field">

                <label htmlFor="onboarding-reminders">
                  Notification preferences
                </label>

                <div className="schedule-input-wrapper">
                  <span className="schedule-input-icon">
                    <Bell size={19} />
                  </span>

                  <select
                    id="onboarding-reminders"
                    value={reminderPref}
                    onChange={(e) => setReminderPref(e.target.value)}
                  >
                    <option value="both">
                      Email and Web Push
                    </option>
                    <option value="email">
                      Email only
                    </option>
                    <option value="push">
                      Web Push only
                    </option>
                    <option value="none">
                      No automated reminders
                    </option>
                  </select>
                </div>

                <small>
                  You can update your notification preferences later.
                </small>

              </div>

              {/* SUMMARY */}
              <div className="onboarding-summary">

                <div className="onboarding-summary-heading">
                  <CheckCircle2 size={19} />
                  <strong>Your setup summary</strong>
                </div>

                <div className="onboarding-summary-row">
                  <span>Communication style</span>
                  <strong>
                    {treatmentOptions.find(
                      (option) => option.id === treatmentMode
                    )?.title}
                  </strong>
                </div>

                <div className="onboarding-summary-row">
                  <span>Life areas</span>
                  <strong>{selectedAreas.length} selected</strong>
                </div>

                <div className="onboarding-summary-row">
                  <span>Start of day</span>
                  <strong>{startOfDay}</strong>
                </div>

                <div className="onboarding-summary-row">
                  <span>Reminders</span>
                  <strong>
                    {{
                      both: 'Email + Push',
                      email: 'Email',
                      push: 'Web Push',
                      none: 'Disabled'
                    }[reminderPref]}
                  </strong>
                </div>

              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="onboarding-error" role="alert">
              {error}
            </div>
          )}

          {/* NAVIGATION */}
          <div className="onboarding-navigation">

            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={goToPreviousStep}
                disabled={saving}
              >
                <ArrowLeft size={17} />
                Back
              </Button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={goToNextStep}
              >
                Continue
                <ArrowRight size={17} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinish}
                disabled={saving}
              >
                {saving ? (
                  'Saving preferences...'
                ) : (
                  <>
                    Complete setup
                    <CheckCircle2 size={17} />
                  </>
                )}
              </Button>
            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="onboarding-footer">
          <ShieldCheck size={16} />
          <span>
            Your journey, your pace. You can update your preferences anytime.
          </span>
        </footer>

      </div>
    </main>
  );
}
