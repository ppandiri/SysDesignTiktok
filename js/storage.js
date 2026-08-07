// ============================================================
// STORAGE: all state lives in localStorage, client-side only.
// ============================================================

const STORAGE_KEY = "sdtok_state_v1";

function defaultState() {
  const topics = {};
  TOPICS.forEach(t => {
    topics[t.id] = {
      familiarity: 0,   // 0-100
      seen: 0,
      correct: 0,
      wrong: 0,
      lastSeen: 0,
      cardsShown: {}    // cardId -> count shown
    };
  });
  return {
    onboarded: false,
    topics,
    goals: [],           // {id, topicId, targetLevel, createdAt, done}
    streak: { lastVisit: null, count: 0 },
    stats: { totalReviewed: 0, totalCorrect: 0 },
    feedPosition: 0,
    createdAt: Date.now()
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // merge in any new topics not present in saved state (future-proofing)
    const fresh = defaultState();
    parsed.topics = Object.assign({}, fresh.topics, parsed.topics || {});
    return Object.assign(fresh, parsed);
  } catch (e) {
    console.warn("Failed to load state, resetting.", e);
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save state.", e);
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState();
}

function touchStreak(state) {
  const today = new Date().toDateString();
  if (state.streak.lastVisit === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.streak.lastVisit === yesterday) {
    state.streak.count += 1;
  } else {
    state.streak.count = 1;
  }
  state.streak.lastVisit = today;
  return state;
}
