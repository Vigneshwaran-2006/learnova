import { useState, useRef, useEffect } from 'react';

export default function TopNav({ backendStatus, userName, onProfileClick, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    onProfileClick?.();
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout?.();
  };

  return (
    <header className="topnav">
      {/* Search bar */}
      <div className="topnav-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          className="topnav-search-input"
          placeholder="Search topics, skills or resources..."
          aria-label="Search"
        />
      </div>

      {/* Right section */}
      <div className="topnav-right">
        {/* Backend status */}
        <div className="topnav-status-pill" title={backendStatus?.message || 'Checking backend...'}>
          <span className={`status-dot ${backendStatus?.online ? 'online' : 'offline'}`} />
          <span className="topnav-status-text">
            {backendStatus?.online ? 'Backend Online' : 'Backend Standby'}
          </span>
        </div>

        {/* Bell */}
        <button className="topnav-icon-btn" title="Notifications" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* User avatar + dropdown */}
        <div className="topnav-user-wrap" ref={dropdownRef}>
          <button
            className="topnav-user"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
            id="topnav-user-btn"
          >
            <div className="topnav-avatar">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
            <span className="topnav-username">Hi, {userName || 'Learner'}</span>
            <svg
              className={`topnav-chevron${dropdownOpen ? ' open' : ''}`}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="topnav-dropdown" role="menu">
              {/* User info */}
              <div className="topnav-dropdown-user">
                <div className="topnav-dropdown-avatar">
                  {userName ? userName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="topnav-dropdown-name">{userName || 'Learner'}</div>
                  <div className="topnav-dropdown-role">Learnova Member</div>
                </div>
              </div>

              <div className="topnav-dropdown-divider" />

              {/* Profile link */}
              <button
                className="topnav-dropdown-item"
                role="menuitem"
                onClick={handleProfileClick}
                id="topnav-profile-link"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                View Profile
              </button>

              <div className="topnav-dropdown-divider" />

              {/* Logout */}
              <button
                className="topnav-dropdown-item logout"
                role="menuitem"
                onClick={handleLogout}
                id="topnav-logout-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
