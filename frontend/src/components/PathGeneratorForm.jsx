import { useState } from 'react';

const INTEREST_OPTIONS = [
  'Python', 'Artificial Intelligence', 'Machine Learning',
  'Data Analytics', 'Web Development', 'Data Science',
];

const SKILL_LEVELS = [
  { id: 'Beginner', label: 'Beginner', desc: 'No prior experience or basic familiarity' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Comfortable with basics, built small projects' },
  { id: 'Advanced', label: 'Advanced', desc: 'Industry-ready or looking for specialization' },
];

const CAREER_GOAL_OPTIONS = [
  'Software Developer', 'Data Analyst', 'Data Scientist',
  'AI/ML Engineer', 'Full Stack Developer', 'Other',
];

const DAILY_TIME_OPTIONS = ['30 minutes', '1 hour', '2 hours', '3+ hours'];
const DURATION_OPTIONS = ['2 weeks', '1 month', '3 months', '6 months'];

export default function PathGeneratorForm({ onSuccess, onLoadSample }) {
  const [formData, setFormData] = useState({
    name: '', learningInterest: '', skillLevel: '',
    careerGoal: '', dailyTime: '', duration: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSkillSelect = (levelId) => {
    setFormData((prev) => ({ ...prev, skillLevel: levelId }));
    if (errors.skillLevel) setErrors((prev) => ({ ...prev, skillLevel: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.learningInterest) e.learningInterest = 'Please select a learning interest.';
    if (!formData.skillLevel) e.skillLevel = 'Please select your current skill level.';
    if (!formData.careerGoal) e.careerGoal = 'Please select your career goal.';
    if (!formData.dailyTime) e.dailyTime = 'Please select your available daily time.';
    if (!formData.duration) e.duration = 'Please select your learning duration.';
    return e;
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
        headers: { 'Content-Type': 'application/json' },
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
        if (typeof errorData.detail === 'string') message = errorData.detail;
        else if (Array.isArray(errorData.detail)) {
          message = errorData.detail
            .map((item) => {
              const field = item.loc ? item.loc[item.loc.length - 1] : 'field';
              return `${field}: ${item.msg}`;
            }).join('; ');
        }
        setApiError(`Request Error: ${message}`);
        return;
      }
      const data = await response.json();
      if (data && data.roadmap) {
        onSuccess(data.roadmap);
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

  return (
    <div className="form-page-wrap">
      {/* Loading overlay */}
      {isLoading && (
        <div className="form-loading-overlay">
          <div className="form-loading-card">
            <div className="form-spinner" />
            <div className="form-loading-title">Generating Your Learning Path</div>
            <p className="form-loading-sub">Analyzing your profile and building a personalized roadmap…</p>
          </div>
        </div>
      )}

      <div className="form-intro">
        <h2 className="form-intro-title">Create Your Learning Path</h2>
        <p className="form-intro-sub">
          Tell us about yourself and we'll generate a personalized roadmap tailored to your goals.
        </p>
      </div>

      {apiError && (
        <div className="form-api-error">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      <form id="learning-path-form" className="pgf-form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="pgf-field">
          <label className="pgf-label">Your Name <span className="pgf-optional">(Optional)</span></label>
          <input
            type="text"
            name="name"
            className="pgf-input"
            placeholder="e.g. Vignesh"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Interest */}
        <div className="pgf-field">
          <label className="pgf-label">Learning Interest <span className="pgf-required">*</span></label>
          <select
            name="learningInterest"
            className={`pgf-select${errors.learningInterest ? ' error' : ''}`}
            value={formData.learningInterest}
            onChange={handleChange}
          >
            <option value="">Select a subject area…</option>
            {INTEREST_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.learningInterest && <span className="pgf-error-msg">{errors.learningInterest}</span>}
        </div>

        {/* Skill Level */}
        <div className="pgf-field">
          <label className="pgf-label">Current Skill Level <span className="pgf-required">*</span></label>
          <div className="pgf-skill-grid">
            {SKILL_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                className={`pgf-skill-card${formData.skillLevel === lvl.id ? ' selected' : ''}`}
                onClick={() => handleSkillSelect(lvl.id)}
              >
                <div className="pgf-skill-label">{lvl.label}</div>
                <div className="pgf-skill-desc">{lvl.desc}</div>
              </button>
            ))}
          </div>
          {errors.skillLevel && <span className="pgf-error-msg">{errors.skillLevel}</span>}
        </div>

        {/* Career Goal */}
        <div className="pgf-field">
          <label className="pgf-label">Career Goal <span className="pgf-required">*</span></label>
          <select
            name="careerGoal"
            className={`pgf-select${errors.careerGoal ? ' error' : ''}`}
            value={formData.careerGoal}
            onChange={handleChange}
          >
            <option value="">Select your target role…</option>
            {CAREER_GOAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.careerGoal && <span className="pgf-error-msg">{errors.careerGoal}</span>}
        </div>

        {/* Daily Time */}
        <div className="pgf-field">
          <label className="pgf-label">Daily Study Time <span className="pgf-required">*</span></label>
          <div className="pgf-pill-row">
            {DAILY_TIME_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pgf-pill${formData.dailyTime === opt ? ' selected' : ''}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, dailyTime: opt }));
                  if (errors.dailyTime) setErrors((prev) => ({ ...prev, dailyTime: '' }));
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {errors.dailyTime && <span className="pgf-error-msg">{errors.dailyTime}</span>}
        </div>

        {/* Duration */}
        <div className="pgf-field">
          <label className="pgf-label">Learning Duration <span className="pgf-required">*</span></label>
          <div className="pgf-pill-row">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pgf-pill${formData.duration === opt ? ' selected' : ''}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, duration: opt }));
                  if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {errors.duration && <span className="pgf-error-msg">{errors.duration}</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button type="submit" id="generate-path-btn" className="pgf-submit" style={{ flex: '1 1 200px' }} disabled={isLoading}>
            {isLoading ? 'Generating…' : '✨ Generate My Learning Path'}
          </button>
          {onLoadSample && (
            <button
              type="button"
              className="pgf-submit"
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', flex: '0 0 auto', padding: '0.75rem 1.25rem' }}
              onClick={onLoadSample}
            >
              ⚡ Try Demo Path
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
