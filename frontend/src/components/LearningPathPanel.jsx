import { useState, useEffect } from 'react';
import NotesModal from './NotesModal';

// ── Icons ────────────────────────────────────────────────────────────────────
const IconNotes = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconWatch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8"/>
  </svg>
);

const IconProject = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);

const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// ── Checkbox ─────────────────────────────────────────────────────────────────
function TopicCheckbox({ isDone, isCurrentWeek, onClick, label }) {
  return (
    <button
      type="button"
      className={`topic-cb${isDone ? ' done' : isCurrentWeek ? ' current' : ''}`}
      onClick={onClick}
      aria-pressed={isDone}
      aria-label={isDone ? `Unmark "${label}" as complete` : `Mark "${label}" as complete`}
    >
      {isDone && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2 6 5 9 10 3"/>
        </svg>
      )}
      {!isDone && isCurrentWeek && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#4361ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2 6 5 9 10 3"/>
        </svg>
      )}
    </button>
  );
}

// ── Estimate duration per topic ───────────────────────────────────────────────
function topicDuration(topic) {
  const t = topic.toLowerCase();
  if (t.includes('introduction') || t.includes('basics') || t.includes('overview')) return '30 min';
  if (t.includes('project') || t.includes('build') || t.includes('deploy')) return '1.5 hr';
  if (t.includes('advanced') || t.includes('algorithm') || t.includes('architecture')) return '1.5 hr';
  return '1 hr';
}

// ── Resource type → color/label ───────────────────────────────────────────────
function resourceTypeMeta(type) {
  const t = (type || '').toLowerCase();
  if (t === 'documentation') return { cls: 'type-doc', label: 'Docs', icon: '📄' };
  if (t === 'video' || t === 'course') return { cls: 'type-video', label: 'Video', icon: '🎥' };
  if (t === 'practice' || t === 'exercise') return { cls: 'type-practice', label: 'Practice', icon: '⚡' };
  return { cls: 'type-tutorial', label: 'Tutorial', icon: '📘' };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LearningPathPanel({
  roadmap,
  completedItems,
  toggleItem,
  handleResetProgress,
  activeWeek,
  setActiveWeek,
}) {
  const [expandedResources, setExpandedResources] = useState(false);
  const [activeNotesTopic, setActiveNotesTopic] = useState(null);

  // Derive a key for roadmap notes
  const roadmapId = roadmap
    ? ((roadmap.interest || 'path') + '_' + (roadmap.skill_level || 'all')).replace(/\s+/g, '_').toLowerCase()
    : 'default';
  const notesStorageKey = `learnova_notes_${roadmapId}`;

  // Store notes per topicKey in React state
  const [topicNotes, setTopicNotes] = useState(() => {
    try {
      const raw = localStorage.getItem(notesStorageKey);
      if (raw) return JSON.parse(raw);
      const globalRaw = localStorage.getItem('learnova_topic_notes');
      return globalRaw ? JSON.parse(globalRaw) : {};
    } catch {
      return {};
    }
  });

  const handleOpenNotes = (weekNum, topicIdx, topicTitle) => {
    const topicKey = `w${weekNum}_t${topicIdx}`;
    try {
      const raw = localStorage.getItem(notesStorageKey) || localStorage.getItem('learnova_topic_notes');
      if (raw) {
        setTopicNotes(JSON.parse(raw));
      }
    } catch {
      /* ignore */
    }
    setActiveNotesTopic({
      weekNumber: weekNum,
      topicIndex: topicIdx,
      topicKey,
      topicTitle,
    });
  };

  const handleCloseNotes = () => {
    setActiveNotesTopic(null);
  };

  const handleSaveNote = (text) => {
    if (!activeNotesTopic) return;
    const { topicKey, topicTitle } = activeNotesTopic;
    setTopicNotes((prev) => {
      const updated = { ...prev, [topicKey]: text, [topicTitle]: text };
      try {
        localStorage.setItem(notesStorageKey, JSON.stringify(updated));
        localStorage.setItem('learnova_topic_notes', JSON.stringify(updated));
        localStorage.setItem(`learnova_note_${topicKey}`, text);
      } catch (err) {
        console.error('Error saving note:', err);
      }
      return updated;
    });
  };

  const getActiveNote = () => {
    if (!activeNotesTopic) return '';
    const { topicKey, topicTitle } = activeNotesTopic;
    if (topicNotes[topicKey] !== undefined) return topicNotes[topicKey];
    if (topicNotes[topicTitle] !== undefined) return topicNotes[topicTitle];
    try {
      const single = localStorage.getItem(`learnova_note_${topicKey}`);
      if (single !== null) return single;
    } catch {
      /* ignore */
    }
    return '';
  };

  const weeks = roadmap?.weekly_plan || [];
  const currentWeekData = weeks.find((w) => w.week_number === activeWeek) || weeks[0];

  if (!currentWeekData) return null;

  // How many topics completed in this week?
  const weekTopicsTotal = currentWeekData.topics.length;
  const weekTopicsDone = currentWeekData.topics.filter((_, idx) =>
    completedItems.has(`w${activeWeek}_t${idx}`)
  ).length;

  // Completed count across all items for the reset button
  const hasProgress = completedItems.size > 0;

  return (
    <div className="lp-panel">
      {/* Header */}
      <div className="lp-header">
        <div className="lp-header-left">
          <IconBook />
          <h3 className="lp-title">Your Learning Path</h3>
        </div>
        <div className="lp-header-right">
          {hasProgress && (
            <button className="lp-reset-btn" onClick={handleResetProgress} title="Clear all progress">
              ↺ Reset Progress
            </button>
          )}
          <select
            className="lp-week-select"
            value={activeWeek}
            onChange={(e) => setActiveWeek(Number(e.target.value))}
          >
            {weeks.map((w) => (
              <option key={w.week_number} value={w.week_number}>
                Week {w.week_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lp-body">
        {/* Left: week list */}
        <div className="lp-week-list">
          {weeks.map((w) => (
            <button
              key={w.week_number}
              className={`lp-week-btn${activeWeek === w.week_number ? ' active' : ''}`}
              onClick={() => setActiveWeek(w.week_number)}
            >
              <div className="lp-week-btn-title">Week {w.week_number}</div>
              <div className="lp-week-btn-sub">{w.focus}</div>
            </button>
          ))}
        </div>

        {/* Right: topic detail */}
        <div className="lp-detail">
          {/* Detail header */}
          <div className="lp-detail-header">
            <div>
              <h4 className="lp-detail-title">Week {activeWeek}: {currentWeekData.focus}</h4>
              <p className="lp-detail-sub">
                {roadmap?.summary
                  ? roadmap.summary
                  : `Build a strong foundation for your ${roadmap?.interest || 'learning'} journey.`}
              </p>
            </div>
            <div className="lp-topics-done-badge">
              {weekTopicsDone} of {weekTopicsTotal} topics completed
            </div>
          </div>

          {/* Topic rows */}
          <div className="lp-topics-list">
            {currentWeekData.topics.map((topic, idx) => {
              const topicKey = `w${activeWeek}_t${idx}`;
              const isDone = completedItems.has(topicKey);
              const ref = currentWeekData.topic_references && currentWeekData.topic_references[idx];
              const isProject = topic.toLowerCase().includes('project') || topic.toLowerCase().includes('build');
              const dur = topicDuration(topic);

              return (
                <div key={idx} className={`lp-topic-row${isDone ? ' done' : ''}`}>
                  {/* Checkbox */}
                  <TopicCheckbox
                    isDone={isDone}
                    isCurrentWeek={!isDone}
                    onClick={() => toggleItem(topicKey)}
                    label={topic}
                  />

                  {/* Title + desc */}
                  <div className="lp-topic-info">
                    <div className={`lp-topic-title${isDone ? ' struck' : ''}`}>{topic}</div>
                    <div className="lp-topic-desc">
                      {ref?.title
                        ? ref.title
                        : `Learn the core concepts of ${topic.toLowerCase()}.`}
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="lp-topic-duration">{dur}</span>

                  {/* Action buttons */}
                  <div className="lp-topic-actions">
                    <button
                      type="button"
                      className="lp-action-btn lp-action-btn--outline"
                      title="Notes"
                      onClick={() => handleOpenNotes(activeWeek, idx, topic)}
                      id={`btn-notes-w${activeWeek}-t${idx}`}
                    >
                      <IconNotes /> Notes
                    </button>
                    {isProject ? (
                      <button className="lp-action-btn lp-action-btn--outline" title="Project">
                        <IconProject /> Project
                      </button>
                    ) : null}
                    {ref?.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lp-action-btn lp-action-btn--primary"
                        title="Open resource"
                      >
                        <IconWatch /> Watch
                      </a>
                    ) : (
                      <button className="lp-action-btn lp-action-btn--primary" title="Watch">
                        <IconWatch /> Watch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practice Activities */}
          {currentWeekData.practice_activities && currentWeekData.practice_activities.length > 0 && (
            <div className="lp-activities-section">
              <div className="lp-activities-title">🛠️ Practice Activities</div>
              <div className="lp-activities-list">
                {currentWeekData.practice_activities.map((act, idx) => {
                  const actKey = `w${activeWeek}_a${idx}`;
                  const isDone = completedItems.has(actKey);
                  return (
                    <div key={idx} className={`lp-activity-row${isDone ? ' done' : ''}`}>
                      <button
                        type="button"
                        className={`activity-cb${isDone ? ' done' : ''}`}
                        onClick={() => toggleItem(actKey)}
                        aria-pressed={isDone}
                      >
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2 6 5 9 10 3"/>
                          </svg>
                        )}
                      </button>
                      <span className={`lp-activity-text${isDone ? ' struck' : ''}`}>{act}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Study Materials collapsible */}
          {currentWeekData.resources && currentWeekData.resources.length > 0 && (
            <div className="lp-resources-section">
              <button
                className="lp-resources-toggle"
                onClick={() => setExpandedResources((v) => !v)}
              >
                <div className="lp-resources-toggle-left">
                  <div className="lp-resources-toggle-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="lp-resources-toggle-title">Study Materials &amp; Reference Links</div>
                    <div className="lp-resources-toggle-sub">
                      Access curated resources to learn this week's topics.
                    </div>
                  </div>
                </div>
                <span className="lp-resources-toggle-cta">
                  {expandedResources ? 'Hide Resources ↑' : 'View Resources →'}
                </span>
              </button>

              {expandedResources && (
                <div className="lp-resources-grid">
                  {currentWeekData.resources.map((res, rIdx) => {
                    const meta = resourceTypeMeta(res.type);
                    return (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lp-resource-card"
                      >
                        <div className="lp-resource-card-top">
                          <span className={`lp-resource-type-badge ${meta.cls}`}>
                            {meta.icon} {meta.label}
                          </span>
                          {res.estimated_time && (
                            <span className="lp-resource-duration">⏱ {res.estimated_time}</span>
                          )}
                        </div>
                        <div className="lp-resource-title">{res.title} <span className="lp-external-icon">↗</span></div>
                        <div className="lp-resource-desc">{res.description}</div>
                        <div className="lp-resource-footer">
                          <span className="lp-resource-provider">🏢 {res.provider || 'Official Guide'}</span>
                          <span className="lp-resource-cta">Open Resource →</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={Boolean(activeNotesTopic)}
        onClose={handleCloseNotes}
        topicTitle={activeNotesTopic?.topicTitle || ''}
        weekNumber={activeNotesTopic?.weekNumber || activeWeek}
        initialNote={getActiveNote()}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
}
