
import React, { useEffect, useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit3,
  X,
  Flag,
  Sparkles,
  LoaderCircle,
  Clock3
} from 'lucide-react';
import axios from 'axios';


const API_BASE_URL = 'https://habitra-backend-1.onrender.com';

const CATEGORIES = [
  'Work and business',
  'Learning and education',
  'Health and exercise',
  'Personal projects',
  'Prayer and spiritual life'
];

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);

  // Create form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal projects');
  const [targetDate, setTargetDate] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');

  // Edit form
  const [editingGoal, setEditingGoal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('Personal projects');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [editMilestonesText, setEditMilestonesText] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState(null);
  const [updatingMilestone, setUpdatingMilestone] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getToken = () => {
    const token = localStorage.getItem('habitra_token');

    if (!token) {
      alert('🔒 Your session has expired. Please log in again.');
      return null;
    }

    return token;
  };

  const getErrorMessage = (err, fallback) => (
    err.response?.data?.error ||
    err.response?.data?.message ||
    fallback
  );

  // Fetch goals
  const fetchGoals = async () => {
    setLoading(true);

    const token = localStorage.getItem('habitra_token');

    if (!token) {
      setLoading(false);
      alert('🔒 Please log in to view your goals.');
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/goals`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const fetchedGoals = Array.isArray(response.data)
        ? response.data
        : response.data?.goals || [];

      setGoals(fetchedGoals);

    } catch (err) {
      console.error('Failed to fetch goals:', err);

      alert(
        `❌ Failed to load goals!\n\n${getErrorMessage(
          err,
          'Please refresh the page and try again.'
        )}`
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Create milestones from textarea
  const buildMilestones = (text) => (
    text
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({
        title: item,
        completed: false
      }))
  );

  // Create goal
  const handleCreateGoal = async (e) => {
    e.preventDefault();

    if (isCreating) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert('⚠️ Please enter a goal title.');
      return;
    }

    if (!targetDate) {
      alert('⚠️ Please select a target completion date.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(`${targetDate}T00:00:00`);

    if (selectedDate < today) {
      alert('⚠️ Your target date cannot be in the past.');
      return;
    }

    const token = getToken();
    if (!token) return;

    setIsCreating(true);

    try {
      const milestones = buildMilestones(milestonesInput);

      const response = await axios.post(
        `${API_BASE_URL}/api/goals`,
        {
          title: trimmedTitle,
          description: description.trim(),
          category,
          targetDate,
          milestones
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGoals((previous) => [...previous, response.data]);

      alert(
        `✅ Goal Created Successfully!\n\n"${trimmedTitle}" has been added to your goals.`
      );

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Personal projects');
      setTargetDate('');
      setMilestonesInput('');
      setShowCreateModal(false);

    } catch (err) {
      console.error('Create goal error:', err);

      alert(
        `❌ Unable to create goal!\n\n${getErrorMessage(
          err,
          'Failed to create goal. Please try again.'
        )}`
      );

    } finally {
      setIsCreating(false);
    }
  };

  // Open edit modal
  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title || '');
    setEditDescription(goal.description || '');
    setEditCategory(goal.category || 'Personal projects');

    setEditTargetDate(
      goal.targetDate
        ? new Date(goal.targetDate).toISOString().split('T')[0]
        : ''
    );

    setEditMilestonesText(
      goal.milestones
        ? goal.milestones.map((milestone) => milestone.title).join('\n')
        : ''
    );
  };

  // Close edit modal
  const closeEditModal = () => {
    if (isUpdating) return;
    setEditingGoal(null);
  };

  // Update goal
  const handleUpdateGoal = async (e) => {
    e.preventDefault();

    if (isUpdating || !editingGoal) return;

    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      alert('⚠️ Please enter a goal title.');
      return;
    }

    if (!editTargetDate) {
      alert('⚠️ Please select a target completion date.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(`${editTargetDate}T00:00:00`);

    if (selectedDate < today) {
      alert('⚠️ Your target date cannot be in the past.');
      return;
    }

    const token = getToken();
    if (!token) return;

    const updatedMilestones = buildMilestones(editMilestonesText).map(
      (milestone) => {
        const existing = editingGoal.milestones?.find(
          (item) => item.title === milestone.title
        );

        return {
          ...milestone,
          completed: existing ? existing.completed : false
        };
      }
    );

    setIsUpdating(true);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/goals/${editingGoal._id}`,
        {
          title: trimmedTitle,
          description: editDescription.trim(),
          category: editCategory,
          targetDate: editTargetDate,
          milestones: updatedMilestones
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGoals((previous) =>
        previous.map((goal) =>
          goal._id === editingGoal._id ? response.data : goal
        )
      );

      setEditingGoal(null);

      alert(
        `✅ Goal Updated!\n\n"${trimmedTitle}" has been successfully updated.`
      );

    } catch (err) {
      console.error('Update goal error:', err);

      alert(
        `❌ Unable to update goal!\n\n${getErrorMessage(
          err,
          'Failed to update goal. Please try again.'
        )}`
      );

    } finally {
      setIsUpdating(false);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    if (deletingGoalId) return;

    const goal = goals.find((item) => item._id === goalId);
    if (!goal) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${goal.title}"?`
    );

    if (!confirmed) return;

    const token = getToken();
    if (!token) return;

    setDeletingGoalId(goalId);

    try {
      await axios.delete(
        `${API_BASE_URL}/api/goals/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGoals((previous) =>
        previous.filter((item) => item._id !== goalId)
      );

      alert(`✅ "${goal.title}" has been deleted successfully.`);

    } catch (err) {
      console.error('Delete goal error:', err);

      alert(
        `❌ Failed to delete goal!\n\n${getErrorMessage(
          err,
          'Please try again.'
        )}`
      );

    } finally {
      setDeletingGoalId(null);
    }
  };

  // Toggle milestone completion
  const toggleMilestone = async (goalId, milestoneIndex) => {
    const actionKey = `${goalId}-${milestoneIndex}`;

    if (updatingMilestone !== null) return;

    const goal = goals.find((item) => item._id === goalId);
    if (!goal) return;

    const milestones = [...(goal.milestones || [])];

    if (!milestones[milestoneIndex]) return;

    const updatedMilestones = milestones.map((milestone, index) => (
      index === milestoneIndex
        ? {
            ...milestone,
            completed: !milestone.completed
          }
        : milestone
    ));

    const token = getToken();
    if (!token) return;

    setUpdatingMilestone(actionKey);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/goals/${goalId}`,
        {
          milestones: updatedMilestones
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGoals((previous) =>
        previous.map((item) =>
          item._id === goalId ? response.data : item
        )
      );

      const completed = updatedMilestones[milestoneIndex].completed;

      alert(
        completed
          ? `✅ Milestone Completed!\n\n"${updatedMilestones[milestoneIndex].title}"`
          : `↩️ Milestone Reopened!\n\n"${updatedMilestones[milestoneIndex].title}"`
      );

    } catch (err) {
      console.error('Milestone update error:', err);

      alert(
        `❌ Failed to update milestone!\n\n${getErrorMessage(
          err,
          'Please try again.'
        )}`
      );

    } finally {
      setUpdatingMilestone(null);
    }
  };

  // Format target date
  const formatDate = (date) => {
    if (!date) return 'No target date';

    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="goals-page">
      <div className="goals-container">

        {/* Header */}
        <header className="goals-header">
          <div className="goals-header-icon">
            <Target size={26} />
          </div>

          <div className="goals-header-content">
            <span className="goals-eyebrow">
              YOUR BIGGER PICTURE
            </span>

            <h1>Goals & Milestones</h1>

            <p>
              Turn your long-term vision into smaller,
              meaningful achievements.
            </p>
          </div>

          <button
            type="button"
            className="new-goal-button"
            onClick={() => setShowCreateModal((previous) => !previous)}
            disabled={isCreating}
          >
            {showCreateModal ? <X size={18} /> : <Plus size={18} />}
            {showCreateModal ? 'Close Form' : 'New Goal'}
          </button>
        </header>

        {/* Quick Stats */}
        <section className="goals-stats">
          <div className="goal-stat-card">
            <div className="goal-stat-icon">
              <Target size={19} />
            </div>
            <div>
              <strong>{goals.length}</strong>
              <span>Total Goals</span>
            </div>
          </div>

          <div className="goal-stat-card">
            <div className="goal-stat-icon">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <strong>
                {goals.reduce(
                  (total, goal) =>
                    total +
                    (goal.milestones || []).filter(
                      (milestone) => milestone.completed
                    ).length,
                  0
                )}
              </strong>
              <span>Completed Milestones</span>
            </div>
          </div>

          <div className="goal-stat-card">
            <div className="goal-stat-icon">
              <Flag size={19} />
            </div>
            <div>
              <strong>
                {goals.filter((goal) => {
                  const milestones = goal.milestones || [];
                  return (
                    milestones.length > 0 &&
                    milestones.every((item) => item.completed)
                  );
                }).length}
              </strong>
              <span>Goals Completed</span>
            </div>
          </div>
        </section>

        {/* Create Goal Form */}
        {showCreateModal && (
          <section className="goal-form-card">
            <div className="goal-form-heading">
              <div className="goal-form-icon">
                <Sparkles size={21} />
              </div>

              <div>
                <span className="goals-eyebrow">NEW BEGINNING</span>
                <h2>Create a New Goal</h2>
                <p>Define what you want to achieve.</p>
              </div>

              <button
                type="button"
                className="icon-button close-create-button"
                onClick={() => setShowCreateModal(false)}
                disabled={isCreating}
                aria-label="Close create form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal}>
              <div className="goal-form-group">
                <label htmlFor="goalTitle">Goal Title</label>
                <input
                  id="goalTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Become a Full-Stack Developer"
                  maxLength={120}
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="goal-form-group">
                <label htmlFor="goalDescription">Description</label>
                <textarea
                  id="goalDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why does this goal matter to you?"
                  rows={3}
                  disabled={isCreating}
                />
              </div>

              <div className="goal-form-grid">
                <div className="goal-form-group">
                  <label htmlFor="goalCategory">Life Area / Category</label>
                  <select
                    id="goalCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isCreating}
                  >
                    {CATEGORIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="goal-form-group">
                  <label htmlFor="goalDate">Target Completion Date</label>
                  <input
                    id="goalDate"
                    type="date"
                    value={targetDate}
                    min={new Date().toLocaleDateString('en-CA')}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="goal-form-group">
                <label htmlFor="goalMilestones">
                  Milestones
                  <span className="optional-label">Optional</span>
                </label>

                <textarea
                  id="goalMilestones"
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  placeholder={
                    'Enter one milestone per line:\n' +
                    'Master React UI and CSS\n' +
                    'Build Express REST APIs\n' +
                    'Connect MongoDB Database'
                  }
                  rows={5}
                  disabled={isCreating}
                />

                <span className="goal-field-hint">
                  Each line becomes a separate milestone.
                </span>
              </div>

              <button
                type="submit"
                className="goal-submit-button"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <LoaderCircle className="spinning-icon" size={19} />
                    Saving Goal...
                  </>
                ) : (
                  <>
                    <Plus size={19} />
                    Save & Activate Goal
                  </>
                )}
              </button>
            </form>
          </section>
        )}

        {/* Loading */}
        {loading ? (
          <div className="goals-loading">
            <LoaderCircle className="spinning-icon" size={30} />
            <p>Loading your goals...</p>
          </div>
        ) : goals.length === 0 ? (
          /* Empty State */
          <section className="goals-empty-state">
            <div className="empty-target-icon">
              <Target size={36} />
            </div>

            <h2>No goals created yet</h2>

            <p>
              Your next achievement starts with one clear goal.
              Create your first goal and break it into milestones.
            </p>

            <button
              type="button"
              className="empty-create-button"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Create Your First Goal
            </button>
          </section>
        ) : (
          /* Goal Cards */
          <section className="goals-list">
            <div className="goals-list-heading">
              <div>
                <span className="goals-eyebrow">YOUR JOURNEY</span>
                <h2>Your Goals</h2>
              </div>

              <span className="goal-count">
                {goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}
              </span>
            </div>

            {goals.map((goal) => {
              const milestones = goal.milestones || [];

              const completedCount = milestones.filter(
                (milestone) => milestone.completed
              ).length;

              const totalCount = milestones.length;

              const progressPercent = totalCount > 0
                ? Math.round((completedCount / totalCount) * 100)
                : 0;

              const isGoalComplete =
                totalCount > 0 && completedCount === totalCount;

              return (
                <article className="goal-card" key={goal._id}>
                  <div className="goal-card-top">
                    <div className="goal-card-main">
                      <span className="goal-category">
                        {goal.category}
                      </span>

                      <h3>{goal.title}</h3>

                      {goal.description && (
                        <p className="goal-description">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    <div className="goal-card-actions">
                      <button
                        type="button"
                        className="icon-button edit-goal-button"
                        onClick={() => openEditModal(goal)}
                        disabled={!!deletingGoalId}
                        title="Edit Goal"
                        aria-label="Edit goal"
                      >
                        <Edit3 size={17} />
                      </button>

                      <button
                        type="button"
                        className="icon-button delete-goal-button"
                        onClick={() => handleDeleteGoal(goal._id)}
                        disabled={!!deletingGoalId}
                        title="Delete Goal"
                        aria-label="Delete goal"
                      >
                        {deletingGoalId === goal._id ? (
                          <LoaderCircle className="spinning-icon" size={17} />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="goal-date">
                    <Calendar size={15} />
                    <span>Target: {formatDate(goal.targetDate)}</span>
                  </div>

                  {/* Progress */}
                  <div className="goal-progress-section">
                    <div className="goal-progress-heading">
                      <div>
                        <strong>Progress</strong>
                        <span>
                          {completedCount} of {totalCount} milestones completed
                        </span>
                      </div>

                      <strong className="progress-percentage">
                        {progressPercent}%
                      </strong>
                    </div>

                    <div
                      className="goal-progress-track"
                      role="progressbar"
                      aria-valuenow={progressPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${goal.title} progress`}
                    >
                      <div
                        className="goal-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {isGoalComplete && (
                      <div className="goal-completed-label">
                        <CheckCircle2 size={15} />
                        All milestones completed!
                      </div>
                    )}
                  </div>

                  {/* Milestones */}
                  {milestones.length > 0 ? (
                    <div className="milestones-section">
                      <div className="milestones-heading">
                        <h4>Milestones</h4>
                        <span>{completedCount}/{totalCount}</span>
                      </div>

                      <div className="milestones-list">
                        {milestones.map((milestone, index) => {
                          const actionKey = `${goal._id}-${index}`;

                          const isSavingMilestone =
                            updatingMilestone === actionKey;

                          return (
                            <button
                              type="button"
                              key={`${goal._id}-${index}`}
                              className={`milestone-item ${
                                milestone.completed ? 'completed' : ''
                              }`}
                              onClick={() =>
                                toggleMilestone(goal._id, index)
                              }
                              disabled={updatingMilestone !== null}
                            >
                              <span className="milestone-check">
                                {isSavingMilestone ? (
                                  <LoaderCircle
                                    className="spinning-icon"
                                    size={17}
                                  />
                                ) : milestone.completed ? (
                                  <CheckCircle2 size={19} />
                                ) : (
                                  <span className="milestone-empty-circle" />
                                )}
                              </span>

                              <span className="milestone-title">
                                {milestone.title}
                              </span>

                              <span className="milestone-status">
                                {isSavingMilestone
                                  ? 'Saving...'
                                  : milestone.completed
                                    ? 'Completed'
                                    : 'Mark complete'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="no-milestones">
                      <Flag size={17} />
                      <span>No milestones added to this goal yet.</span>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

        {/* Edit Modal */}
        {editingGoal && (
          <div
            className="goal-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeEditModal();
            }}
          >
            <section
              className="goal-edit-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="editGoalHeading"
            >
              <div className="goal-modal-header">
                <div>
                  <span className="goals-eyebrow">MAKE AN UPDATE</span>
                  <h2 id="editGoalHeading">Edit Goal</h2>
                  <p>Adjust your goal and its milestones.</p>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  aria-label="Close edit modal"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateGoal}>
                <div className="goal-form-group">
                  <label htmlFor="editGoalTitle">Goal Title</label>
                  <input
                    id="editGoalTitle"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    maxLength={120}
                    required
                    disabled={isUpdating}
                  />
                </div>

                <div className="goal-form-group">
                  <label htmlFor="editGoalDescription">Description</label>
                  <textarea
                    id="editGoalDescription"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    disabled={isUpdating}
                  />
                </div>

                <div className="goal-form-grid">
                  <div className="goal-form-group">
                    <label htmlFor="editGoalCategory">Category</label>
                    <select
                      id="editGoalCategory"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      disabled={isUpdating}
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="goal-form-group">
                    <label htmlFor="editGoalDate">Target Date</label>
                    <input
                      id="editGoalDate"
                      type="date"
                      value={editTargetDate}
                      min={new Date().toLocaleDateString('en-CA')}
                      onChange={(e) => setEditTargetDate(e.target.value)}
                      required
                      disabled={isUpdating}
                    />
                  </div>
                </div>

                <div className="goal-form-group">
                  <label htmlFor="editGoalMilestones">
                    Milestones
                  </label>

                  <textarea
                    id="editGoalMilestones"
                    value={editMilestonesText}
                    onChange={(e) => setEditMilestonesText(e.target.value)}
                    rows={5}
                    placeholder="Enter one milestone per line"
                    disabled={isUpdating}
                  />

                  <span className="goal-field-hint">
                    Existing completion states are preserved when milestone
                    titles remain unchanged.
                  </span>
                </div>

                <div className="goal-modal-actions">
                  <button
                    type="button"
                    className="goal-cancel-button"
                    onClick={closeEditModal}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="goal-submit-button"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <LoaderCircle className="spinning-icon" size={18} />
                        Updating Goal...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

      </div>
    </main>
  );
}
