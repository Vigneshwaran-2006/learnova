import { useState } from 'react';

export default function ProgressPage({
  stats,
  roadmap,
  completedItems,
  toggleItem,
  handleResetProgress,
  onNavigatePath,
  onLoadSample,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const pct = stats?.pct ?? 0;
  const completedTasks = stats?.completedTasks ?? stats?.completed ?? 0;
  const totalTasks = stats?.totalTasks ?? stats?.totalTopics ?? 0;
  const inProgress = stats?.inProgress ?? 0;
  const remaining = stats?.remaining ?? 0;
  const totalTopics = stats?.totalTopics ?? 0;
  const completedTopics = stats?.completed ?? 0;
  const hoursSpent = stats?.estimatedHoursSpent ?? Math.round(completedTasks * 1.2 * 10) / 10;
  const hoursRemaining = stats?.estimatedHoursRemaining ?? Math.max(0, Math.round((totalTasks - completedTasks) * 1.2 * 10) / 10);

  // SVG ring calculation
  const RADIUS = 80;
  const CIRC = parseFloat((2 * Math.PI * RADIUS).toFixed(2));
  const offset = parseFloat((CIRC * (1 - pct / 100)).toFixed(2));

  // Per-week breakdown
  const weeks = roadmap?.weekly_plan || [];
  const weekBreakdown = weeks.map((week) => {
    const topicList = week.topics || [];
    const actList = week.practice_activities || [];
    const totalItems = topicList.length + actList.length;

    const doneTopics = topicList.filter((_, idx) =>
      completedItems.has(`w${week.week_number}_t${idx}`)
    ).length;

    const doneActs = actList.filter((_, idx) =>
      completedItems.has(`w${week.week_number}_a${idx}`)
    ).length;

    const doneTotal = doneTopics + doneActs;
    const weekPct = totalItems > 0 ? Math.round((doneTotal / totalItems) * 100) : 0;

    return {
      week: week.week_number,
      focus: week.focus,
      totalTopics: topicList.length,
      doneTopics,
      totalActs: actList.length,
      doneActs,
      totalItems,
      doneTotal,
      weekPct,
      topics: topicList,
      activities: actList,
    };
  });

  const milestones = [
    { threshold: 1, emoji: '🌱', title: 'First Step', desc: 'Completed your very first learning item' },
    { threshold: Math.max(2, Math.ceil(totalTasks * 0.25)), emoji: '🔥', title: '25% Milestone', desc: 'One-quarter through your journey!' },
    { threshold: Math.max(3, Math.ceil(totalTasks * 0.5)), emoji: '⭐', title: 'Halfway Hero', desc: 'Solid consistency and halfway complete' },
    { threshold: Math.max(4, Math.ceil(totalTasks * 0.75)), emoji: '🚀', title: '75% Advanced', desc: 'Ready for complex capstone tasks' },
    { threshold: Math.max(1, totalTasks), emoji: '🏆', title: 'Roadmap Master', desc: 'Finished every single topic and activity!' },
  ];

  if (!roadmap) {
    return (
      <div className="progress-page">
        <div className="progress-page-empty">
          <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Learning Path Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            Generate a personalized roadmap to track your weekly progress, milestones, and completed study activities.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="primary-btn"
              onClick={onNavigatePath}
              style={{ padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: 600 }}
            >
              ✨ Generate Learning Path
            </button>
            {onLoadSample && (
              <button
                className="secondary-btn"
                onClick={onLoadSample}
                style={{ padding: '0.65rem 1.4rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border-medium)' }}
              >
                ⚡ Explore Demo Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      {/* Page Header with roadmap title & reset control */}
      <div className="pp-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            📊 Learning Progress &amp; Analytics
          </h1>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Path: <strong style={{ color: 'var(--primary)' }}>{roadmap.interest}</strong> ({roadmap.skill_level}) &bull; Goal: <strong>{roadmap.career_goal}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {showResetConfirm ? (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', background: '#fee2e2', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #fca5a5' }}>
              <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 600 }}>Reset all progress?</span>
              <button
                style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => {
                  handleResetProgress?.();
                  setShowResetConfirm(false);
                }}
              >
                Yes, Reset
              </button>
              <button
                style={{ background: 'transparent', color: '#475569', border: 'none', borderRadius: '4px', padding: '0.25rem 0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="lp-reset-btn"
              onClick={() => setShowResetConfirm(true)}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
              title="Reset all checkboxes"
            >
              ↺ Reset Progress
            </button>
          )}

          <button
            className="secondary-btn"
            onClick={onNavigatePath}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 600, borderRadius: '6px', border: '1px solid var(--border-medium)', cursor: 'pointer' }}
          >
            Go to Roadmap View &rarr;
          </button>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="pp-overall-card">
        <h2 className="pp-title">Overall Performance</h2>
        <div className="pp-ring-row">
          <div className="pp-ring-container">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="ppGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4361ee" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="14" />
              <circle
                cx="90" cy="90" r={RADIUS} fill="none"
                stroke="url(#ppGrad)" strokeWidth="14"
                strokeDasharray={CIRC} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 90 90)"
                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>
            <div className="pp-ring-center">
              <div className="pp-ring-pct">{pct}%</div>
              <div className="pp-ring-label">Completed</div>
            </div>
          </div>

          <div className="pp-stats-col">
            <div className="pp-stat stat-done">
              <div className="pp-stat-num">{completedTasks}</div>
              <div className="pp-stat-label">Tasks Completed ({completedTopics} topics)</div>
            </div>
            <div className="pp-stat stat-prog">
              <div className="pp-stat-num">{inProgress}</div>
              <div className="pp-stat-label">Active Week Items</div>
            </div>
            <div className="pp-stat stat-rem">
              <div className="pp-stat-num">{remaining}</div>
              <div className="pp-stat-label">Upcoming Topics</div>
            </div>
            <div className="pp-stat stat-total">
              <div className="pp-stat-num">{totalTasks}</div>
              <div className="pp-stat-label">Total Learning Items</div>
            </div>
          </div>
        </div>

        {/* Study Hours & Highlights Row */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-page)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1.5rem' }}>⏱️</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Hours Logged</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>~{hoursSpent} hrs</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-page)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1.5rem' }}>⌛</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Estimated Remaining</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>~{hoursRemaining} hrs</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-page)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Learning Momentum</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: pct > 50 ? '#10b981' : 'var(--primary)' }}>
                {pct === 100 ? 'Completed 🎉' : pct >= 50 ? 'Strong Progress 🚀' : 'On Track 🌱'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown Chart & Interactive Topic Checkers */}
      <div className="pp-weekly-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="pp-title" style={{ margin: 0 }}>📅 Weekly Syllabus &amp; Progress</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click any week to view and check off topics directly
            </p>
          </div>

          {/* Quick Filter */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-page)', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            {['all', 'completed', 'pending'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  textTransform: 'capitalize',
                  transition: 'background 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="pp-weekly-list">
          {weekBreakdown.map((w) => {
            const isExpanded = expandedWeek === w.week;
            return (
              <div
                key={w.week}
                className="pp-bar-row"
                style={{
                  background: 'var(--bg-page)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div className="pp-bar-header" style={{ cursor: 'pointer' }} onClick={() => setExpandedWeek(isExpanded ? null : w.week)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="pp-bar-week">Week {w.week}</span>
                    <span className="pp-bar-focus">{w.focus}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="pp-bar-counts" style={{ fontWeight: 700 }}>
                      {w.doneTotal}/{w.totalItems} done ({w.weekPct}%)
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                <div className="pp-bar-track" style={{ marginTop: '0.5rem', cursor: 'pointer' }} onClick={() => setExpandedWeek(isExpanded ? null : w.week)}>
                  <div className="pp-bar-fill" style={{ width: `${w.weekPct}%` }} />
                </div>

                {/* Collapsible topic checklist inside progress page */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Topics ({w.doneTopics}/{w.totalTopics}):
                    </div>
                    {w.topics
                      .map((topic, idx) => ({ topic, idx, key: `w${w.week}_t${idx}`, isDone: completedItems.has(`w${w.week}_t${idx}`) }))
                      .filter(({ isDone }) => filter === 'all' || (filter === 'completed' && isDone) || (filter === 'pending' && !isDone))
                      .map(({ topic, key, isDone }) => (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.4rem 0.6rem',
                            background: isDone ? '#f0fdf4' : 'var(--bg-card)',
                            borderRadius: '6px',
                            border: `1px solid ${isDone ? '#bbf7d0' : 'var(--border-light)'}`,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleItem?.(key)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                            id={key}
                          />
                          <label htmlFor={key} style={{ fontSize: '0.85rem', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none', cursor: 'pointer', flex: 1 }}>
                            {topic}
                          </label>
                        </div>
                      ))}

                    {w.activities.length > 0 && (
                      <>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                          Practice Activities ({w.doneActs}/{w.totalActs}):
                        </div>
                        {w.activities
                          .map((act, idx) => ({ act, idx, key: `w${w.week}_a${idx}`, isDone: completedItems.has(`w${w.week}_a${idx}`) }))
                          .filter(({ isDone }) => filter === 'all' || (filter === 'completed' && isDone) || (filter === 'pending' && !isDone))
                          .map(({ act, key, isDone }) => (
                            <div
                              key={key}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.4rem 0.6rem',
                                background: isDone ? '#f0fdf4' : 'var(--bg-card)',
                                borderRadius: '6px',
                                border: `1px solid ${isDone ? '#bbf7d0' : 'var(--border-light)'}`,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleItem?.(key)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                id={key}
                              />
                              <label htmlFor={key} style={{ fontSize: '0.85rem', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none', cursor: 'pointer', flex: 1 }}>
                                🛠️ {act}
                              </label>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones & Badges Card */}
      <div className="pp-milestones-card">
        <h3 className="pp-title" style={{ marginBottom: '1.25rem' }}>🏆 Milestones &amp; Achievements</h3>
        <div className="pp-milestones-grid">
          {milestones.map((m, i) => {
            const isUnlocked = completedTasks >= m.threshold;
            return (
              <div
                key={i}
                className={`pp-milestone ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <span className="pp-milestone-icon">{m.emoji}</span>
                <div className="pp-milestone-name">{m.title}</div>
                <div className="pp-milestone-desc">{m.desc}</div>
                <div className="pp-milestone-badge">
                  {isUnlocked ? '✓ Unlocked' : `${completedTasks}/${m.threshold} tasks`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
