import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HeroBanner from './components/HeroBanner';
import StatsCards from './components/StatsCards';
import ProgressSection from './components/ProgressSection';
import GoalCard from './components/GoalCard';
import LearningPathPanel from './components/LearningPathPanel';
import PathGeneratorForm from './components/PathGeneratorForm';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import ProgressPage from './components/ProgressPage';
import ResourcesPage from './components/ResourcesPage';
import AuthPage from './components/auth/AuthPage';
import { getSession, setSession, clearSession } from './auth/authUtils';
import { SAMPLE_ROADMAP } from './utils/sampleRoadmap';
import './App.css';

// ── Progress helpers ──────────────────────────────────────────────────────────
export const getRoadmapId = (rm) =>
  `${rm.interest || 'path'}_${rm.skill_level || 'all'}_${rm.duration || 'std'}`.replace(/\s+/g, '_').toLowerCase();

export const loadProgress = (id) => {
  try {
    const raw = localStorage.getItem(`learnova_progress_${id}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

export const saveProgress = (id, itemSet) => {
  try {
    localStorage.setItem(`learnova_progress_${id}`, JSON.stringify([...itemSet]));
  } catch {
    /* quota exceeded */
  }
};

const loadInitialRoadmap = () => {
  try {
    const raw = localStorage.getItem('learnova_active_roadmap');
    if (raw) return JSON.parse(raw);
  } catch {
    /* invalid JSON */
  }
  return SAMPLE_ROADMAP;
};

const loadInitialSettings = () => {
  const defaultSettings = {
    darkMode: false,
    notifications: true,
    autoSaveProgress: true,
    showMotivationalCards: true,
    compactView: false,
  };
  try {
    const raw = localStorage.getItem('learnova_settings');
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

// ── Enhanced Stats computation ────────────────────────────────────────────────
export function computeStats(roadmap, completedItems, activeWeek = 1) {
  if (!roadmap || !roadmap.weekly_plan) {
    return {
      totalTopics: 0,
      completed: 0,
      inProgress: 0,
      remaining: 0,
      totalActivities: 0,
      completedActivities: 0,
      totalTasks: 0,
      completedTasks: 0,
      pct: 0,
      topicPct: 0,
      estimatedHoursSpent: 0,
      estimatedHoursRemaining: 0,
    };
  }

  let totalTopics = 0;
  let completedTopics = 0;
  let inProgressTopics = 0;
  let remainingTopics = 0;
  let totalActivities = 0;
  let completedActivities = 0;

  roadmap.weekly_plan.forEach((week) => {
    (week.topics || []).forEach((_, idx) => {
      totalTopics++;
      const key = `w${week.week_number}_t${idx}`;
      if (completedItems.has(key)) {
        completedTopics++;
      } else if (week.week_number === activeWeek) {
        inProgressTopics++;
      } else {
        remainingTopics++;
      }
    });

    (week.practice_activities || []).forEach((_, idx) => {
      totalActivities++;
      const actKey = `w${week.week_number}_a${idx}`;
      if (completedItems.has(actKey)) completedActivities++;
    });
  });

  const totalTasks = totalTopics + totalActivities;
  const completedTasks = completedTopics + completedActivities;
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const topicPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const estimatedHoursSpent = Math.round(completedTasks * 1.2 * 10) / 10;
  const estimatedHoursRemaining = Math.max(0, Math.round((totalTasks - completedTasks) * 1.2 * 10) / 10);

  return {
    totalTopics,
    completed: completedTopics,
    inProgress: inProgressTopics,
    remaining: remainingTopics,
    totalActivities,
    completedActivities,
    totalTasks,
    completedTasks,
    pct,
    topicPct,
    estimatedHoursSpent,
    estimatedHoursRemaining,
  };
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  // ── Auth state ──────────────────────────────────────────
  const [session, setSessionState] = useState(() => getSession());

  const handleLogin = (user) => {
    setSession(user);
    setSessionState(user);
  };

  const handleLogout = () => {
    clearSession();
    setSessionState(null);
  };

  // ── Dashboard state ─────────────────────────────────────
  const [activeNav, setActiveNav] = useState('home');
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    online: false,
    message: 'Checking backend connection…',
  });

  const [generatedRoadmap, setGeneratedRoadmap] = useState(loadInitialRoadmap);
  const [completedItems, setCompletedItems] = useState(() => {
    const initial = loadInitialRoadmap();
    return initial ? loadProgress(getRoadmapId(initial)) : new Set();
  });
  const [activeWeek, setActiveWeek] = useState(1);
  const [settings, setSettings] = useState(loadInitialSettings);

  // Derive display name: session name > profile name > roadmap name > fallback
  const [profileName, setProfileName] = useState(() => {
    if (session?.name) return session.name;
    try {
      const p = localStorage.getItem('learnova_profile');
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed.name) return parsed.name;
      }
    } catch { /* ignore */ }
    return generatedRoadmap?.learner_name || 'Learner';
  });

  // Keep profileName in sync with session on login/logout
  useEffect(() => {
    if (session?.name) {
      setProfileName(session.name);
    }
  }, [session]);

  // Apply settings (dark mode, compact view)
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    if (settings.compactView) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  }, [settings.darkMode, settings.compactView]);

  // Backend health check
  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/health');
        if (!isMounted) return;
        if (res.ok) {
          const d = await res.json();
          setBackendStatus({ checked: true, online: true, message: d.message || 'Backend online' });
        } else {
          setBackendStatus({ checked: true, online: false, message: `Backend returned status ${res.status}` });
        }
      } catch {
        if (!isMounted) return;
        setBackendStatus({ checked: true, online: false, message: 'Backend not detected – run FastAPI server' });
      }
    };
    check();
    return () => { isMounted = false; };
  }, []);

  // Save active roadmap to localStorage
  useEffect(() => {
    if (generatedRoadmap) {
      try {
        localStorage.setItem('learnova_active_roadmap', JSON.stringify(generatedRoadmap));
      } catch { /* quota */ }
      setCompletedItems(loadProgress(getRoadmapId(generatedRoadmap)));
    } else {
      try {
        localStorage.removeItem('learnova_active_roadmap');
      } catch { /* quota */ }
      setCompletedItems(new Set());
    }
    setActiveWeek(1);
  }, [generatedRoadmap]);

  const toggleItem = (key) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (generatedRoadmap && settings.autoSaveProgress) {
        saveProgress(getRoadmapId(generatedRoadmap), next);
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    if (generatedRoadmap) {
      localStorage.removeItem(`learnova_progress_${getRoadmapId(generatedRoadmap)}`);
    }
    setCompletedItems(new Set());
  };

  const handleSettingsUpdate = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('learnova_settings', JSON.stringify(newSettings));
    } catch { /* quota */ }
  };

  const stats = computeStats(generatedRoadmap, completedItems, activeWeek);
  const userName = profileName || session?.name || generatedRoadmap?.learner_name || 'Learner';

  const scrollToForm = () => {
    setActiveNav('home');
    const el = document.getElementById('learning-path-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Auth gate ────────────────────────────────────────────
  if (!session) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className={`app-shell${settings.compactView ? ' compact-mode' : ''}`}>
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        progressPct={stats.pct}
        showMotivationalCards={settings.showMotivationalCards}
      />

      <div className="main-col">
        <TopNav
          backendStatus={backendStatus}
          userName={userName}
          onProfileClick={() => setActiveNav('profile')}
          onLogout={handleLogout}
        />

        <main className="page-content">
          {/* HOME VIEW */}
          {activeNav === 'home' && (
            <>
              <HeroBanner
                roadmap={generatedRoadmap}
                onContinue={() => {
                  setActiveNav('path');
                  const el = document.querySelector('.lp-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onGenerate={scrollToForm}
              />

              {generatedRoadmap ? (
                <>
                  <StatsCards stats={stats} />
                  <div className="progress-goal-row">
                    <ProgressSection
                      stats={stats}
                      onViewDetails={() => setActiveNav('progress')}
                    />
                    <GoalCard roadmap={generatedRoadmap} />
                  </div>
                  <LearningPathPanel
                    roadmap={generatedRoadmap}
                    completedItems={completedItems}
                    toggleItem={toggleItem}
                    handleResetProgress={handleResetProgress}
                    activeWeek={activeWeek}
                    setActiveWeek={setActiveWeek}
                  />
                  <div className="new-path-row">
                    <button
                      className="new-path-btn"
                      onClick={() => {
                        setGeneratedRoadmap(null);
                        setActiveNav('home');
                      }}
                    >
                      + Generate a New Learning Path
                    </button>
                  </div>
                </>
              ) : (
                <PathGeneratorForm
                  onSuccess={(roadmap) => {
                    setGeneratedRoadmap(roadmap);
                    setActiveNav('path');
                  }}
                  onLoadSample={() => {
                    setGeneratedRoadmap(SAMPLE_ROADMAP);
                    setActiveNav('path');
                  }}
                />
              )}
            </>
          )}

          {/* MY LEARNING PATH VIEW */}
          {activeNav === 'path' && (
            <>
              {generatedRoadmap ? (
                <>
                  <StatsCards stats={stats} />
                  <LearningPathPanel
                    roadmap={generatedRoadmap}
                    completedItems={completedItems}
                    toggleItem={toggleItem}
                    handleResetProgress={handleResetProgress}
                    activeWeek={activeWeek}
                    setActiveWeek={setActiveWeek}
                  />
                  <div className="new-path-row">
                    <button
                      className="new-path-btn"
                      onClick={() => {
                        setGeneratedRoadmap(null);
                        setActiveNav('home');
                      }}
                    >
                      + Generate a New Learning Path
                    </button>
                  </div>
                </>
              ) : (
                <PathGeneratorForm
                  onSuccess={(roadmap) => {
                    setGeneratedRoadmap(roadmap);
                    setActiveNav('path');
                  }}
                  onLoadSample={() => {
                    setGeneratedRoadmap(SAMPLE_ROADMAP);
                    setActiveNav('path');
                  }}
                />
              )}
            </>
          )}

          {/* PROGRESS VIEW */}
          {activeNav === 'progress' && (
            <ProgressPage
              stats={stats}
              roadmap={generatedRoadmap}
              completedItems={completedItems}
              toggleItem={toggleItem}
              handleResetProgress={handleResetProgress}
              onNavigatePath={() => setActiveNav('path')}
              onLoadSample={() => setGeneratedRoadmap(SAMPLE_ROADMAP)}
            />
          )}

          {/* RESOURCES VIEW */}
          {activeNav === 'resources' && (
            <ResourcesPage roadmap={generatedRoadmap} />
          )}

          {/* PROFILE VIEW */}
          {activeNav === 'profile' && (
            <ProfilePage
              roadmap={generatedRoadmap}
              onProfileUpdate={(updated) => {
                if (updated?.name) setProfileName(updated.name);
              }}
            />
          )}

          {/* SETTINGS VIEW */}
          {activeNav === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={handleSettingsUpdate}
              onResetAllData={() => {
                localStorage.clear();
                setGeneratedRoadmap(SAMPLE_ROADMAP);
                setCompletedItems(new Set());
                setProfileName(session?.name || 'Learner');
                setSettings(loadInitialSettings());
              }}
            />
          )}
        </main>

        <footer className="page-footer">
          <p>Learnova &copy; {new Date().getFullYear()} — Your Personalized Path to Success</p>
          <div className="footer-status">
            <span className={`status-dot ${backendStatus.online ? 'online' : 'offline'}`} />
            <span>{backendStatus.message}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
