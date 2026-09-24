export default function GoalCard({ roadmap }) {
  const goal = roadmap?.career_goal || '—';
  const duration = roadmap?.duration || '—';
  const dailyTime = roadmap?.daily_time || '—';
  const interest = roadmap?.interest || '—';

  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <div className="goal-card-title-row">
          <span className="goal-icon">🎯</span>
          <h3 className="goal-card-title">Your Goal</h3>
        </div>
        <button className="goal-edit-btn">Edit</button>
      </div>

      <p className="goal-main-text">{goal}</p>
      <p className="goal-interest-text">{interest}</p>

      <div className="goal-meta-row">
        <div className="goal-meta-item">
          <span className="goal-meta-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <div>
            <div className="goal-meta-label">Target Period</div>
            <div className="goal-meta-value">{duration}</div>
          </div>
        </div>
        <div className="goal-meta-item">
          <span className="goal-meta-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </span>
          <div>
            <div className="goal-meta-label">Daily Study Goal</div>
            <div className="goal-meta-value">{dailyTime}</div>
          </div>
        </div>
      </div>

      <div className="goal-quote-box">
        <p className="goal-quote-text">
          "A little progress each day adds up to big results."
        </p>
      </div>
    </div>
  );
}
