// ============================================================
//  authUtils.js  –  Learnova PROTOTYPE Authentication Helpers
//
//  ⚠️  PROTOTYPE ONLY – passwords are base64-encoded (btoa),
//      NOT cryptographically hashed. Do NOT use in production.
//      A real system requires a secure backend with bcrypt/argon2,
//      JWT tokens, HTTPS, and proper session management.
// ============================================================

const USERS_KEY   = 'learnova_auth_users';
const SESSION_KEY = 'learnova_auth_session';

// ── Helpers ────────────────────────────────────────────────
/** Encode password (prototype only – NOT secure) */
const encodePassword = (pwd) => btoa(unescape(encodeURIComponent(pwd)));

/** Load stored users array */
const getUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Persist users array */
const setUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch { /* quota */ }
};

// ── Public API ─────────────────────────────────────────────

/**
 * Register a new user.
 * @returns {{ ok: true, user }} | {{ ok: false, error: string }}
 */
export function registerUser(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (users.find((u) => u.email === normalizedEmail)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    passwordEncoded: encodePassword(password),
    createdAt: new Date().toISOString(),
  };

  setUsers([...users, newUser]);
  return { ok: true, user: { name: newUser.name, email: newUser.email } };
}

/**
 * Validate credentials and return user data.
 * @returns {{ ok: true, user }} | {{ ok: false, error: string }}
 */
export function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const match = users.find((u) => u.email === normalizedEmail);

  if (!match) {
    return { ok: false, error: 'No account found with this email address.' };
  }

  if (match.passwordEncoded !== encodePassword(password)) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }

  return { ok: true, user: { name: match.name, email: match.email } };
}

/**
 * Persist the active session.
 * Only stores name + email — never the password.
 */
export function setSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  } catch { /* quota */ }
}

/**
 * Return the current session or null.
 * @returns {{ name: string, email: string } | null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear only the session.
 * Roadmap, progress, and profile data are deliberately preserved.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}
