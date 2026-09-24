import { useState, useMemo } from 'react';

// ── Icons ────────────────────────────────────────────────────────────────────
const IconBook = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconExternalLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconBuilding = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
    <path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M12 10h.01" />
    <path d="M8 14h.01" /><path d="M16 14h.01" /><path d="M12 14h.01" />
  </svg>
);

const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ── Resource type metadata ───────────────────────────────────────────────────
function getResourceTypeMeta(type) {
  const t = (type || '').toLowerCase();
  if (t === 'documentation') {
    return {
      key: 'documentation',
      label: 'Documentation',
      icon: '📄',
      badgeClass: 'badge-doc',
    };
  }
  if (t === 'video' || t === 'course') {
    return {
      key: 'video',
      label: 'Video Course',
      icon: '🎥',
      badgeClass: 'badge-video',
    };
  }
  if (t === 'practice' || t === 'exercise' || t === 'quiz' || t === 'challenge') {
    return {
      key: 'practice',
      label: 'Practice & Labs',
      icon: '⚡',
      badgeClass: 'badge-practice',
    };
  }
  if (t === 'project' || t === 'build') {
    return {
      key: 'project',
      label: 'Hands-on Project',
      icon: '🛠️',
      badgeClass: 'badge-project',
    };
  }
  return {
    key: 'tutorial',
    label: 'Tutorial Guide',
    icon: '📘',
    badgeClass: 'badge-tutorial',
  };
}

// ── Helper to infer provider from URL if missing ─────────────────────────────
function inferProvider(res) {
  if (res.provider && res.provider.trim()) return res.provider.trim();
  if (!res.url) return 'Official Guide';
  try {
    const hostname = new URL(res.url).hostname.replace(/^www\./, '');
    if (hostname.includes('python.org')) return 'Python.org';
    if (hostname.includes('realpython.com')) return 'Real Python';
    if (hostname.includes('freecodecamp.org')) return 'freeCodeCamp';
    if (hostname.includes('w3schools.com')) return 'W3Schools';
    if (hostname.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'YouTube';
    if (hostname.includes('kaggle.com')) return 'Kaggle';
    if (hostname.includes('hackerrank.com')) return 'HackerRank';
    if (hostname.includes('github.com')) return 'GitHub';
    if (hostname.includes('mozilla.org')) return 'MDN Web Docs';
    if (hostname.includes('leetcode.com')) return 'LeetCode';
    if (hostname.includes('coursera.org')) return 'Coursera';
    if (hostname.includes('udemy.com')) return 'Udemy';
    if (hostname.includes('pythonmorsels.com')) return 'Python Morsels';
    return hostname;
  } catch {
    return 'Official Resource';
  }
}

// ── Helper to infer type if missing ──────────────────────────────────────────
function inferType(res) {
  if (res.type && res.type.trim()) return res.type.toLowerCase();
  const url = (res.url || '').toLowerCase();
  const title = (res.title || '').toLowerCase();
  if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || title.includes('video') || title.includes('course')) {
    return 'video';
  }
  if (title.includes('practice') || title.includes('exercise') || title.includes('quiz') || title.includes('challenge') || url.includes('hackerrank') || url.includes('leetcode')) {
    return 'practice';
  }
  if (title.includes('project') || title.includes('build') || title.includes('deploy')) {
    return 'project';
  }
  if (url.includes('docs.') || url.includes('/docs/') || url.includes('/doc/') || title.includes('documentation') || title.includes('doc')) {
    return 'documentation';
  }
  return 'tutorial';
}

// ── Estimate duration in minutes for sorting ─────────────────────────────────
function parseDurationMinutes(durationStr) {
  if (!durationStr) return 30;
  const str = String(durationStr).toLowerCase();
  const hrMatch = str.match(/([\d.]+)\s*(?:hr|hour)/);
  if (hrMatch) {
    return Math.round(parseFloat(hrMatch[1]) * 60);
  }
  const minMatch = str.match(/(\d+)\s*(?:min|minute)/);
  if (minMatch) {
    return parseInt(minMatch[1], 10);
  }
  return 30;
}

function inferDuration(res) {
  if (res.estimated_time && res.estimated_time.trim()) return res.estimated_time.trim();
  const type = inferType(res);
  if (type === 'video') return '45 min';
  if (type === 'project') return '1.5 hr';
  if (type === 'practice') return '30 min';
  if (type === 'documentation') return '25 min';
  return '30 min';
}

// ── Normalize URL for deduplication ──────────────────────────────────────────
function normalizeUrl(url) {
  if (!url) return '';
  return url.trim().replace(/\/+$/, '').toLowerCase();
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ResourcesPage({ roadmap }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // ── Extract, enrich, and deduplicate resources per week ────────────────────
  const { allDeduplicatedResources, processedWeeks, availableProviders } = useMemo(() => {
    if (!roadmap) {
      return {
        allDeduplicatedResources: [],
        processedWeeks: [],
        availableProviders: [],
      };
    }
    const all = [];
    const providersSet = new Set();

    const weeks = (roadmap.weekly_plan || []).map((week) => {
      const seenUrls = new Set();
      const weekResources = [];

      const addResource = (rawRes, source, topicName) => {
        if (!rawRes || !rawRes.url) return;
        const urlKey = normalizeUrl(rawRes.url);

        // Deduplication within this week
        if (seenUrls.has(urlKey)) {
          const existing = weekResources.find((r) => normalizeUrl(r.url) === urlKey);
          if (existing) {
            if (!existing.description && rawRes.description) {
              existing.description = rawRes.description;
            }
            if (!existing.topic && topicName) {
              existing.topic = topicName;
            }
          }
          return;
        }
        seenUrls.add(urlKey);

        const type = inferType(rawRes);
        const provider = inferProvider(rawRes);
        const duration = inferDuration(rawRes);
        const durationMinutes = parseDurationMinutes(duration);

        // Provide clean, informative description if empty
        let desc = rawRes.description;
        if (!desc || !desc.trim()) {
          if (topicName) {
            desc = `Essential study guide and practical reference covering ${topicName.toLowerCase()}.`;
          } else {
            desc = `Curated learning material from ${provider} for Week ${week.week_number}.`;
          }
        }

        const enriched = {
          ...rawRes,
          id: `w${week.week_number}_r${weekResources.length}`,
          week: week.week_number,
          topic: topicName || '',
          type,
          provider,
          estimated_time: duration,
          durationMinutes,
          description: desc,
          source,
        };

        weekResources.push(enriched);
        all.push(enriched);
        if (provider) providersSet.add(provider);
      };

      // 1. Topic references
      if (Array.isArray(week.topic_references)) {
        week.topic_references.forEach((ref, idx) => {
          const topicName = (week.topics && week.topics[idx]) || `Topic ${idx + 1}`;
          addResource(ref, 'topic_reference', topicName);
        });
      }

      // 2. Week-level resources
      if (Array.isArray(week.resources)) {
        week.resources.forEach((res) => {
          addResource(res, 'week_resource', '');
        });
      }

      return {
        weekNumber: week.week_number,
        focus: week.focus || `Week ${week.week_number}`,
        resources: weekResources,
      };
    });

    const sortedProviders = Array.from(providersSet).sort((a, b) => a.localeCompare(b));

    return {
      allDeduplicatedResources: all,
      processedWeeks: weeks,
      availableProviders: sortedProviders,
    };
  }, [roadmap]);

  // ── Filter and sort logic ──────────────────────────────────────────────────
  const filteredWeeks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return processedWeeks
      .map((week) => {
        let list = week.resources.filter((res) => {
          // Type filter
          if (selectedType !== 'all' && res.type !== selectedType) {
            return false;
          }

          // Provider filter
          if (selectedProvider !== 'all' && res.provider !== selectedProvider) {
            return false;
          }

          // Search query
          if (q) {
            const inTitle = (res.title || '').toLowerCase().includes(q);
            const inDesc = (res.description || '').toLowerCase().includes(q);
            const inTopic = (res.topic || '').toLowerCase().includes(q);
            const inProvider = (res.provider || '').toLowerCase().includes(q);
            const inType = (res.type || '').toLowerCase().includes(q);
            if (!inTitle && !inDesc && !inTopic && !inProvider && !inType) {
              return false;
            }
          }

          return true;
        });

        // Sorting
        if (sortBy === 'duration-asc') {
          list = [...list].sort((a, b) => a.durationMinutes - b.durationMinutes);
        } else if (sortBy === 'duration-desc') {
          list = [...list].sort((a, b) => b.durationMinutes - a.durationMinutes);
        } else if (sortBy === 'alpha') {
          list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        return {
          ...week,
          resources: list,
        };
      })
      .filter((week) => week.resources.length > 0);
  }, [processedWeeks, searchQuery, selectedType, selectedProvider, sortBy]);

  const totalFilteredCount = useMemo(() => {
    return filteredWeeks.reduce((acc, w) => acc + w.resources.length, 0);
  }, [filteredWeeks]);

  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedType !== 'all' ||
    selectedProvider !== 'all' ||
    sortBy !== 'recommended';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedProvider('all');
    setSortBy('recommended');
  };

  const TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'video', label: 'Videos' },
    { value: 'practice', label: 'Practice' },
    { value: 'project', label: 'Projects' },
  ];

  if (!roadmap) {
    return (
      <div className="res-page">
        <div className="res-empty-card">
          <div className="res-empty-icon">📂</div>
          <h3 className="res-empty-title">No Learning Path Selected</h3>
          <p className="res-empty-desc">
            Generate or load a personalized roadmap to explore curated study materials, verified documentation, videos, and practice labs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="res-page">
      {/* ════════ HEADER CARD ════════ */}
      <div className="res-header-card">
        <div className="res-header-left">
          <div className="res-header-icon-box">
            <IconBook />
          </div>
          <div className="res-header-text">
            <h2 className="res-header-title">Study Materials &amp; Reference Links</h2>
            <p className="res-header-subtitle">
              Curated resources to support your personalized learning journey
            </p>
          </div>
        </div>

        {/* Separated Resource Count Badge / Stat */}
        <div className="res-count-badge-wrapper">
          <div className="res-count-badge" title="Total resources in current view">
            <span className="res-count-number">{totalFilteredCount}</span>
            <span className="res-count-label">
              {totalFilteredCount === 1 ? 'Resource' : 'Resources'}
            </span>
          </div>
        </div>
      </div>

      {/* ════════ SEARCH & CONTROLS BAR ════════ */}
      <div className="res-controls-card">
        {/* Top row: Search input */}
        <div className="res-search-row">
          <div className="res-search-input-wrapper">
            <span className="res-search-icon">
              <IconSearch />
            </span>
            <input
              type="text"
              className="res-search-input"
              placeholder="Search resources, topics, or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search resources"
            />
            {searchQuery && (
              <button
                type="button"
                className="res-search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="res-sort-wrapper">
            <label htmlFor="res-sort-select" className="res-control-label">
              Sort by:
            </label>
            <select
              id="res-sort-select"
              className="res-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="duration-asc">Shortest Duration</option>
              <option value="duration-desc">Longest Duration</option>
              <option value="alpha">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Bottom row: Type filter pills & Provider filter */}
        <div className="res-filter-row">
          {/* Type Filter Pills */}
          <div className="res-type-pills" role="tablist" aria-label="Filter by resource type">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`res-type-pill ${selectedType === opt.value ? 'active' : ''}`}
                onClick={() => setSelectedType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Provider Filter Select */}
          <div className="res-provider-wrapper">
            <label htmlFor="res-provider-select" className="res-control-label">
              Provider:
            </label>
            <select
              id="res-provider-select"
              className="res-select res-select-provider"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              <option value="all">All Providers</option>
              {availableProviders.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter summary bar */}
        {isFilterActive && (
          <div className="res-filter-status-bar">
            <span className="res-filter-status-text">
              Showing <strong>{totalFilteredCount}</strong> of{' '}
              <strong>{allDeduplicatedResources.length}</strong> resources
              {selectedType !== 'all' && ` • Type: ${selectedType}`}
              {selectedProvider !== 'all' && ` • Provider: ${selectedProvider}`}
              {searchQuery && ` • Query: "${searchQuery}"`}
            </span>
            <button
              type="button"
              className="res-reset-filters-btn"
              onClick={handleResetFilters}
            >
              ↺ Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* ════════ RESOURCE SECTIONS (WEEKLY GROUPING) ════════ */}
      {filteredWeeks.length === 0 ? (
        <div className="res-no-results-card">
          <div className="res-no-results-icon">🔍</div>
          <h3 className="res-no-results-title">No matching resources found</h3>
          <p className="res-no-results-desc">
            We couldn't find any resources matching your search and filter criteria. Try adjusting the keywords or clearing filters.
          </p>
          <button
            type="button"
            className="res-clear-btn-primary"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="res-weeks-container">
          {filteredWeeks.map((week) => (
            <section key={week.weekNumber} className="res-week-section">
              {/* Week Section Header */}
              <div className="res-week-header">
                <div className="res-week-header-info">
                  <div className="res-week-badge">Week {week.weekNumber}</div>
                  <h3 className="res-week-title">{week.focus}</h3>
                </div>
                <div className="res-week-count-badge">
                  {week.resources.length} {week.resources.length === 1 ? 'Resource' : 'Resources'}
                </div>
              </div>

              {/* Resource Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
              <div className="res-grid">
                {week.resources.map((res) => {
                  const meta = getResourceTypeMeta(res.type);

                  return (
                    <article key={res.id} className="res-card">
                      {/* Top Row: Type badge & Duration */}
                      <div className="res-card-top">
                        <span className={`res-badge ${meta.badgeClass}`}>
                          <span className="res-badge-icon" aria-hidden="true">
                            {meta.icon}
                          </span>
                          <span className="res-badge-text">{meta.label}</span>
                        </span>

                        <span className="res-duration-tag">
                          <IconClock /> {res.estimated_time}
                        </span>
                      </div>

                      {/* Topic Tag if linked to specific topic */}
                      {res.topic && (
                        <div className="res-topic-tag" title={res.topic}>
                          Topic: {res.topic}
                        </div>
                      )}

                      {/* Resource Title (Max 2 lines, no default underlines) */}
                      <h4 className="res-card-title" title={res.title}>
                        {res.title}
                      </h4>

                      {/* Description (Max 2-3 lines, readable gray) */}
                      <p className="res-card-desc" title={res.description}>
                        {res.description}
                      </p>

                      {/* Card Footer: Provider & Modern Action Button */}
                      <div className="res-card-footer">
                        <div className="res-provider-info" title={`Provider: ${res.provider}`}>
                          <IconBuilding />
                          <span className="res-provider-name">{res.provider}</span>
                        </div>

                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="res-action-btn"
                          title={`Open ${res.title} in new tab`}
                        >
                          Open Resource
                          <span className="res-action-arrow">
                            <IconExternalLink />
                          </span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
