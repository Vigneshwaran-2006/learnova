export default function ProgressSection({ stats, onViewDetails }) {
  const pct = stats?.pct ?? 0;
  const completed = stats?.completed ?? 0;
  const inProgress = stats?.inProgress ?? 0;
  const remaining = stats?.remaining ?? 0;

  // SVG ring
  const RADIUS = 70;
  const CIRC = parseFloat((2 * Math.PI * RADIUS).toFixed(2));
  const offset = parseFloat((CIRC * (1 - pct / 100)).toFixed(2));

  const motivational =
    pct === 100
      ? { emoji: '🏆', title: "Roadmap Complete!", msg: "You've mastered the entire learning path!" }
      : pct >= 66
      ? { emoji: '🚀', title: "Almost there!", msg: "Great momentum! Keep pushing forward." }
      : pct >= 33
      ? { emoji: '🚀', title: "You're doing great!", msg: "Keep going! Consistency leads to mastery." }
      : pct > 0
      ? { emoji: '✨', title: "Great start!", msg: "Every topic completed moves you forward." }
      : { emoji: '🎯', title: "Ready to learn!", msg: "Mark your first topic to begin tracking." };

  return (
    <div className="progress-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="section-card-title" style={{ margin: 0 }}>Overall Progress</h3>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Analytics &rarr;
          </button>
        )}
      </div>

      <div className="progress-card-body">
        {/* Ring */}
        <div className="progress-ring-container">
          <svg width="170" height="170" viewBox="0 0 170 170">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4361ee"/>
                <stop offset="100%" stopColor="#06b6d4"/>
              </linearGradient>
            </defs>
            <circle
              cx="85" cy="85" r={RADIUS}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            <circle
              cx="85" cy="85" r={RADIUS}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="12"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 85 85)"
              style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div className="progress-ring-center">
            <div className="progress-ring-pct">{pct}%</div>
            <div className="progress-ring-sub">Completed</div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="progress-motive-box">
          <div className="progress-motive-emoji">{motivational.emoji}</div>
          <div className="progress-motive-title">{motivational.title}</div>
          <p className="progress-motive-msg">{motivational.msg}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="progress-stat-row">
        <div className="progress-mini-stat blue">
          <span className="progress-mini-num">{completed}</span>
          <span className="progress-mini-label">Completed</span>
        </div>
        <div className="progress-mini-stat blue">
          <span className="progress-mini-num">{inProgress}</span>
          <span className="progress-mini-label">In Progress</span>
        </div>
        <div className="progress-mini-stat orange">
          <span className="progress-mini-num">{remaining}</span>
          <span className="progress-mini-label">Remaining</span>
        </div>
      </div>
    </div>
  );
}
