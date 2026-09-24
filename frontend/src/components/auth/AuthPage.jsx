import { useState } from 'react';
import heroBanner from '../../assets/hero-banner.jpg';
import { registerUser, loginUser, setSession } from '../../auth/authUtils';

// ── Validation ───────────────────────────────────────────────
const isGmail = (email) => /^[^\s@]+@gmail\.com$/i.test(email.trim());
const isStrongEnough = (pwd) => pwd.length >= 6;

// ── Icons ────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const SignInTabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const SignUpTabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

// ── Reusable Field ───────────────────────────────────────────
function Field({ id, label, type = 'text', icon, placeholder, value, onChange, error, rightSlot, autoComplete }) {
  return (
    <div className={`ln-field${error ? ' has-error' : ''}`}>
      {label && <label htmlFor={id} className="ln-label">{label}</label>}
      <div className="ln-input-wrap">
        <span className="ln-input-icon">{icon}</span>
        <input
          id={id}
          type={type}
          className="ln-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        {rightSlot && <span className="ln-input-right">{rightSlot}</span>}
      </div>
      {error && <p className="ln-error">{error}</p>}
    </div>
  );
}

// ── Google G Logo ────────────────────────────────────────────
const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.3z"/>
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 43.1 14.8 48 24 48z"/>
    <path fill="#FBBC05" d="M10.8 28.8c-.5-1.5-.8-3-.8-4.8s.3-3.3.8-4.8V13H2.7C1 16.3 0 20 0 24s1 7.7 2.7 11l8.1-6.2z"/>
    <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.1 30.4 0 24 0 14.8 0 6.7 4.9 2.7 13l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
  </svg>
);

// ── Sign In Form ─────────────────────────────────────────────
function LoginForm({ onSuccess, onSwitchToSignUp }) {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [rememberMe, setRemember] = useState(false);
  const [showPwd, setShowPwd]     = useState(false);
  const [errors, setErrors]       = useState({});
  const [globalErr, setGlobalErr] = useState('');
  const [loading, setLoading]     = useState(false);

  const clear = (key) => { setErrors((p) => ({ ...p, [key]: '' })); setGlobalErr(''); };

  const validate = () => {
    const e = {};
    if (!email.trim())        e.email    = 'Gmail address is required.';
    else if (!isGmail(email)) e.email    = 'Please enter a valid @gmail.com address.';
    if (!password)            e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = loginUser(email, password);
    if (!result.ok) { setGlobalErr(result.error); setLoading(false); return; }
    setSession(result.user);
    onSuccess(result.user);
  };

  return (
    <form className="ln-form" onSubmit={handleSubmit} noValidate>
      <div className="ln-form-header">
        <h2 className="ln-form-title">Welcome Back!</h2>
        <p className="ln-form-sub">Continue your learning journey with Learnova</p>
      </div>

      {globalErr && (
        <div className="ln-alert-error" role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {globalErr}
        </div>
      )}

      <Field
        id="li-email" label="Gmail Address" type="email"
        icon={<MailIcon />} placeholder="Enter your Gmail address"
        value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }}
        error={errors.email} autoComplete="email"
      />

      <Field
        id="li-password" label="Password"
        type={showPwd ? 'text' : 'password'}
        icon={<LockIcon />} placeholder="Enter your password"
        value={password} onChange={(e) => { setPassword(e.target.value); clear('password'); }}
        error={errors.password} autoComplete="current-password"
        rightSlot={
          <button type="button" className="ln-eye-btn" onClick={() => setShowPwd((p) => !p)} aria-label="Toggle password">
            {showPwd ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      <div className="ln-row-between">
        <label className="ln-remember">
          <input type="checkbox" className="ln-checkbox" checked={rememberMe} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember me</span>
        </label>
        <button type="button" className="ln-forgot-link">Forgot password?</button>
      </div>

      <button type="submit" className="ln-btn-primary" disabled={loading} id="btn-sign-in">
        {loading ? 'Signing In…' : 'Sign In →'}
      </button>

      <div className="ln-or-divider"><span>OR</span></div>

      <button type="button" className="ln-btn-google" id="btn-google-ui">
        <GoogleG />
        Continue with Google
      </button>

      <p className="ln-switch-row">
        Don&apos;t have an account?{' '}
        <button type="button" className="ln-switch-link" onClick={onSwitchToSignUp} id="btn-go-signup">
          Sign Up
        </button>
      </p>
    </form>
  );
}

// ── Sign Up Form ─────────────────────────────────────────────
function SignUpForm({ onSuccess, onSwitchToLogin }) {
  const [fields, setFields]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]     = useState({});
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const set = (key, val) => { setFields((p) => ({ ...p, [key]: val })); setErrors((p) => ({ ...p, [key]: '' })); };

  const validate = () => {
    const e = {};
    if (!fields.name.trim())               e.name     = 'Full name is required.';
    if (!fields.email.trim())              e.email    = 'Gmail address is required.';
    else if (!isGmail(fields.email))       e.email    = 'Please enter a valid @gmail.com address.';
    if (!fields.password)                  e.password = 'Password is required.';
    else if (!isStrongEnough(fields.password)) e.password = 'Password must be at least 6 characters.';
    if (!fields.confirm)                   e.confirm  = 'Please confirm your password.';
    else if (fields.confirm !== fields.password) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = registerUser(fields.name, fields.email, fields.password);
    if (!result.ok) { setErrors({ email: result.error }); setLoading(false); return; }
    setSession(result.user);
    setSuccess(true);
    setTimeout(() => onSuccess(result.user), 1200);
  };

  if (success) {
    return (
      <div className="ln-success-box">
        <div className="ln-success-icon">✓</div>
        <h3>Account created!</h3>
        <p>Redirecting to your dashboard…</p>
      </div>
    );
  }

  return (
    <form className="ln-form" onSubmit={handleSubmit} noValidate>
      <div className="ln-form-header">
        <h2 className="ln-form-title">Create Account</h2>
        <p className="ln-form-sub">Start your personalized learning journey today</p>
      </div>

      <Field
        id="su-name" label="Full Name"
        icon={<UserIcon />} placeholder="Enter your full name"
        value={fields.name} onChange={(e) => set('name', e.target.value)}
        error={errors.name} autoComplete="name"
      />
      <Field
        id="su-email" label="Gmail Address" type="email"
        icon={<MailIcon />} placeholder="Enter your Gmail address"
        value={fields.email} onChange={(e) => set('email', e.target.value)}
        error={errors.email} autoComplete="email"
      />
      <Field
        id="su-password" label="Password"
        type={showPwd ? 'text' : 'password'}
        icon={<LockIcon />} placeholder="Min. 6 characters"
        value={fields.password} onChange={(e) => set('password', e.target.value)}
        error={errors.password} autoComplete="new-password"
        rightSlot={
          <button type="button" className="ln-eye-btn" onClick={() => setShowPwd((p) => !p)} aria-label="Toggle password">
            {showPwd ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />
      <Field
        id="su-confirm" label="Confirm Password"
        type={showPwd ? 'text' : 'password'}
        icon={<LockIcon />} placeholder="Re-enter your password"
        value={fields.confirm} onChange={(e) => set('confirm', e.target.value)}
        error={errors.confirm} autoComplete="new-password"
      />

      <button type="submit" className="ln-btn-primary" disabled={loading} id="btn-create-account">
        {loading ? 'Creating Account…' : 'Create Account →'}
      </button>

      <p className="ln-switch-row">
        Already have an account?{' '}
        <button type="button" className="ln-switch-link" onClick={onSwitchToLogin} id="btn-go-login">
          Sign In
        </button>
      </p>
    </form>
  );
}

// ── Auth Page ─────────────────────────────────────────────────
export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');

  return (
    <div className="ln-auth-page">

      {/* ════════ LEFT PANEL ════════ */}
      <div className="ln-left-panel">

        {/* Branding header */}
        <div className="ln-branding">
          <div className="ln-logo">
            {/* Learnova wordmark: "Learn" (navy) + O (teal circle) + "va" (teal) */}
            <span className="ln-logo-learn">Learn</span>
            <span className="ln-logo-nova">
              <span className="ln-logo-o" aria-hidden="true">
                <span className="ln-logo-o-inner" />
              </span>va
            </span>
          </div>
          <p className="ln-subtitle">AI Powered Personalised Learning Path Generator</p>
          <div className="ln-tagline">
            <span className="ln-tagline-line" />
            <span className="ln-tagline-text">LEARN &bull; GROW &bull; ACHIEVE</span>
            <span className="ln-tagline-line" />
          </div>
        </div>

        {/* Auth card */}
        <div className="ln-card">
          {/* Tabs */}
          <div className="ln-tabs">
            <button
              className={`ln-tab${tab === 'login' ? ' active' : ''}`}
              onClick={() => setTab('login')}
              id="tab-signin"
            >
              <SignInTabIcon /> Sign In
            </button>
            <button
              className={`ln-tab${tab === 'signup' ? ' active' : ''}`}
              onClick={() => setTab('signup')}
              id="tab-signup"
            >
              <SignUpTabIcon /> Sign Up
            </button>
          </div>

          {/* Form */}
          {tab === 'login' ? (
            <LoginForm
              onSuccess={onLogin}
              onSwitchToSignUp={() => setTab('signup')}
            />
          ) : (
            <SignUpForm
              onSuccess={onLogin}
              onSwitchToLogin={() => setTab('login')}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="ln-left-footer">
          <span>© {new Date().getFullYear()} <strong>Learnova</strong>. All rights reserved.</span>
          <span>Your Personalized Path to Success.</span>
        </footer>
      </div>

      {/* ════════ RIGHT PANEL – Mountain ════════ */}
      <div
        className="ln-right-panel"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* gradient overlay */}
        <div className="ln-right-overlay" />

        {/* Quote – top right */}
        <div className="ln-quote">
          <p>&ldquo;Discipline today creates success tomorrow.&rdquo;</p>
          <div className="ln-quote-line" />
        </div>

        {/* Bottom content */}
        <div className="ln-right-content">
          <h2 className="ln-right-title">Learn Without Limits</h2>
          <p className="ln-right-desc">
            Get a personalized learning path, curated resources<br />
            and track your progress — all in one place.
          </p>

          <div className="ln-features-row">
            <div className="ln-feature-item">
              <div className="ln-feature-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="ln-feature-label">Learn</div>
              <div className="ln-feature-desc">Access curated learning resources</div>
            </div>
            <div className="ln-feature-item">
              <div className="ln-feature-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div className="ln-feature-label">Grow</div>
              <div className="ln-feature-desc">Track your progress and build skills</div>
            </div>
            <div className="ln-feature-item">
              <div className="ln-feature-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                </svg>
              </div>
              <div className="ln-feature-label">Achieve</div>
              <div className="ln-feature-desc">Turn your goals into reality</div>
            </div>
          </div>
        </div>

        {/* Powered by Learnova */}
        <div className="ln-powered">
          <span className="ln-powered-line" />
          <span>Powered by Learnova</span>
        </div>
      </div>
    </div>
  );
}
