// ============================================================
// APP: onboarding flow, feed rendering, progress page, nav.
// ============================================================

let state = null;
let instanceCounter = 0;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

async function init() {
  renderAuthUI();
  wireNav();
  wireGoalModal();

  try {
    await checkAuth(); // Ensure currentUser is set before routing
    renderAuthUI();

    if (currentUser) {
      // Signed-in user: load state from DB, show onboarding or feed
      wireOnboarding();
      state = await loadState();
      state = touchStreak(state);
      await saveState(state);
      renderAuthUI();

      if (state.onboarded) {
        showScreen("feed");
        seedFeed();
      } else {
        showScreen("onboarding");
      }
    } else {
      // Guest: skip straight to feed, use ephemeral in-memory state only
      state = defaultState();
      state.onboarded = true;
      showScreen("landing"); // show landing/intro screen for guests
    }
  } catch (err) {
    console.error("Init error:", err);
    state = defaultState();
    state.onboarded = true;
    renderAuthUI();
    showScreen("landing");
  }
}

async function signInWithGoogle() {
  try {
    // Fetch CSRF token required by NextAuth v5 for POST sign-in
    const res = await fetch("/api/auth/csrf");
    const data = await res.json();
    const csrfToken = data.csrfToken;

    // Submit a form with the CSRF token to trigger Google OAuth redirect
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/signin/google";
    form.style.display = "none";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "csrfToken";
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    const callbackInput = document.createElement("input");
    callbackInput.type = "hidden";
    callbackInput.name = "callbackUrl";
    callbackInput.value = window.location.origin;
    form.appendChild(callbackInput);

    document.body.appendChild(form);
    form.submit();
  } catch (err) {
    console.error("Sign-in error:", err);
    // Fallback: redirect to NextAuth sign-in page
    window.location.href = "/api/auth/signin/google";
  }
}

function renderAuthUI() {
  const containers = [
    document.getElementById("auth-container"),
    document.getElementById("ob-auth-container")
  ].filter(Boolean);

  if (containers.length === 0) return;

  let html = "";
  if (typeof currentUser !== "undefined" && currentUser) {
    const nameOrEmail = currentUser.name || currentUser.email || "Account";
    const avatar = currentUser.image
      ? `<img src="${currentUser.image}" class="user-avatar" alt="${nameOrEmail}" />`
      : `<div class="user-avatar-fallback">${nameOrEmail.charAt(0).toUpperCase()}</div>`;
    html = `
      <div class="user-pill" title="${currentUser.email || ''}">
        ${avatar}
        <span>${nameOrEmail.split(" ")[0]}</span>
        <form action="/api/auth/signout" method="POST" style="display:inline; margin:0;">
          <button type="submit" class="auth-out-link" style="background:none; border:none; padding:0;">Sign out</button>
        </form>
      </div>
    `;
  } else {
    html = `
      <button class="auth-btn" id="google-signin-btn" onclick="signInWithGoogle()">
        <svg class="auth-google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Sign in with Google</span>
      </button>
    `;
  }

  containers.forEach(c => { c.innerHTML = html; });
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(`screen-${name}`);
  if (target) target.classList.add("active");
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

  // Landing screen: sign-in button
  const landingSigninBtn = document.getElementById("landing-signin-btn");
  if (landingSigninBtn) {
    landingSigninBtn.addEventListener("click", () => signInWithGoogle());
  }

  // Landing screen: guest button
  const guestBtn = document.getElementById("landing-guest-btn");
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      seedFeed();
      showScreen("feed");
    });
  }
}

/* ============================================================
   ONBOARDING — Quiz-based familiarity scoring
   ============================================================ */
let selectedPathways = new Set(["Fundamentals"]);

// Quiz state
let quizQuestions = [];
let quizIndex = 0;
let quizAnswers = {}; // questionId → selectedOptionIndex

function wireOnboarding() {
  const startBtn = document.getElementById("ob-start-btn");
  const pathwayContinueBtn = document.getElementById("ob-pathway-continue-btn");
  const quizBackBtn = document.getElementById("quiz-back-btn");
  const quizNextBtn = document.getElementById("quiz-next-btn");
  const quizFinishBtn = document.getElementById("quiz-finish-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.getElementById("ob-intro-view").style.display = "none";
      document.getElementById("ob-pathway-view").style.display = "flex";
      renderPathwayList();
    });
  }

  if (pathwayContinueBtn) {
    pathwayContinueBtn.addEventListener("click", () => startQuiz());
  }

  if (quizBackBtn) {
    quizBackBtn.addEventListener("click", () => {
      if (quizIndex === 0) {
        document.getElementById("ob-quiz-view").style.display = "none";
        document.getElementById("ob-pathway-view").style.display = "flex";
        return;
      }
      quizIndex -= 1;
      renderQuizQuestion();
    });
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener("click", () => {
      if (quizIndex >= quizQuestions.length - 1) {
        showQuizResults();
        return;
      }
      quizIndex += 1;
      renderQuizQuestion();
    });
  }

  if (quizFinishBtn) {
    quizFinishBtn.addEventListener("click", () => finishOnboarding());
  }
}

function renderPathwayList() {
  const container = document.getElementById("ob-pathways-list");
  if (!container) return;

  const pathways = typeof PATHWAYS !== "undefined" ? PATHWAYS : ["Fundamentals", "AWS", "Google Cloud", "Distributed Systems", "Data & Batch Processing", "Reliability & Ops", "Containers & Orchestration"];

  container.innerHTML = pathways.map(pw => {
    const isSel = selectedPathways.has(pw);
    const count = TOPICS.filter(t => t.category === pw).length;
    return `
      <div class="pathway-card ${isSel ? "selected" : ""}" data-pw="${pw}">
        <div>
          <div class="pw-title">${pw}</div>
          <div class="pw-count">${count} topic${count === 1 ? "" : "s"}</div>
        </div>
        <div class="pw-check">✓</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".pathway-card").forEach(card => {
    card.addEventListener("click", () => {
      const pw = card.dataset.pw;
      if (selectedPathways.has(pw)) {
        if (selectedPathways.size > 1) selectedPathways.delete(pw);
      } else {
        selectedPathways.add(pw);
      }
      renderPathwayList();
    });
  });
}

function startQuiz() {
  quizQuestions = selectQuizQuestions([...selectedPathways]);
  quizIndex = 0;
  quizAnswers = {};

  document.getElementById("ob-pathway-view").style.display = "none";
  document.getElementById("ob-quiz-view").style.display = "flex";
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizQuestions[quizIndex];
  if (!q) { showQuizResults(); return; }

  const total = quizQuestions.length;
  const pct = (quizIndex / total) * 100;

  const stepLabel = document.getElementById("quiz-step-label");
  const progressFill = document.getElementById("quiz-progress-fill");
  const categoryBadge = document.getElementById("quiz-category-badge");
  if (stepLabel) stepLabel.textContent = `Q ${quizIndex + 1} / ${total}`;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (categoryBadge) categoryBadge.textContent = q.categories.join(" · ");

  const questionEl = document.getElementById("quiz-question-text");
  if (questionEl) questionEl.textContent = q.q;

  const answered = quizAnswers[q.id] !== undefined;
  const userAnswer = quizAnswers[q.id];

  const optionsEl = document.getElementById("quiz-options");
  if (optionsEl) {
    optionsEl.innerHTML = q.options.map((opt, i) => {
      let cls = "quiz-option";
      if (answered) {
        if (i === q.correct) cls += " correct";
        else if (i === userAnswer) cls += " wrong";
        else cls += " dimmed";
      } else if (i === userAnswer) {
        cls += " selected";
      }
      return `<button class="${cls}" data-idx="${i}">${opt}</button>`;
    }).join("");

    if (!answered) {
      optionsEl.querySelectorAll(".quiz-option").forEach(btn => {
        btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.idx, 10)));
      });
    }
  }

  const feedbackEl = document.getElementById("quiz-feedback");
  if (feedbackEl) {
    if (answered) {
      const correct = userAnswer === q.correct;
      feedbackEl.innerHTML = `
        <div class="quiz-feedback-inner ${correct ? "correct" : "wrong"}">
          <span class="feedback-icon">${correct ? "✓" : "✗"}</span>
          <span>${q.explain}</span>
        </div>`;
      feedbackEl.style.display = "block";
    } else {
      feedbackEl.style.display = "none";
      feedbackEl.innerHTML = "";
    }
  }

  const nextBtn = document.getElementById("quiz-next-btn");
  if (nextBtn) {
    nextBtn.disabled = !answered;
    nextBtn.textContent = quizIndex >= total - 1 ? "See results →" : "Next →";
  }
  const backBtn = document.getElementById("quiz-back-btn");
  if (backBtn) backBtn.style.visibility = quizIndex === 0 ? "hidden" : "visible";
}

function selectAnswer(idx) {
  const q = quizQuestions[quizIndex];
  if (!q || quizAnswers[q.id] !== undefined) return; // already answered
  quizAnswers[q.id] = idx;
  renderQuizQuestion();
}

function showQuizResults() {
  const familiarity = scoreQuiz(quizQuestions, quizAnswers);
  const total = quizQuestions.length;
  const numCorrect = quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length;
  const pct = Math.round((numCorrect / total) * 100);

  // Apply familiarity scores to state
  TOPICS.forEach(t => {
    state.topics[t.id].familiarity = familiarity[t.id] !== undefined
      ? familiarity[t.id]
      : QUIZ_DEFAULT_FAMILIARITY;
  });

  // Show results screen
  document.getElementById("ob-quiz-view").style.display = "none";
  document.getElementById("ob-quiz-results-view").style.display = "flex";

  const scoreDisplay = document.getElementById("quiz-score-display");
  if (scoreDisplay) {
    scoreDisplay.innerHTML = `
      <div class="quiz-score-ring">
        <div class="quiz-score-number">${numCorrect}<span>/${total}</span></div>
        <div class="quiz-score-label">${pct >= 70 ? "Strong foundation 🚀" : pct >= 40 ? "Room to grow 📈" : "Let's start from scratch 🌱"}</div>
      </div>`;
  }

  // Per-pathway breakdown
  const breakdown = document.getElementById("quiz-results-breakdown");
  if (breakdown) {
    const pathwayScores = {};
    quizQuestions.forEach(q => {
      const isCorrect = quizAnswers[q.id] === q.correct;
      q.categories.forEach(cat => {
        if (!pathwayScores[cat]) pathwayScores[cat] = { correct: 0, total: 0 };
        pathwayScores[cat].total += 1;
        if (isCorrect) pathwayScores[cat].correct += 1;
      });
    });

    breakdown.innerHTML = `
      <div class="breakdown-title">Your scores by area</div>
      ${Object.entries(pathwayScores).map(([cat, s]) => {
        const ratio = s.correct / s.total;
        const label = ratio >= 0.67 ? "Strong" : ratio >= 0.34 ? "Moderate" : "Needs work";
        const barW = Math.round(ratio * 100);
        return `
          <div class="breakdown-row">
            <div class="breakdown-cat">${cat}</div>
            <div class="breakdown-bar-track">
              <div class="breakdown-bar-fill" style="width:${barW}%"></div>
            </div>
            <div class="breakdown-label ${ratio >= 0.67 ? "strong" : ratio >= 0.34 ? "moderate" : "weak"}">${label}</div>
          </div>`;
      }).join("")}
    `;
  }
}

async function finishOnboarding() {
  state.onboarded = true;
  await saveState(state);
  showScreen("feed");
  seedFeed();
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
      <span class="pathway-chip">${topic.category || "Fundamentals"}</span>
      <span class="tag-chip">${topic.tag}</span>
      <span class="card-type-label">${typeLabel}</span>
    </div>
  `;
}

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

  const pathwaysList = typeof PATHWAYS !== "undefined" ? PATHWAYS : ["Fundamentals", "AWS", "Google Cloud", "Distributed Systems", "Data & Batch Processing", "Reliability & Ops", "Containers & Orchestration"];

  let categoriesHtml = "";

  pathwaysList.forEach(pw => {
    const categoryTopics = TOPICS.filter(t => t.category === pw);
    if (!categoryTopics.length) return;

    const avgFam = Math.round(
      categoryTopics.reduce((acc, t) => acc + (state.topics[t.id].familiarity || 0), 0) / categoryTopics.length
    );

    const sortedCatTopics = [...categoryTopics].sort((a, b) => (state.topics[a.id].familiarity || 0) - (state.topics[b.id].familiarity || 0));

    categoriesHtml += `
      <div class="category-header">
        <span>${pw}</span>
        <span style="color:var(--text-faint); font-weight:normal;">${avgFam}% avg</span>
      </div>
      <div class="topic-list">
        ${sortedCatTopics.map(t => {
          const ts = state.topics[t.id];
          const level = Math.max(1, Math.round((ts.familiarity || 0) / 20));
          return `
            <div class="topic-row">
              <div>
                <div class="topic-name"><span class="tag-chip">${t.tag}</span>${t.name}</div>
                <div class="topic-meta">${ts.familiarity || 0}% · seen ${ts.seen || 0}× · ${ts.correct || 0}/${(ts.correct || 0) + (ts.wrong || 0)} correct</div>
              </div>
              ${signalBarsHtml(level, 5, (ts.familiarity || 0) < 40)}
            </div>
          `;
        }).join("")}
      </div>
    `;
  });

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

    <div class="section-title">Topic Mastery by Pathway</div>
    ${categoriesHtml}

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
                  <div class="goal-topic">${g.done ? "✓ " : ""}${t ? t.name : g.topicId}</div>
                  <div class="goal-target">${ts ? ts.familiarity : 0}% / ${g.targetLevel}% target</div>
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
