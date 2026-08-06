// ============================================================
// ALGORITHM: adaptive card selection.
// Weak topics (low familiarity) are weighted heavily at first;
// as familiarity rises the feed naturally rotates to other topics.
// ============================================================

const QUESTION_TYPES = new Set(["mc", "tf", "flashcard"]);
let recentTopicHistory = []; // in-memory only, resets on reload — avoids immediate repeats
let cardsSinceQuestion = 0;

function topicWeight(topicState) {
  const familiarity = topicState.familiarity; // 0-100
  const gapWeight = Math.pow(100 - familiarity, 1.4) + 5; // steep preference for weak topics
  const recencyBoost = topicState.lastSeen
    ? Math.min(1 + (Date.now() - topicState.lastSeen) / (1000 * 60 * 30), 3)
    : 2.5; // never-seen topics get a boost
  const antiRepeat = recentTopicHistory.includes(topicState.__id) ? 0.25 : 1;
  return gapWeight * recencyBoost * antiRepeat * (0.7 + Math.random() * 0.6);
}

function weightedPickTopic(state) {
  const entries = TOPICS.map(t => {
    const ts = state.topics[t.id];
    ts.__id = t.id;
    return { id: t.id, weight: topicWeight(ts) };
  });
  const total = entries.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of entries) {
    r -= e.weight;
    if (r <= 0) return e.id;
  }
  return entries[entries.length - 1].id;
}

function cardsForTopic(topicId) {
  return CARDS.filter(c => c.topicId === topicId);
}

function pickCardForTopic(state, topicId) {
  const pool = cardsForTopic(topicId);
  const topicState = state.topics[topicId];
  const familiarity = topicState.familiarity;

  // Decide whether we want to teach (concept) or test (question) right now.
  const forceQuestion = cardsSinceQuestion >= 3; // "questions every once in a while"
  let candidates;

  if (familiarity < 15 && !forceQuestion) {
    // very unfamiliar: prefer the concept card to teach first
    candidates = pool.filter(c => c.type === "concept");
    if (candidates.length === 0) candidates = pool;
  } else if (forceQuestion) {
    candidates = pool.filter(c => QUESTION_TYPES.has(c.type));
    if (candidates.length === 0) candidates = pool;
  } else {
    // mix: weighted toward questions as familiarity grows, but concepts still show up
    const wantsQuestion = Math.random() < 0.55 + familiarity / 300;
    candidates = pool.filter(c => (wantsQuestion ? QUESTION_TYPES.has(c.type) : c.type === "concept"));
    if (candidates.length === 0) candidates = pool;
  }

  // Prefer cards shown least often so far, to cycle through content.
  candidates = [...candidates].sort((a, b) => {
    const sa = topicState.cardsShown[a.id] || 0;
    const sb = topicState.cardsShown[b.id] || 0;
    return sa - sb;
  });
  const leastShownCount = topicState.cardsShown[candidates[0].id] || 0;
  const tied = candidates.filter(c => (topicState.cardsShown[c.id] || 0) === leastShownCount);
  return tied[Math.floor(Math.random() * tied.length)];
}

function pickNextCard(state) {
  const topicId = weightedPickTopic(state);
  const card = pickCardForTopic(state, topicId);

  recentTopicHistory.push(topicId);
  if (recentTopicHistory.length > 3) recentTopicHistory.shift();

  if (QUESTION_TYPES.has(card.type)) {
    cardsSinceQuestion = 0;
  } else {
    cardsSinceQuestion += 1;
  }

  return card;
}

// Called once a card has been "consumed" (viewed, or answered).
function recordExposure(state, card) {
  const ts = state.topics[card.topicId];
  ts.seen += 1;
  ts.lastSeen = Date.now();
  ts.cardsShown[card.id] = (ts.cardsShown[card.id] || 0) + 1;
  if (card.type === "concept" && ts.familiarity < 8) {
    ts.familiarity = Math.min(100, ts.familiarity + 3); // small bump just for exposure
  }
}

// Called when a question card (mc/tf/flashcard) is answered.
function recordAnswer(state, card, correct) {
  const ts = state.topics[card.topicId];
  state.stats.totalReviewed += 1;
  if (correct) {
    state.stats.totalCorrect += 1;
    ts.correct += 1;
    const delta = 10 * (1 - ts.familiarity / 130); // diminishing returns near 100
    ts.familiarity = Math.min(100, ts.familiarity + Math.max(3, delta));
  } else {
    ts.wrong += 1;
    ts.familiarity = Math.max(0, ts.familiarity - 5);
  }
  checkGoalCompletion(state, card.topicId);
}

function checkGoalCompletion(state, topicId) {
  const fam = state.topics[topicId].familiarity;
  state.goals.forEach(g => {
    if (g.topicId === topicId && !g.done && fam >= g.targetLevel) {
      g.done = true;
      g.completedAt = Date.now();
    }
  });
}

function overallMastery(state) {
  const vals = TOPICS.map(t => state.topics[t.id].familiarity);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
