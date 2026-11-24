import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  Zap, 
  Smile, 
  Compass, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Plus, 
  ShieldAlert, 
  TrendingUp, 
  Target,
  Repeat
} from 'lucide-react';
import axios from 'axios';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayData, setTodayData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Treatment mode read from user state or localStorage
  const treatmentMode = user?.treatmentMode || localStorage.getItem('habitra_treatment_mode') || 'command';

  // State for quick inline check-in modal/drawer
  const [activeCheckInItem, setActiveCheckInItem] = useState(null);
  const [missedReason, setMissedReason] = useState('Ran out of time');
  const [missedNote, setMissedNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('habitra_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [reportRes, commRes, habitsRes, goalsRes] = await Promise.all([
        axios.get(`https://habitra-backend-1.onrender.com/api/reports/daily?date=${todayStr}`, { headers }),
        axios.get(`https://habitra-backend-1.onrender.com/api/commitments?scheduledDate=${todayStr}`, { headers }),
        axios.get('https://habitra-backend-1.onrender.com/api/habits', { headers }),
        axios.get('https://habitra-backend-1.onrender.com/api/goals', { headers })
      ]);

      setTodayData({
        ...reportRes.data,
        commitments: commRes.data || []
      });
      setHabits(habitsRes.data || []);
      setGoals(goalsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId, status, reason = null, note = '') => {
    try {
      const token = localStorage.getItem('habitra_token');
      await axios.patch(`https://habitra-backend-1.onrender.com/api/commitments/${itemId}/status`, {
        status,
        missedReason: status === 'Missed' ? reason : undefined,
        missedNote: status === 'Missed' ? note : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveCheckInItem(null);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to update check-in status');
    }
  };

  // Tone generator based on treatment mode
  const renderToneHeader = () => {
    if (treatmentMode === 'command') {
      return {
        icon: Zap,
        title: `Execute Today's Plan, ${user?.fullName || user?.name || 'Developer'}.`,
        subtitle: 'No excuses, no artificial guilt. Review your commitments and lock in progress.',
        badge: 'Strict & Direct Mode'
      };
    } else if (treatmentMode === 'positive') {
      return {
        icon: Smile,
        title: `Ready for a Great Day, ${user?.fullName || user?.name || 'Friend'}?`,
        subtitle: 'Every small win compounds over time. Celebrate your consistency steps today!',
        badge: 'Encouraging Mode'
      };
    } else {
      return {
        icon: Compass,
        title: `Steady Progress, ${user?.fullName || user?.name || 'User'}.`,
        subtitle: 'Focus on clear execution, honest reflection, and peaceful consistency.',
        badge: 'Calm & Mindful Mode'
      };
    }
  };

  const tone = renderToneHeader();
  const ToneIcon = tone.icon;

  return (
    <div className="dashboard-page">
      
      {/* 1. Dynamic Hero Tone Banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div>
            <span className="dashboard-tone-badge">
              {tone.badge}
            </span>
            <h1 className="dashboard-hero-title">{tone.title}</h1>
            <p className="dashboard-hero-subtitle">{tone.subtitle}</p>
          </div>
          
          <div className="dashboard-hero-icon">
            <ToneIcon size={26} />
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '65px 20px' }}>
          <p>Gathering real-time consistency metrics...</p>
        </div>
      ) : (
        <>
          {/* 2. Key Metrics Row */}
          <div className="dashboard-metrics">
            <div className="dashboard-metric-card metric-rate">
              <span>Today's Rate</span>
              <div>
                {todayData?.completionRate || 0}%
              </div>
            </div>

            <div className="dashboard-metric-card metric-completed">
              <span>Completed</span>
              <div>
                {todayData?.completedCount || 0}
              </div>
            </div>

            <div className="dashboard-metric-card metric-pending">
              <span>Pending Check-ins</span>
              <div>
                {todayData?.unconfirmedCount || 0}
              </div>
            </div>

            <div className="dashboard-metric-card metric-action">
              <Link to="/plan-tomorrow">
                <button type="button" style={{ width: '100%', cursor: 'pointer' }}>
                  <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Plan Tomorrow
                </button>
              </Link>
            </div>
          </div>

          {/* 3. Today's Commitment Timeline & Check-in Mirror */}
          <div className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Today's Schedule & Check-ins</h2>
                <p>Honest evaluation of planned commitments for {todayStr}</p>
              </div>
              <Link to="/reports/daily">
                Full Report <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </Link>
            </div>

            {todayData?.commitments && todayData.commitments.length > 0 ? (
              <div className="commitment-list">
                {todayData.commitments.map((item) => {
                  let statusClass = '';
                  if (item.status === 'Completed') statusClass = 'status-completed';
                  else if (item.status === 'Missed') statusClass = 'status-missed';

                  return (
                    <div 
                      key={item._id} 
                      className={`commitment-item ${statusClass}`}
                    >
                      <div className="commitment-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong>{item.title}</strong>
                          {item.category && (
                            <span className="dashboard-tone-badge" style={{ padding: '2px 6px', fontSize: '9px' }}>
                              {item.category}
                            </span>
                          )}
                        </div>

                        <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={14} />
                          <span>{item.startTime ? `${item.startTime} (${item.durationMinutes} mins)` : 'Flexible timing'}</span>
                        </div>

                        {item.status === 'Missed' && item.missedReason && (
                          <div style={{ fontSize: '0.83rem', color: 'var(--dash-red)', marginTop: '0.3rem', fontWeight: 500 }}>
                            Reason: {item.missedReason} {item.missedNote ? `— "${item.missedNote}"` : ''}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for Unconfirmed / Status Toggle */}
                      <div className="commitment-actions">
                        {item.status === 'Completed' ? (
                          <span style={{ color: 'var(--dash-green)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle2 size={18} /> Completed
                          </span>
                        ) : item.status === 'Missed' ? (
                          <span style={{ color: 'var(--dash-red)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <XCircle size={18} /> Missed
                          </span>
                        ) : (
                          <>
                            <button 
                              type="button"
                              onClick={() => handleStatusUpdate(item._id, 'Completed')} 
                              style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', cursor: 'pointer' }}
                            >
                              Done
                            </button>
                            <button 
                              type="button"
                              onClick={() => setActiveCheckInItem(item)} 
                              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', cursor: 'pointer' }}
                            >
                              Missed?
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p>No commitments planned for today yet.</p>
                <Link to="/plan-tomorrow" style={{ display: 'inline-block', marginTop: '0.75rem' }}>
                  <button type="button" style={{ background: 'var(--dash-forest)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '11px', cursor: 'pointer', fontWeight: 700 }}>Plan Your Schedule</button>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Active Habits Widget (Clickable Cards) */}
          <div className="dashboard-section">
            <div className="section-heading">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Repeat size={20} style={{ color: 'var(--dash-forest)' }} />
                <h2>All Active Habits</h2>
              </div>
              <Link to="/habits">Manage Habits</Link>
            </div>

            {habits.length > 0 ? (
              <div className="dashboard-card-grid">
                {habits.map((h) => (
                  <Link 
                    key={h._id} 
                    to={`/habits/${h._id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div className="dashboard-item-card habit-item-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <strong>{h.title}</strong>
                        <span>
                          {h.frequency}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>
                        {h.category} • {h.time ? `Scheduled at ${h.time}` : 'Flexible timing'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No habits created yet.</p>
            )}
          </div>

          {/* 5. Active Goals Widget */}
          <div className="dashboard-section">
            <div className="section-heading">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} style={{ color: 'var(--dash-forest)' }} />
                <h2>Active Goals</h2>
              </div>
              <Link to="/goals">Manage Goals</Link>
            </div>

            {goals.length > 0 ? (
              <div className="dashboard-card-grid">
                {goals.slice(0, 4).map((g) => {
                  const completed = g.milestones ? g.milestones.filter(m => m.completed).length : 0;
                  const total = g.milestones ? g.milestones.length : 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={g._id} className="dashboard-item-card goal-item-card">
                      <strong>{g.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', margin: '0.3rem 0 0.6rem' }}>
                        {completed} of {total} milestones
                      </div>
                      <div className="goal-progress-track">
                        <div className="goal-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No active goals set. Anchor your daily habits to a goal!</p>
            )}
          </div>
        </>
      )}

      {/* 6. Non-Guilt Missed Check-in Modal */}
      {activeCheckInItem && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3 style={{ marginBottom: '0.5rem' }}>Honest Reflection Check-in</h3>
            <p style={{ marginBottom: '1.25rem' }}>
              Why were you unable to complete <strong>"{activeCheckInItem.title}"</strong>? HABITRA records your reason without shame or auto-rescheduling.
            </p>

            <div className="form-group">
              <label>Select Reason</label>
              <select 
                value={missedReason} 
                onChange={e => setMissedReason(e.target.value)}
              >
                <option value="Ran out of time">Ran out of time</option>
                <option value="Urgent situation came up">Urgent situation came up</option>
                <option value="Felt tired / low energy">Felt tired / low energy</option>
                <option value="Forgot about the schedule">Forgot about the schedule</option>
                <option value="Poor planning / underestimated time">Poor planning / underestimated time</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Optional Reflection Note</label>
              <input 
                type="text" 
                value={missedNote} 
                onChange={e => setMissedNote(e.target.value)}
                placeholder="e.g. Server emergency at work"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setActiveCheckInItem(null)}>Cancel</Button>
              <button 
                type="button"
                onClick={() => handleStatusUpdate(activeCheckInItem._id, 'Missed', missedReason, missedNote)}
                style={{ background: 'var(--dash-red)', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}
              >
                Record Reason
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}