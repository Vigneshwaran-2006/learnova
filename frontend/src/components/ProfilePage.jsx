import { useState, useEffect } from 'react';

const LOAD_KEY = 'learnova_profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(LOAD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProfileData(profile) {
  try {
    localStorage.setItem(LOAD_KEY, JSON.stringify(profile));
  } catch { /* quota */ }
}

function getCompletionPct(profile) {
  const keys = ['name', 'interest', 'skillLevel', 'careerGoal', 'dailyTime', 'duration'];
  const filled = keys.filter((k) => profile[k] && String(profile[k]).trim() !== '');
  return Math.round((filled.length / keys.length) * 100);
}

const SKILL_COLORS = {
  Beginner:     { bg: '#dbeafe', color: '#1d4ed8' },
  Intermediate: { bg: '#fef9c3', color: '#b45309' },
  Advanced:     { bg: '#dcfce7', color: '#166534' },
};

export default function ProfilePage({ roadmap, onProfileUpdate }) {
  const defaultProfile = {
    name:       roadmap?.learner_name || '',
    interest:   roadmap?.interest    || '',
    skillLevel: roadmap?.skill_level || '',
    careerGoal: roadmap?.career_goal || '',
    dailyTime:  roadmap?.daily_time  || '',
    duration:   roadmap?.duration    || '',
  };

  const [profile,  setProfile]  = useState(() => loadProfile() || defaultProfile);
  const [editing,  setEditing]  = useState(false);
  const [editData, setEditData] = useState(profile);
  const [saved,    setSaved]    = useState(false);

  // Sync when a new roadmap is generated
  useEffect(() => {
    if (roadmap) {
      const existing = loadProfile();
      const merged = {
        name:       existing?.name       || roadmap.learner_name || profile.name       || '',
        interest:   roadmap.interest     || profile.interest     || '',
        skillLevel: roadmap.skill_level  || profile.skillLevel   || '',
        careerGoal: roadmap.career_goal  || profile.careerGoal   || '',
        dailyTime:  roadmap.daily_time   || profile.dailyTime    || '',
        duration:   roadmap.duration     || profile.duration     || '',
      };
      setProfile(merged);
      saveProfileData(merged);
    }
  }, [roadmap]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit   = () => { setEditData({ ...profile }); setEditing(true); setSaved(false); };
  const handleCancel = () => setEditing(false);
  const handleSave   = () => {
    setProfile(editData);
    saveProfileData(editData);
    if (onProfileUpdate) onProfileUpdate(editData);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const handleChange = (key, value) => setEditData((prev) => ({ ...prev, [key]: value }));

  const fields = [
    { key: 'name',       label: 'Full Name',         icon: '👤', type: 'text',   placeholder: 'Your full name' },
    { key: 'interest',   label: 'Learning Interest',  icon: '📚', type: 'text',   placeholder: 'e.g. Python, AI, Web Dev' },
    { key: 'skillLevel', label: 'Skill Level',        icon: '📊', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
    { key: 'careerGoal', label: 'Career Goal',        icon: '🎯', type: 'text',   placeholder: 'e.g. Software Developer' },
    { key: 'dailyTime',  label: 'Daily Study Time',   icon: '⏱️',  type: 'select', options: ['30 minutes', '1 hour', '2 hours', '3+ hours'] },
    { key: 'duration',   label: 'Learning Duration',  icon: '📅', type: 'select', options: ['2 weeks', '1 month', '3 months', '6 months'] },
  ];

  const completionPct  = getCompletionPct(profile);
  const skillStyle     = SKILL_COLORS[profile.skillLevel] || { bg: '#f1f5f9', color: '#475569' };
  const avatarInitial  = (profile.name || profile.interest || 'L')[0].toUpperCase();

  const summaryCards = [
    { icon: '🎓', label: 'Field of Study', value: profile.interest   || '—' },
    { icon: '📊', label: 'Skill Level',    value: profile.skillLevel || '—' },
    { icon: '⏱️',  label: 'Daily Study',   value: profile.dailyTime  || '—' },
    { icon: '📅', label: 'Duration',       value: profile.duration   || '—' },
  ];

  return (
    <div className="profile-page">

      {/* ── Hero Card ────────────────────────────────────────── */}
      <div className="prf-hero-card">
        <div className="prf-hero-bg" />

        <div className="prf-hero-content">
          {/* Avatar */}
          <div className="prf-avatar-wrap">
            <div className="prf-avatar">{avatarInitial}</div>
            {!editing && (
              <button className="prf-avatar-edit-btn" onClick={handleEdit} title="Edit profile">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )}
          </div>

          {/* Name + role */}
          <div className="prf-hero-info">
            <h1 className="prf-hero-name">{profile.name || 'Your Name'}</h1>
            <p className="prf-hero-role">{profile.careerGoal || 'Learning Enthusiast'}</p>
            <div className="prf-hero-badges">
              {profile.skillLevel && (
                <span className="prf-skill-badge" style={{ background: skillStyle.bg, color: skillStyle.color }}>
                  {profile.skillLevel}
                </span>
              )}
              {profile.interest && (
                <span className="prf-interest-badge">{profile.interest}</span>
              )}
            </div>
          </div>

          {/* Edit button */}
          {!editing && (
            <button className="prf-edit-btn" onClick={handleEdit}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Completion bar */}
        <div className="prf-completion-bar-wrap">
          <div className="prf-completion-label">
            <span>Profile Completion</span>
            <span className="prf-completion-pct">{completionPct}%</span>
          </div>
          <div className="prf-completion-track">
            <div className="prf-completion-fill" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Save toast ──────────────────────────────────────── */}
      {saved && (
        <div className="prf-toast">
          <span>✅</span>
          Profile updated successfully!
        </div>
      )}

      {/* ── Info Fields Card ────────────────────────────────── */}
      <div className="prf-info-card">
        <div className="prf-card-header">
          <div className="prf-card-header-left">
            <div className="prf-section-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h2 className="prf-section-title">Profile Information</h2>
              <p className="prf-section-sub">Your personal learning details</p>
            </div>
          </div>
          {editing && <div className="prf-editing-pill">Editing</div>}
        </div>

        <div className="prf-fields-grid">
          {fields.map((f) => (
            <div key={f.key} className={`prf-field-card${editing ? ' editing' : ''}`}>
              <div className="prf-field-icon-wrap">
                <span className="prf-field-emoji">{f.icon}</span>
              </div>
              <div className="prf-field-body">
                <div className="prf-field-label">{f.label}</div>
                {editing ? (
                  f.type === 'select' ? (
                    <select
                      className="prf-field-select"
                      value={editData[f.key] || ''}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    >
                      <option value="">Select…</option>
                      {f.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="prf-field-input"
                      value={editData[f.key] || ''}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  )
                ) : (
                  <div className={`prf-field-value${!profile[f.key] ? ' empty' : ''}`}>
                    {profile[f.key] || 'Not set'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="prf-action-row">
            <button className="prf-cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="prf-save-btn" onClick={handleSave}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ── Learning Journey Summary ─────────────────────────── */}
      <div className="prf-summary-card">
        <div className="prf-card-header" style={{ marginBottom: '1.25rem' }}>
          <div className="prf-card-header-left">
            <div className="prf-section-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <h2 className="prf-section-title">Learning Journey Overview</h2>
              <p className="prf-section-sub">Your study goals at a glance</p>
            </div>
          </div>
        </div>

        <div className="prf-summary-grid">
          {summaryCards.map((s) => (
            <div key={s.label} className="prf-summary-mini">
              <span className="prf-summary-emoji">{s.icon}</span>
              <div className="prf-summary-text">
                <div className="prf-summary-lbl">{s.label}</div>
                <div className="prf-summary-val">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="prf-journey-row">
          <div className="prf-journey-item">
            <div className="prf-journey-dot green" />
            <span>Personalized roadmap generated</span>
          </div>
          <div className="prf-journey-item">
            <div className={`prf-journey-dot ${completionPct > 0 ? 'blue' : 'gray'}`} />
            <span>Progress tracking {completionPct > 0 ? 'active' : 'pending'}</span>
          </div>
          <div className="prf-journey-item">
            <div className={`prf-journey-dot ${completionPct === 100 ? 'green' : 'gray'}`} />
            <span>Goal completion — {completionPct === 100 ? '✓ achieved' : `${completionPct}% done`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
