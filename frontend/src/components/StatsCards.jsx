const STATS = [
  {
    key: 'totalTopics',
    label: 'Total Topics',
    color: 'blue',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    key: 'completed',
    label: 'Completed',
    color: 'green',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    color: 'orange',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    key: 'remaining',
    label: 'Remaining',
    color: 'amber',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14"/><path d="M5 2h14"/>
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/>
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
      </svg>
    ),
  },
];

export default function StatsCards({ stats }) {
  const values = {
    totalTopics: stats?.totalTopics ?? 0,
    completed: stats?.completed ?? 0,
    inProgress: stats?.inProgress ?? 0,
    remaining: stats?.remaining ?? 0,
  };

  return (
    <div className="stats-row">
      {STATS.map((s) => (
        <div key={s.key} className={`stat-card stat-card--${s.color}`}>
          <div className={`stat-icon-wrap stat-icon-wrap--${s.color}`}>
            {s.icon}
          </div>
          <div className="stat-info">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{values[s.key]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
