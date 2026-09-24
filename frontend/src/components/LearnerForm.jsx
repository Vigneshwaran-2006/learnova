import { useState, useEffect } from 'react';

const INTEREST_OPTIONS = [
  'Python',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Analytics',
  'Web Development',
  'Data Science',
];

const SKILL_LEVELS = [
  { id: 'Beginner', label: 'Beginner', desc: 'No prior experience or basic familiarity' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Comfortable with basics, built small projects' },
  { id: 'Advanced', label: 'Advanced', desc: 'Industry-ready or looking for specialization' },
];

const CAREER_GOAL_OPTIONS = [
  'Software Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Full Stack Developer',
  'Other',
];

const DAILY_TIME_OPTIONS = [
  '30 minutes',
  '1 hour',
  '2 hours',
  '3+ hours',
];

const DURATION_OPTIONS = [
  '2 weeks',
  '1 month',
  '3 months',
  '6 months',
];

// ── Phase 6: LocalStorage progress helpers ──────────────────────────────────
const getRoadmapId = (rm) =>
  `${rm.interest}_${rm.skill_level}_${rm.duration}`.replace(/\s+/g, '_').toLowerCase();

const loadProgress = (id) => {
  try {
    const raw = localStorage.getItem(`learnova_progress_${id}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveProgress = (id, itemSet) => {
  try {
    localStorage.setItem(`learnova_progress_${id}`, JSON.stringify([...itemSet]));
  } catch { /* storage quota exceeded — fail silently */ }
};

export default function LearnerForm() {
  const [formData, setFormData] = useState({
    name: '',
    learningInterest: '',
    skillLevel: '',
    careerGoal: '',
    dailyTime: '',
    duration: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  // Phase 6: set of completed item keys, e.g. "w1_t0", "w2_a1"
  const [completedItems, setCompletedItems] = useState(new Set());

  // Load saved progress whenever a roadmap appears; clear when dismissed
  useEffect(() => {
    if (generatedRoadmap) {
      setCompletedItems(loadProgress(getRoadmapId(generatedRoadmap)));
    } else {
      setCompletedItems(new Set());
    }
  }, [generatedRoadmap]);

  const toggleItem = (key) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (generatedRoadmap) saveProgress(getRoadmapId(generatedRoadmap), next);
      return next;
    });
  };

  const handleResetProgress = () => {
    if (generatedRoadmap) {
      localStorage.removeItem(`learnova_progress_${getRoadmapId(generatedRoadmap)}`);
    }
    setCompletedItems(new Set());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillSelect = (levelId) => {
    setFormData((prev) => ({ ...prev, skillLevel: levelId }));
    if (errors.skillLevel) {
      setErrors((prev) => ({ ...prev, skillLevel: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.learningInterest) {
      newErrors.learningInterest = 'Please select a learning interest.';
    }
    if (!formData.skillLevel) {
      newErrors.skillLevel = 'Please select your current skill level.';
    }
    if (!formData.careerGoal) {
      newErrors.careerGoal = 'Please select your career goal.';
    }
    if (!formData.dailyTime) {
      newErrors.dailyTime = 'Please select your available daily time.';
    }
    if (!formData.duration) {
      newErrors.duration = 'Please select your intended learning duration.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiError('Please fill in all required fields before generating your path.');
      return;
    }

    setErrors({});
    setApiError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name ? formData.name.trim() : null,
          interest: formData.learningInterest,
          learning_interest: formData.learningInterest,
          skill_level: formData.skillLevel,
          career_goal: formData.careerGoal,
          daily_time: formData.dailyTime,
          duration: formData.duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let message = `Server returned status ${response.status}`;
        if (typeof errorData.detail === 'string') {
          message = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          message = errorData.detail
            .map((item) => {
              const field = item.loc ? item.loc[item.loc.length - 1] : 'field';
              return `${field}: ${item.msg}`;
            })
            .join('; ');
        }
        setApiError(`Request Error: ${message}`);
        return;
      }

      const data = await response.json();
      if (data && data.roadmap) {
        setGeneratedRoadmap(data.roadmap);
      } else {
        setApiError('Invalid roadmap format received from backend server.');
      }
    } catch (err) {
      setApiError(
        err.message && !err.message.includes('fetch')
          ? err.message
          : 'Backend connection failed. Please ensure the Learnova FastAPI server is running at http://127.0.0.1:8000.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setGeneratedRoadmap(null);
    setApiError('');
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      learningInterest: '',
      skillLevel: '',
      careerGoal: '',
      dailyTime: '',
      duration: '',
    });
    setErrors({});
    setGeneratedRoadmap(null);
    setApiError('');
  };

  return (
    <section id="learning-path-form" className="form-section">
      <div className="form-card">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Generating your personalized learning path...</h3>
            <p className="loading-subtitle">
              Analyzing curriculum topics, pacing your schedule, and aligning career milestones...
            </p>
          </div>
        )}

        {/* Global API or Validation Alert */}
        {apiError && !isLoading && (
          <div className="form-alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        {generatedRoadmap ? (
          /* ================================================================
             Phase 3: Generated Personalized Learning Path View
             ================================================================ */
          <div className="roadmap-container">
            {/* Roadmap Header */}
            <div className="roadmap-header">
              <div className="roadmap-badge-row">
                <span className="roadmap-meta-badge">
                  <span className="meta-interest">{generatedRoadmap.interest}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-skill">{generatedRoadmap.skill_level}</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-target">Target: {generatedRoadmap.career_goal}</span>
                </span>
              </div>

              <h2 className="roadmap-main-title">{generatedRoadmap.title}</h2>
              <p className="roadmap-learner-salute">
                Curated for <strong>{generatedRoadmap.learner_name}</strong> •{' '}
                {generatedRoadmap.duration} Commitment
              </p>

              {/* Metrics Ribbon */}
              <div className="metrics-ribbon">
                <div className="metric-chip">
                  <span className="metric-icon">⏱️</span>
                  <div>
                    <div className="metric-val">{generatedRoadmap.metrics.total_estimated_hours} Hours</div>
                    <div className="metric-desc">Total Study Time</div>
                  </div>
                </div>
                <div className="metric-chip">
                  <span className="metric-icon">📅</span>
                  <div>
                    <div className="metric-val">{generatedRoadmap.daily_time} / day</div>
                    <div className="metric-desc">~{generatedRoadmap.metrics.weekly_commitment_hours} hrs/week</div>
                  </div>
                </div>
                <div className="metric-chip">
                  <span className="metric-icon">🎯</span>
                  <div>
                    <div className="metric-val">{generatedRoadmap.metrics.total_milestones} Modules</div>
                    <div className="metric-desc">Sequential Sprints</div>
                  </div>
                </div>
              </div>

              <div className="pacing-advice-box">
                <span className="pacing-icon">💡</span>
                <span>{generatedRoadmap.metrics.pacing_advice}</span>
              </div>
            </div>

            {/* Section 1: Weekly Learning Plan */}
            <div className="roadmap-section">
              <div className="section-title-wrap">
                <h3 className="section-heading">📅 Weekly Learning Plan</h3>
                <span className="section-subtext">
                  Step-by-step curriculum with practical exercises
                </span>
              </div>

              {/* ── Phase 6: Progress Dashboard ─────────────────────────────── */}
              {(() => {
                const allTopics = generatedRoadmap.weekly_plan.reduce(
                  (s, w) => s + w.topics.length, 0
                );
                const allActivities = generatedRoadmap.weekly_plan.reduce(
                  (s, w) => s + w.practice_activities.length, 0
                );
                const totalItems = allTopics + allActivities;
                const completedCount = completedItems.size;
                const pct = totalItems > 0
                  ? Math.round((completedCount / totalItems) * 100)
                  : 0;
                const RADIUS = 36;
                const CIRC = parseFloat((2 * Math.PI * RADIUS).toFixed(2));
                const dashOffset = parseFloat((CIRC * (1 - pct / 100)).toFixed(2));
                return (
                  <div className="progress-dashboard">
                    <div className="progress-dashboard-inner">

                      {/* Circular progress ring */}
                      <div className="progress-ring-wrap">
                        <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
                          <circle
                            className="progress-ring-track"
                            cx="44" cy="44" r={RADIUS}
                            fill="none" strokeWidth="7"
                          />
                          <circle
                            className="progress-ring-fill"
                            cx="44" cy="44" r={RADIUS}
                            fill="none" strokeWidth="7"
                            strokeDasharray={CIRC}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            transform="rotate(-90 44 44)"
                          />
                        </svg>
                        <div className="progress-ring-label">
                          <span className="progress-pct-num">{pct}</span>
                          <span className="progress-pct-sign">%</span>
                        </div>
                      </div>

                      {/* Stats + linear bar */}
                      <div className="progress-info-col">
                        <div className="progress-headline">
                          {pct === 100
                            ? '🎉 Roadmap Complete!'
                            : pct > 0
                            ? '📈 In Progress'
                            : '🎯 Ready to Learn'}
                        </div>
                        <div className="progress-stats-row">
                          <div className="progress-stat-pill total">
                            <span className="stat-icon">📋</span>
                            <div>
                              <div className="stat-num">{totalItems}</div>
                              <div className="stat-label">Total</div>
                            </div>
                          </div>
                          <div className="progress-stat-pill done">
                            <span className="stat-icon">✅</span>
                            <div>
                              <div className="stat-num">{completedCount}</div>
                              <div className="stat-label">Done</div>
                            </div>
                          </div>
                          <div className="progress-stat-pill remaining">
                            <span className="stat-icon">⏳</span>
                            <div>
                              <div className="stat-num">{totalItems - completedCount}</div>
                              <div className="stat-label">Left</div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="progress-bar-wrap"
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${pct}% of roadmap completed`}
                        >
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Reset — only rendered when progress > 0 */}
                      {completedCount > 0 && (
                        <button
                          type="button"
                          id="reset-progress-btn"
                          className="progress-reset-btn"
                          onClick={handleResetProgress}
                          title="Clear all progress for this roadmap"
                        >
                          ↺ Reset
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="weekly-timeline">
                {generatedRoadmap.weekly_plan.map((week) => (
                  <div key={week.week_number} className="timeline-week-card">
                    <div className="week-card-header">
                      <div className="week-number-badge">
                        Week {week.week_number}
                      </div>
                      <h4 className="week-focus-title">{week.focus}</h4>
                    </div>

                    <div className="week-content-grid">
                      {/* Topics with completion toggles */}
                      <div className="week-block">
                        <div className="block-label">
                          <span>📚</span> Core Topics &amp; Reference Links
                        </div>
                        <ul className="topics-list">
                          {week.topics.map((topic, idx) => {
                            const ref = week.topic_references && week.topic_references[idx];
                            const topicKey = `w${week.week_number}_t${idx}`;
                            const isDone = completedItems.has(topicKey);
                            return (
                              <li key={idx} className={`topic-item${isDone ? ' completed' : ''}`}>
                                <div className="topic-text-wrap">
                                  <button
                                    type="button"
                                    id={`topic-toggle-w${week.week_number}-t${idx}`}
                                    className={`topic-toggle-btn${isDone ? ' done' : ''}`}
                                    onClick={() => toggleItem(topicKey)}
                                    aria-pressed={isDone}
                                    aria-label={
                                      isDone
                                        ? `Unmark "${topic}" as complete`
                                        : `Mark "${topic}" as complete`
                                    }
                                  >
                                    {isDone ? '✓' : ''}
                                  </button>
                                  <span className="topic-name">{topic}</span>
                                </div>
                                {ref && ref.url && (
                                  <a
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="topic-ref-link"
                                    title={`Verified ${ref.type || 'reference'} from ${ref.provider || 'official docs'}: ${ref.title}`}
                                  >
                                    <span className="ref-type-tag">{ref.type || 'Docs'}</span>
                                    <span className="ref-provider-tag">{ref.provider || 'Reference'}</span>
                                    <span className="ref-arrow-icon">↗</span>
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Practice Activities with completion toggles */}
                      <div className="week-block">
                        <div className="block-label">
                          <span>🛠️</span> Suggested Practice Activities
                        </div>
                        <ul className="activities-list">
                          {week.practice_activities.map((activity, idx) => {
                            const actKey = `w${week.week_number}_a${idx}`;
                            const isDone = completedItems.has(actKey);
                            return (
                              <li key={idx} className={`activity-item${isDone ? ' completed' : ''}`}>
                                <button
                                  type="button"
                                  id={`activity-toggle-w${week.week_number}-a${idx}`}
                                  className={`activity-toggle-btn${isDone ? ' done' : ''}`}
                                  onClick={() => toggleItem(actKey)}
                                  aria-pressed={isDone}
                                  aria-label={
                                    isDone
                                      ? 'Mark activity as incomplete'
                                      : 'Mark activity as complete'
                                  }
                                >
                                  {isDone ? '✓' : '▸'}
                                </button>
                                <span className={`activity-text${isDone ? ' completed' : ''}`}>
                                  {activity}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    {/* Phase 5: Curated Study Materials & Valid Reference Links */}
                    {week.resources && week.resources.length > 0 && (
                      <div className="week-resources-block">
                        <div className="resources-header">
                          <div className="resources-title-group">
                            <span className="resources-header-icon">📖</span>
                            <span className="resources-header-title">Study Materials &amp; Verified References</span>
                          </div>
                          <span className="resources-count-badge">
                            {week.resources.length} Verified Educational Sources
                          </span>
                        </div>

                        <div className="resources-grid">
                          {week.resources.map((res, rIdx) => {
                            const resourceType = (res.type || 'Tutorial').toLowerCase();
                            const typeIcon =
                              resourceType === 'documentation'
                                ? '📄'
                                : resourceType === 'video'
                                ? '🎥'
                                : resourceType === 'practice'
                                ? '⚡'
                                : '📘';

                            return (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resource-card"
                                title={`Open ${res.title} in new tab`}
                              >
                                <div className="resource-card-meta">
                                  <span className={`resource-type-pill type-${resourceType}`}>
                                    <span className="type-pill-icon">{typeIcon}</span>
                                    <span>{res.type || 'Tutorial'}</span>
                                  </span>
                                  {res.estimated_time && (
                                    <span className="resource-duration-pill">
                                      ⏱️ {res.estimated_time}
                                    </span>
                                  )}
                                </div>

                                <h5 className="resource-card-title">
                                  <span>{res.title}</span>
                                  <span className="resource-external-indicator">↗</span>
                                </h5>

                                <p className="resource-card-description">
                                  {res.description}
                                </p>

                                <div className="resource-card-footer">
                                  <span className="resource-provider-tag">
                                    🏢 {res.provider || 'Official Guide'}
                                  </span>
                                  <span className="resource-action-link">
                                    Study Material &rarr;
                                  </span>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>


            {/* Section 2: Mini-Project Spotlight */}
            <div className="roadmap-section">
              <div className="section-title-wrap">
                <h3 className="section-heading">🚀 Capstone Mini-Project</h3>
                <span className="section-subtext">
                  Hands-on portfolio piece designed for {generatedRoadmap.career_goal} roles
                </span>
              </div>

              <div className="mini-project-card">
                <div className="project-header">
                  <div className="project-badge">Featured Portfolio Project</div>
                  <h4 className="project-title">{generatedRoadmap.mini_project.title}</h4>
                  <p className="project-description">
                    {generatedRoadmap.mini_project.description}
                  </p>
                </div>

                <div className="project-deliverables">
                  <div className="deliverables-heading">Key Project Deliverables:</div>
                  <div className="deliverables-grid">
                    {generatedRoadmap.mini_project.deliverables.map((item, idx) => (
                      <div key={idx} className="deliverable-item">
                        <span className="deliverable-check">★</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="career-relevance-box">
                  <strong>Career Relevance: </strong>
                  {generatedRoadmap.mini_project.career_relevance}
                </div>
              </div>
            </div>

            {/* Section 3: Career Milestone */}
            <div className="roadmap-section">
              <div className="section-title-wrap">
                <h3 className="section-heading">🏆 Career Milestone</h3>
                <span className="section-subtext">
                  Actionable checkpoints to bridge your learning into hiring readiness
                </span>
              </div>

              <div className="career-milestone-card">
                <div className="milestone-header">
                  <div className="milestone-icon">🏅</div>
                  <div>
                    <h4 className="milestone-title">
                      {generatedRoadmap.career_milestone.title}
                    </h4>
                    <p className="milestone-description">
                      {generatedRoadmap.career_milestone.description}
                    </p>
                  </div>
                </div>

                <div className="milestone-checklist">
                  <div className="checklist-heading">Action Items for this Milestone:</div>
                  <div className="checklist-items">
                    {generatedRoadmap.career_milestone.action_items.map((item, idx) => (
                      <div key={idx} className="checklist-item">
                        <span className="checklist-bullet">✔</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap Actions */}
            <div className="roadmap-action-bar">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleEditProfile}
              >
                ← Adjust Inputs & Regenerate
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={handleResetForm}
              >
                Create New Profile
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => window.print()}
              >
                🖨️ Print / Save Roadmap
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
             Learner Input Form
             ================================================================ */
          <>
            <div className="form-header">
              <div className="form-badge">Personalized Path Builder</div>
              <h2 className="form-title">Tell Us About Your Learning Goals</h2>
              <p className="form-subtitle">
                Provide your preferences and schedule so Learnova can tailor your personalized roadmap.
              </p>
            </div>

            <form className="learner-form" onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                {/* Field 1: Name (Optional) */}
                <div className="form-group full-width">
                  <label htmlFor="name-input" className="form-label">
                    Your Name <span className="label-optional">(Optional)</span>
                  </label>
                  <input
                    id="name-input"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Field 2: Learning Interest (Required) */}
                <div className="form-group">
                  <label htmlFor="interest-select" className="form-label">
                    Learning Interest <span className="label-required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="interest-select"
                      name="learningInterest"
                      className={`form-select ${errors.learningInterest ? 'input-error' : ''}`}
                      value={formData.learningInterest}
                      onChange={handleChange}
                    >
                      <option value="">Select a topic...</option>
                      {INTEREST_OPTIONS.map((interest) => (
                        <option key={interest} value={interest}>
                          {interest}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.learningInterest && (
                    <span className="field-error-text">{errors.learningInterest}</span>
                  )}
                </div>

                {/* Field 4: Career Goal (Required) */}
                <div className="form-group">
                  <label htmlFor="career-goal-select" className="form-label">
                    Target Career Goal <span className="label-required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="career-goal-select"
                      name="careerGoal"
                      className={`form-select ${errors.careerGoal ? 'input-error' : ''}`}
                      value={formData.careerGoal}
                      onChange={handleChange}
                    >
                      <option value="">Select your goal...</option>
                      {CAREER_GOAL_OPTIONS.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.careerGoal && (
                    <span className="field-error-text">{errors.careerGoal}</span>
                  )}
                </div>

                {/* Field 3: Current Skill Level (Required) */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Current Skill Level <span className="label-required">*</span>
                  </label>
                  <div className="skill-level-cards">
                    {SKILL_LEVELS.map((level) => {
                      const isSelected = formData.skillLevel === level.id;
                      return (
                        <div
                          key={level.id}
                          className={`skill-card ${isSelected ? 'selected' : ''} ${
                            errors.skillLevel ? 'skill-card-error' : ''
                          }`}
                          onClick={() => handleSkillSelect(level.id)}
                        >
                          <div className="skill-card-header">
                            <input
                              type="radio"
                              id={`skill-${level.id}`}
                              name="skillLevel"
                              value={level.id}
                              checked={isSelected}
                              onChange={() => handleSkillSelect(level.id)}
                              className="skill-radio"
                            />
                            <label htmlFor={`skill-${level.id}`} className="skill-title">
                              {level.label}
                            </label>
                          </div>
                          <p className="skill-desc">{level.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                  {errors.skillLevel && (
                    <span className="field-error-text">{errors.skillLevel}</span>
                  )}
                </div>

                {/* Field 5: Daily Learning Time (Required) */}
                <div className="form-group">
                  <label htmlFor="daily-time-select" className="form-label">
                    Daily Learning Time <span className="label-required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="daily-time-select"
                      name="dailyTime"
                      className={`form-select ${errors.dailyTime ? 'input-error' : ''}`}
                      value={formData.dailyTime}
                      onChange={handleChange}
                    >
                      <option value="">Select daily commitment...</option>
                      {DAILY_TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.dailyTime && (
                    <span className="field-error-text">{errors.dailyTime}</span>
                  )}
                </div>

                {/* Field 6: Learning Duration (Required) */}
                <div className="form-group">
                  <label htmlFor="duration-select" className="form-label">
                    Learning Duration <span className="label-required">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="duration-select"
                      name="duration"
                      className={`form-select ${errors.duration ? 'input-error' : ''}`}
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      <option value="">Select target timeline...</option>
                      {DURATION_OPTIONS.map((dur) => (
                        <option key={dur} value={dur}>
                          {dur}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.duration && (
                    <span className="field-error-text">{errors.duration}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-submit-container">
                <button
                  type="submit"
                  id="generate-path-btn"
                  className="cta-button submit-button"
                  disabled={isLoading}
                >
                  <span>Generate My Learning Path</span>
                  <span className="button-arrow">⚡</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
