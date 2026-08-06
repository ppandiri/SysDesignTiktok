// ============================================================
// APP: onboarding flow, feed rendering, progress page, nav.
// ============================================================

let state = loadState();
let instanceCounter = 0;

document.addEventListener("DOMContentLoaded", init);

function init() {
  state = touchStreak(state);
  saveState(state);

  if (state.onboarded) {
    showScreen("feed");
    seedFeed();
  } else {
    showScreen("onboarding");
  }

  wireNav();
  wireOnboarding();
  wireGoalModal();
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(`screen-${name}`).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.nav === name);
  });
  if (name === "progress") renderProgress();
  if (name === "feed") updateStreakPill();
}

function wireNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.dataset.nav));
  });
}

/* ============================================================
   ONBOARDING
   ============================================================ */
let obIndex = 0;
const obRatings = {}; // topicId -> 1..5

const RATING_LEVELS = [
  { level: 1, label: "Never heard of it", sub: "Totally new to me" },
  { level: 2, label: "Rings a bell", sub: "Heard the term, not much more" },
  { level: 3, label: "Sounds familiar", sub: "I get the basic idea" },
  { level: 4, label: "Comfortable", sub: "I could explain it reasonably well" },
  { level: 5, label: "Could teach it", sub: "I know this cold" },
];

function levelToFamiliarity(level) {
  return [null, 5, 25, 48, 72, 92][level];
}

function wireOnboarding() {
  document.getElementById("ob-start-btn").addEventListener("click", () => {
    document.getElementById("ob-intro-view").style.display = "none";
    document.getElementById("ob-survey-view").style.display = "flex";
    obIndex = 0;
    renderObTopic();
  });

  document.getElementById("ob-back-btn").addEventListener("click", () => {
    if (obIndex === 0) {
      document.getElementById("ob-survey-view").style.display = "none";
      document.getElementById("ob-intro-view").style.display = "flex";
      return;
    }
    obIndex -= 1;
    renderObTopic();
  });

  document.getElementById("ob-next-btn").addEventListener("click", () => {
    if (obIndex >= TOPICS.length - 1) {
      finishOnboarding();
      return;
    }
    obIndex += 1;
    renderObTopic();
  });
}

function renderObTopic() {
  const t = TOPICS[obIndex];
  document.getElementById("ob-step-label").textContent = `TOPIC ${obIndex + 1} / ${TOPICS.length}`;
  document.getElementById("ob-progress-fill").style.width = `${((obIndex) / TOPICS.length) * 100}%`;

  const wrap = document.getElementById("ob-topic-card");
  const selected = obRatings[t.id];
  wrap.innerHTML = `
    <span class="tag-chip">${t.tag}</span>
    <h2>${t.name}</h2>
    <div class="blurb">${t.blurb}</div>
    <div class="rating-scale">
      ${RATING_LEVELS.map(r => `
        <div class="rating-option ${selected === r.level ? "selected" : ""}" data-level="${r.level}">
          <div>
            <div class="rating-label">${r.label}</div>
            <div class="rating-sub">${r.sub}</div>
          </div>
          ${signalBarsHtml(r.level, 5, false)}
        </div>
      `).join("")}
    </div>
  `;

  wrap.querySelectorAll(".rating-option").forEach(el => {
    el.addEventListener("click", () => {
      const level = parseInt(el.dataset.level, 10);
      obRatings[t.id] = level;
      renderObTopic();
    });
  });

  const nextBtn = document.getElementById("ob-next-btn");
  nextBtn.disabled = !selected && selected !== 0;
  nextBtn.textContent = obIndex >= TOPICS.length - 1 ? "Start my feed →" : "Next";
}

function finishOnboarding() {
  TOPICS.forEach(t => {
    const level = obRatings[t.id] || 1;
    state.topics[t.id].familiarity = levelToFamiliarity(level);
  });
  state.onboarded = true;
  saveState(state);
  showScreen("feed");
  seedFeed();
}

function signalBarsHtml(level, max, weakClass) {
  const bars = [1, 2, 3, 4, 5].map(i => `<span class="bar ${i <= level ? "on" : ""}"></span>`).join("");
  return `<span class="signal-bars ${weakClass ? "weak" : ""}">${bars}</span>`;
}

/* ============================================================
   FEED
   ============================================================ */
const feedScroll = () => document.getElementById("feed-scroll");
let observer;

function seedFeed() {
  if (feedScroll().children.length > 0) return; // already seeded this session
  observer = new IntersectionObserver(onSlideIntersect, { root: feedScroll(), threshold: 0.6 });
  appendCards(6);
}

function appendCards(n) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const card = pickNextCard(state);
    frag.appendChild(buildSlide(card));
  }
  feedScroll().appendChild(frag);
  saveState(state);

  const slides = feedScroll().querySelectorAll(".feed-slide");
  // observe every not-yet-observed slide so we can record exposure once it's visible
  slides.forEach(s => {
    if (!s.dataset.observedExposure) {
      s.dataset.observedExposure = "1";
      observer.observe(s);
    }
  });
  // mark a slide a few from the end as the trigger to load the next batch
  const triggerIdx = Math.max(0, slides.length - 3);
  const triggerSlide = slides[triggerIdx];
  if (triggerSlide && !triggerSlide.dataset.loadMore) {
    triggerSlide.dataset.loadMore = "1";
  }
}

function onSlideIntersect(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const slide = entry.target;
    if (!slide.dataset.exposed) {
      slide.dataset.exposed = "1";
      const card = CARDS.find(c => c.id === slide.dataset.cardId);
      if (card) { recordExposure(state, card); saveState(state); }
    }
    if (slide.dataset.loadMore === "1" && !slide.dataset.loadMoreFired) {
      slide.dataset.loadMoreFired = "1";
      appendCards(4);
    }
  });
}

function buildSlide(card) {
  instanceCounter += 1;
  const slide = document.createElement("div");
  slide.className = "feed-slide";
  slide.dataset.cardId = card.id;
  slide.dataset.instance = instanceCounter;

  const topic = TOPICS.find(t => t.id === card.topicId);
  let inner;
  if (card.type === "concept") inner = renderConceptCard(card, topic);
  else if (card.type === "flashcard") inner = renderFlashCard(card, topic);
  else if (card.type === "mc") inner = renderMCCard(card, topic);
  else if (card.type === "tf") inner = renderTFCard(card, topic);
  slide.appendChild(inner);

  // mark ~3rd-from-end slide as a load-more trigger lazily; simpler: mark every slide, checked in appendCards
  return slide;
}

function kickerHtml(topic, typeLabel) {
  return `
    <div class="card-kicker">
      <span class="tag-chip">${topic.tag}</span>
      <span class="card-type-label">${typeLabel}</span>
    </div>
  `;
function diagramHtml(card) {
  if (card.diagram && typeof DIAGRAMS !== "undefined" && DIAGRAMS[card.diagram]) {
    return `<div class="card-diagram">${DIAGRAMS[card.diagram]}</div>`;
  }
  return "";
}

function renderConceptCard(card, topic) {
  const el = document.createElement("div");
  el.className = "card concept-card";
  el.innerHTML = `
    ${kickerHtml(topic, "Concept")}
    <h2>${card.title}</h2>
    ${diagramHtml(card)}
    <div class="body-text">${card.body.map(p => `<p>${p}</p>`).join("")}</div>
    <div class="swipe-hint"><span class="chev">⌄</span> swipe up to continue</div>
  `;
  return el;
}

function renderFlashCard(card, topic) {
  const el = document.createElement("div");
  el.className = "card flash-card";
  el.innerHTML = `
    ${kickerHtml(topic, "Flashcard")}
    <div class="flash-face" style="flex:1; justify-content:center; display:flex; flex-direction:column;">
      <div class="flash-q">${card.front}</div>
      ${diagramHtml(card)}
      <div class="flash-a">${card.back}</div>
    </div>
    <div class="flash-tap-hint">tap card to reveal answer</div>
    <div class="flash-actions">
      <button class="btn btn-miss" data-ans="0">Missed it</button>
      <button class="btn btn-got-it" data-ans="1">Got it</button>
    </div>
  `;
  el.addEventListener("click", (e) => {
    if (e.target.closest(".flash-actions")) return;
    el.classList.toggle("flipped");
  });
  el.querySelectorAll(".flash-actions button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (el.dataset.answered) return;
      el.dataset.answered = "1";
      const correct = btn.dataset.ans === "1";
      recordAnswer(state, card, correct);
      saveState(state);
      btn.parentElement.querySelectorAll("button").forEach(b => b.disabled = true);
      btn.style.outline = `2px solid ${correct ? "var(--success)" : "var(--error)"}`;
    });
  });
  return el;
}

function renderMCCard(card, topic) {
  const el = document.createElement("div");
  el.className = "card q-card";
  el.innerHTML = `
    ${kickerHtml(topic, "Multiple choice")}
    <h2>${card.question}</h2>
    ${diagramHtml(card)}
    <div class="q-options">
      ${card.options.map((opt, i) => `<button class="q-option" data-i="${i}">${opt}</button>`).join("")}
    </div>
    <div class="q-explain">${card.explanation}</div>
  `;
  el.querySelectorAll(".q-option").forEach(btn => {
    btn.addEventListener("click", () => {
      if (el.dataset.answered) return;
      el.dataset.answered = "1";
      const chosen = parseInt(btn.dataset.i, 10);
      const correct = chosen === card.correctIndex;
      recordAnswer(state, card, correct);
      saveState(state);
      el.querySelectorAll(".q-option").forEach((b, i) => {
        b.classList.add("disabled");
        if (i === card.correctIndex) b.classList.add("correct");
        else if (i === chosen) b.classList.add("incorrect");
      });
      el.querySelector(".q-explain").classList.add("show");
    });
  });
  return el;
}

function renderTFCard(card, topic) {
  const el = document.createElement("div");
  el.className = "card q-card";
  el.innerHTML = `
    ${kickerHtml(topic, "True or false")}
    <h2>${card.statement}</h2>
    ${diagramHtml(card)}
    <div class="tf-row">
      <button class="q-option" data-v="1">True</button>
      <button class="q-option" data-v="0">False</button>
    </div>
    <div class="q-explain">${card.explanation}</div>
  `;
  el.querySelectorAll(".q-option").forEach(btn => {
    btn.addEventListener("click", () => {
      if (el.dataset.answered) return;
      el.dataset.answered = "1";
      const chosenTrue = btn.dataset.v === "1";
      const correct = chosenTrue === card.answer;
      recordAnswer(state, card, correct);
      saveState(state);
      el.querySelectorAll(".q-option").forEach(b => {
        b.classList.add("disabled");
        const isTrueBtn = b.dataset.v === "1";
        if (isTrueBtn === card.answer) b.classList.add("correct");
        else if (b === btn) b.classList.add("incorrect");
      });
      el.querySelector(".q-explain").classList.add("show");
    });
  });
  return el;
}

function updateStreakPill() {
  const pill = document.getElementById("streak-pill");
  const n = state.streak.count || 1;
  pill.textContent = `🔥 ${n} day${n === 1 ? "" : "s"} streak`;
}

/* ============================================================
   PROGRESS PAGE
   ============================================================ */
function renderProgress() {
  const root = document.getElementById("progress-scroll");
  const mastery = overallMastery(state);
  const accuracy = state.stats.totalReviewed
    ? Math.round((state.stats.totalCorrect / state.stats.totalReviewed) * 100)
    : 0;
  const topicsStarted = TOPICS.filter(t => state.topics[t.id].seen > 0).length;

  const sortedTopics = [...TOPICS].sort((a, b) => state.topics[a.id].familiarity - state.topics[b.id].familiarity);

  root.innerHTML = `
    <div class="progress-hero">
      <div class="eyebrow">Your progress</div>
      <h1>${mastery}% overall mastery</h1>
    </div>

    <div class="stat-row">
      <div class="stat-box"><div class="stat-num">${state.stats.totalReviewed}</div><div class="stat-label">Reviewed</div></div>
      <div class="stat-box"><div class="stat-num">${accuracy}%</div><div class="stat-label">Accuracy</div></div>
      <div class="stat-box"><div class="stat-num">${state.streak.count || 0}</div><div class="stat-label">Day streak</div></div>
    </div>

    <div class="section-title">Weakest → strongest</div>
    <div id="topic-list">
      ${sortedTopics.map(t => {
        const ts = state.topics[t.id];
        const level = Math.max(1, Math.round(ts.familiarity / 20));
        return `
          <div class="topic-row">
            <div>
              <div class="topic-name"><span class="tag-chip">${t.tag}</span>${t.name}</div>
              <div class="topic-meta">${ts.familiarity}% · seen ${ts.seen}× · ${ts.correct}/${ts.correct + ts.wrong || 0} correct</div>
            </div>
            ${signalBarsHtml(level, 5, ts.familiarity < 40)}
          </div>
        `;
      }).join("")}
    </div>

    <div class="section-title">Learning goals</div>
    <div id="goal-list">
      ${state.goals.length === 0
        ? `<div class="empty-note">No goals yet — set one to track a target topic.</div>`
        : state.goals.map(g => {
            const t = TOPICS.find(x => x.id === g.topicId);
            const ts = state.topics[g.topicId];
            return `
              <div class="goal-card ${g.done ? "done" : ""}">
                <div class="goal-info">
                  <div class="goal-topic">${g.done ? "✓ " : ""}${t.name}</div>
                  <div class="goal-target">${ts.familiarity}% / ${g.targetLevel}% target</div>
                </div>
                <button class="goal-remove" data-goal="${g.id}">✕</button>
              </div>
            `;
          }).join("")
      }
    </div>
    <button class="add-goal-btn" id="add-goal-btn">+ Set a new learning goal</button>

    <button class="reset-link" id="reset-progress-btn">Reset all progress</button>
  `;

  root.querySelectorAll(".goal-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      state.goals = state.goals.filter(g => g.id !== btn.dataset.goal);
      saveState(state);
      renderProgress();
    });
  });
  document.getElementById("add-goal-btn").addEventListener("click", openGoalModal);
  document.getElementById("reset-progress-btn").addEventListener("click", () => {
    if (confirm("This clears all familiarity data, goals, and stats. Continue?")) {
      state = resetState();
      feedScroll().innerHTML = "";
      instanceCounter = 0;
      showScreen("onboarding");
      document.getElementById("ob-intro-view").style.display = "flex";
      document.getElementById("ob-survey-view").style.display = "none";
      for (const k in obRatings) delete obRatings[k];
    }
  });
}

/* ============================================================
   GOAL MODAL
   ============================================================ */
let modalSelectedTopic = null;
let modalSelectedTarget = null;

function wireGoalModal() {
  document.getElementById("goal-modal-cancel").addEventListener("click", closeGoalModal);
  document.getElementById("goal-modal-confirm").addEventListener("click", () => {
    if (!modalSelectedTopic || !modalSelectedTarget) return;
    state.goals.push({
      id: `g${Date.now()}`,
      topicId: modalSelectedTopic,
      targetLevel: modalSelectedTarget,
      createdAt: Date.now(),
      done: false
    });
    saveState(state);
    closeGoalModal();
    renderProgress();
  });
}

function openGoalModal() {
  modalSelectedTopic = null;
  modalSelectedTarget = null;
  renderGoalModalBody();
  document.getElementById("goal-modal-backdrop").classList.add("show");
}
function closeGoalModal() {
  document.getElementById("goal-modal-backdrop").classList.remove("show");
}

function renderGoalModalBody() {
  const wrap = document.getElementById("goal-modal-topics");
  const targets = [
    { v: 60, label: "Familiar (60%)" },
    { v: 80, label: "Proficient (80%)" },
    { v: 95, label: "Mastered (95%)" },
  ];
  wrap.innerHTML = `
    <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-faint); text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px;">Topic</div>
    ${TOPICS.map(t => `
      <div class="modal-topic-option ${modalSelectedTopic === t.id ? "selected" : ""}" data-topic="${t.id}">
        <span>${t.tag} — ${t.name}</span>
        <span style="color:var(--text-faint); font-family:var(--font-mono); font-size:11px;">${state.topics[t.id].familiarity}%</span>
      </div>
    `).join("")}
    <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-faint); text-transform:uppercase; letter-spacing:.05em; margin:16px 0 8px;">Target</div>
    <div style="display:flex; gap:8px;">
      ${targets.map(tg => `
        <div class="modal-topic-option" data-target="${tg.v}" style="flex:1; justify-content:center; ${modalSelectedTarget === tg.v ? "border-color:var(--accent); background:rgba(82,227,194,0.08);" : ""}">${tg.label}</div>
      `).join("")}
    </div>
  `;
  wrap.querySelectorAll("[data-topic]").forEach(el => {
    el.addEventListener("click", () => { modalSelectedTopic = el.dataset.topic; renderGoalModalBody(); updateConfirmState(); });
  });
  wrap.querySelectorAll("[data-target]").forEach(el => {
    el.addEventListener("click", () => { modalSelectedTarget = parseInt(el.dataset.target, 10); renderGoalModalBody(); updateConfirmState(); });
  });
  updateConfirmState();
}

function updateConfirmState() {
  document.getElementById("goal-modal-confirm").disabled = !(modalSelectedTopic && modalSelectedTarget);
}
