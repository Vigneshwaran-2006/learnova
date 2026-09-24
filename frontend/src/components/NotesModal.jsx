import { useState, useEffect, useRef } from 'react';

export default function NotesModal({
  isOpen,
  onClose,
  topicTitle,
  weekNumber,
  initialNote,
  onSaveNote,
}) {
  const [noteText, setNoteText] = useState(initialNote || '');
  const [savedStatus, setSavedStatus] = useState(false);
  const textareaRef = useRef(null);

  // Sync state when opening with fresh initial note or changing topic
  useEffect(() => {
    setNoteText(initialNote || '');
    setSavedStatus(false);
  }, [initialNote, topicTitle, isOpen]);

  // Handle ESC key and focus trapping / scrolling lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus textarea after render
    const timer = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onSaveNote(noteText);
    setSavedStatus(true);
  };

  const handleTextChange = (e) => {
    setNoteText(e.target.value);
    if (savedStatus) {
      setSavedStatus(false);
    }
  };

  return (
    <div
      className="ln-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ln-notes-topic-title"
    >
      <div
        className="ln-notes-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ln-notes-header">
          <div className="ln-notes-header-left">
            <div className="ln-notes-badge">
              <span className="ln-notes-badge-dot" />
              Week {weekNumber} • Study Notes
            </div>
            <h3 id="ln-notes-topic-title" className="ln-notes-title">
              {topicTitle}
            </h3>
          </div>
          <button
            type="button"
            className="ln-notes-close-icon-btn"
            onClick={onClose}
            aria-label="Close notes modal"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="ln-notes-body">
          <label htmlFor="topic-notes-textarea" className="ln-notes-label">
            Your Personal Study Notes
          </label>
          <textarea
            id="topic-notes-textarea"
            ref={textareaRef}
            className="ln-notes-textarea"
            rows="8"
            placeholder="Write key takeaways, explanations, formulas, code snippets, or revision points here..."
            value={noteText}
            onChange={handleTextChange}
          />
          <div className="ln-notes-hint">
            <span>💡 Notes are saved locally for this topic.</span>
            <span>{noteText.length} characters</span>
          </div>
        </div>

        {/* Footer */}
        <div className="ln-notes-footer">
          <div className="ln-notes-status">
            {savedStatus && (
              <span className="ln-notes-success-msg" role="status" aria-live="polite">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Notes saved successfully!
              </span>
            )}
          </div>
          <div className="ln-notes-actions">
            <button
              type="button"
              className="ln-notes-btn-close"
              onClick={onClose}
              id="btn-close-notes"
            >
              Close
            </button>
            <button
              type="button"
              className="ln-notes-btn-save"
              onClick={handleSave}
              id="btn-save-notes"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
