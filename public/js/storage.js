// ============================================================
// STORAGE: Database (via API) with guest localStorage fallback.
// ============================================================

const STORAGE_KEY = "sdtok_state_v1";

let currentUser = null;
let authChecked = false;
// Flag set by loadState: true if the user has existing saved progress (returning user)
let isReturningUser = false;

async function checkAuth() {
  if (authChecked) return currentUser;
  try {
    const res = await fetch("/api/auth/session");
    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        currentUser = data.user;
      }
    }
  } catch (e) {
    console.warn("Auth check failed, defaulting to guest mode.", e);
  }
  authChecked = true;
  return currentUser;
}

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

function normalizeState(parsed) {
  const fresh = defaultState();
  if (!parsed) return fresh;
  parsed.topics = Object.assign({}, fresh.topics, parsed.topics || {});
  return Object.assign(fresh, parsed);
}

function getLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch (e) {
    return null;
  }
}

async function loadState() {
  const user = await checkAuth();

  if (user) {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data = await res.json();
        if (data && data.state) {
          // Returning user: they have saved state in the DB
          isReturningUser = true;
          const serverState = normalizeState(data.state);
          // Always mark as onboarded so they skip straight to feed
          serverState.onboarded = true;
          return serverState;
        } else {
          // Brand-new signed-in user: no DB state yet
          isReturningUser = false;
          // Check if they have existing guest progress to migrate
          const localState = getLocalState();
          if (localState && (localState.onboarded || localState.stats.totalReviewed > 0)) {
            // Migrate guest progress to their account — they're a returning guest
            isReturningUser = true;
            localState.onboarded = true;
            await saveState(localState);
            return localState;
          }
          // Truly new user — start onboarding
          const fresh = defaultState();
          await saveState(fresh);
          return fresh;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch state from server, falling back to local state.", e);
    }
  }

  // Guest / Anonymous fallback
  isReturningUser = false;
  const local = getLocalState();
  return local || defaultState();
}

async function saveState(state) {
  const user = await checkAuth();

  // Always write to localStorage as offline/local cache
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save state to localStorage.", e);
  }

  if (user) {
    try {
      await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
    } catch (e) {
      console.warn("Failed to sync state to server.", e);
    }
  }
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  isReturningUser = false;
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
