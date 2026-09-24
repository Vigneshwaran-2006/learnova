import { useState, useEffect } from 'react';

const SETTINGS_KEY = 'learnova_settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch { /* quota */ }
}

const defaultSettings = {
  darkMode:              false,
  compactView:           false,
  showMotivationalCards: true,
  autoSaveProgress:      true,
  weeklyDigest:          true,
  taskReminders:         false,
  achievementAlerts:     true,
  progressReminders:     false,
};

export default function SettingsPage({ settings: externalSettings, onUpdateSettings, onResetAllData }) {
  // Use external settings if provided, otherwise load from localStorage
  const [settings, setSettings] = useState(() => externalSettings || loadSettings() || defaultSettings);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Propagate changes upward to App
  useEffect(() => {
    saveSettings(settings);
    if (onUpdateSettings) onUpdateSettings(settings);
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const handleResetProgress = () => {
    if (!resetConfirm) { setResetConfirm(true); return; }
    setResetConfirm(false);
    showToast('Progress reset successfully.');
  };

  const handleClearData = () => {
    if (!clearConfirm) { setClearConfirm(true); return; }
    if (onResetAllData) onResetAllData();
    setClearConfirm(false);
    showToast('All local data has been cleared.');
  };

  /* ── Reusable building blocks ── */
  const Toggle = ({ id, checked, onChange, label, description }) => (
    <div className="stg-toggle-row">
      <div className="stg-toggle-text">
        <div className="stg-toggle-label">{label}</div>
        {description && <div className="stg-toggle-desc">{description}</div>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        className={`stg-toggle-switch${checked ? ' on' : ''}`}
        onClick={onChange}
        aria-label={label}
      >
        <span className="stg-toggle-thumb" />
      </button>
    </div>
  );

  const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="stg-section-header">
      <div className="stg-section-icon">{icon}</div>
      <div>
        <h2 className="stg-section-title">{title}</h2>
        {subtitle && <p className="stg-section-sub">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="settings-page">

      <div className="stg-page-header">
        <h1 className="stg-page-title">Settings</h1>
        <p className="stg-page-sub">Manage your preferences and account data</p>
      </div>

      {/* ── Toast ─────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="stg-toast">
          <span>✅</span> {toastMsg}
        </div>
      )}

      {/* ── Appearance ──────────────────────────────────────────── */}
      <div className="stg-card">
        <SectionHeader
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
          title="Appearance"
          subtitle="Customize how the app looks"
        />
        <div className="stg-divider" />
        <div className="stg-toggles-stack">
          <Toggle
            id="toggle-dark-mode"
            label="Dark Mode"
            description="Switch to a darker color scheme"
            checked={settings.darkMode}
            onChange={() => toggle('darkMode')}
          />
          <Toggle
            id="toggle-compact"
            label="Compact Density"
            description="Reduce spacing for a denser layout"
            checked={settings.compactView}
            onChange={() => toggle('compactView')}
          />
          <Toggle
            id="toggle-motivation"
            label="Motivational Cards"
            description="Show encouraging quotes and tips in the sidebar"
            checked={settings.showMotivationalCards}
            onChange={() => toggle('showMotivationalCards')}
          />
        </div>
      </div>

      {/* ── Learning Preferences ────────────────────────────────── */}
      <div className="stg-card">
        <SectionHeader
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
          title="Learning Preferences"
          subtitle="Control your study experience"
        />
        <div className="stg-divider" />
        <div className="stg-toggles-stack">
          <Toggle
            id="toggle-autosave"
            label="Auto-Save Progress"
            description="Automatically save task completions as you learn"
            checked={settings.autoSaveProgress}
            onChange={() => toggle('autoSaveProgress')}
          />
          <Toggle
            id="toggle-reminders"
            label="Task Reminders"
            description="Remind you to complete daily tasks"
            checked={settings.taskReminders}
            onChange={() => toggle('taskReminders')}
          />
        </div>
      </div>

      {/* ── Notifications ───────────────────────────────────────── */}
      <div className="stg-card">
        <SectionHeader
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
          title="Notifications"
          subtitle="Choose which updates to receive"
        />
        <div className="stg-divider" />
        <div className="stg-toggles-stack">
          <Toggle
            id="toggle-weekly"
            label="Weekly Digest"
            description="Get a summary of your weekly progress"
            checked={settings.weeklyDigest}
            onChange={() => toggle('weeklyDigest')}
          />
          <Toggle
            id="toggle-achievements"
            label="Achievement Alerts"
            description="Notify when you unlock a milestone"
            checked={settings.achievementAlerts}
            onChange={() => toggle('achievementAlerts')}
          />
          <Toggle
            id="toggle-progress-reminders"
            label="Progress Reminders"
            description="Remind you to check your progress weekly"
            checked={settings.progressReminders}
            onChange={() => toggle('progressReminders')}
          />
        </div>
      </div>

      {/* ── Data & Storage ──────────────────────────────────────── */}
      <div className="stg-card stg-card-danger">
        <SectionHeader
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>}
          title="Data & Storage"
          subtitle="Manage your locally stored data"
        />

        <div className="stg-divider" />

        <div className="stg-data-info">
          <div className="stg-data-info-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="stg-data-info-text">
            All data is stored locally in your browser. No data is uploaded to any server.
            Clearing data will remove your roadmap, progress, and profile information.
          </p>
        </div>

        <div className="stg-danger-actions">
          {/* Reset Progress */}
          <div className="stg-danger-row">
            <div className="stg-danger-text">
              <div className="stg-danger-label">Reset Progress</div>
              <div className="stg-danger-desc">Clear all task completions while keeping your roadmap and profile</div>
            </div>
            <div className="stg-danger-btn-wrap">
              {resetConfirm ? (
                <div className="stg-confirm-row">
                  <span className="stg-confirm-msg">Are you sure?</span>
                  <button className="stg-btn-confirm-yes" onClick={handleResetProgress}>Yes, Reset</button>
                  <button className="stg-btn-confirm-no" onClick={() => setResetConfirm(false)}>Cancel</button>
                </div>
              ) : (
                <button className="stg-btn-warning" id="btn-reset-progress" onClick={handleResetProgress}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.82"/>
                  </svg>
                  Reset Progress
                </button>
              )}
            </div>
          </div>

          {/* Clear All Data */}
          <div className="stg-danger-row">
            <div className="stg-danger-text">
              <div className="stg-danger-label stg-label-red">Clear All Data</div>
              <div className="stg-danger-desc">Permanently delete all stored data including roadmap, profile, and progress</div>
            </div>
            <div className="stg-danger-btn-wrap">
              {clearConfirm ? (
                <div className="stg-confirm-row">
                  <span className="stg-confirm-msg">This cannot be undone.</span>
                  <button className="stg-btn-confirm-yes stg-btn-red" onClick={handleClearData}>Yes, Clear All</button>
                  <button className="stg-btn-confirm-no" onClick={() => setClearConfirm(false)}>Cancel</button>
                </div>
              ) : (
                <button className="stg-btn-danger" id="btn-clear-data" onClick={handleClearData}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                  Clear All Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
