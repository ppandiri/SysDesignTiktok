import React from "react";

export default function Home() {
  return (
    <div id="app">

      {/* LANDING — guest entry point, no form */}
      <section id="screen-landing" className="screen active">
        <div className="ob-intro">
          <div className="ob-intro-header">
            <div className="eyebrow">SystemFeed</div>
          </div>
          <div className="ob-intro-content">
            <h1>Learn system design the way you scroll everything else.</h1>
            <p>Sign in to track your progress, personalise your feed, and pick up where you left off across devices.</p>
            <div className="signal-legend">
              <div className="ob-legend-row"><span className="signal-bars" data-preview="1"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Never heard of it</div>
              <div className="ob-legend-row"><span className="signal-bars" data-preview="3"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Sounds familiar</div>
              <div className="ob-legend-row"><span className="signal-bars" data-preview="5"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Could teach it</div>
            </div>
          </div>
          <div className="ob-intro-actions">
            <button className="auth-btn auth-btn-large" id="landing-signin-btn">
              <svg className="auth-google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
            <button className="btn-guest-link" id="landing-guest-btn">Browse as guest (no progress saved)</button>
          </div>
        </div>
      </section>

      {/* ONBOARDING — only shown to signed-in users who haven't completed it */}
      <section id="screen-onboarding" className="screen">
        <div id="ob-intro-view" className="ob-intro">
          <div className="ob-intro-header">
            <div className="eyebrow">SystemFeed</div>
            <div id="ob-auth-container"></div>
          </div>
          <div className="ob-intro-content">
            <h1>Welcome! Let's personalise your feed.</h1>
            <p>First, rate how familiar you are with a few core concepts. Your feed will start on your weakest spots and grow from there as you improve.</p>
            <div className="signal-legend">
              <div className="ob-legend-row"><span className="signal-bars" data-preview="1"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Never heard of it</div>
              <div className="ob-legend-row"><span className="signal-bars" data-preview="3"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Sounds familiar</div>
              <div className="ob-legend-row"><span className="signal-bars" data-preview="5"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Could teach it</div>
            </div>
          </div>
          <div className="ob-intro-actions">
            <button className="btn btn-primary" id="ob-start-btn">Choose learning pathways →</button>
          </div>
        </div>

        <div id="ob-pathway-view" style={{ display: "none", flex: 1, flexDirection: "column", padding: "calc(20px + var(--safe-top)) 24px calc(24px + var(--safe-bottom))", overflowY: "auto" }}>
          <div className="eyebrow" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Learning Pathways</div>
          <h2 style={{ fontSize: "22px", marginTop: "6px" }}>Choose pathways to focus on</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "14px", margin: "8px 0 18px" }}>Select the topics you want in your feed. Fundamentals is included by default.</p>
          <div id="ob-pathways-list" className="pathways-grid"></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button className="btn btn-primary" id="ob-pathway-continue-btn">Start quiz →</button>
          </div>
        </div>

        {/* QUIZ VIEW — replaces old familiarity self-rating survey */}
        <div id="ob-quiz-view" style={{ display: "none", flex: 1, flexDirection: "column" }}>
          <div className="ob-header">
            <div className="ob-quiz-meta">
              <span className="tag-chip" id="quiz-step-label">Q 1 / 10</span>
              <span className="quiz-category-badge" id="quiz-category-badge">Fundamentals</span>
            </div>
            <div className="ob-progress-track">
              <div className="ob-progress-fill" id="quiz-progress-fill" style={{ width: "0%" }}></div>
            </div>
          </div>
          <div className="quiz-card-wrap">
            <div className="quiz-question" id="quiz-question-text"></div>
            <div className="quiz-options" id="quiz-options"></div>
            <div className="quiz-feedback" id="quiz-feedback"></div>
            <div className="ob-nav-row" style={{ marginTop: "16px" }}>
              <button className="btn btn-ghost" id="quiz-back-btn">Back</button>
              <button className="btn btn-primary" id="quiz-next-btn" disabled>Next →</button>
            </div>
          </div>
        </div>

        {/* QUIZ RESULTS VIEW */}
        <div id="ob-quiz-results-view" style={{ display: "none", flex: 1, flexDirection: "column" }}>
          <div className="ob-intro" style={{ justifyContent: "flex-start" }}>
            <div className="ob-intro-header">
              <div className="eyebrow">Quiz Complete</div>
              <div id="ob-auth-container-results"></div>
            </div>
            <div className="quiz-results-score" id="quiz-score-display"></div>
            <div className="quiz-results-breakdown" id="quiz-results-breakdown"></div>
            <div className="ob-intro-actions" style={{ marginTop: "24px" }}>
              <button className="btn btn-primary" id="quiz-finish-btn">Go to my feed →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEED */}
      <section id="screen-feed" className="screen">
        <div className="feed-topbar">
          <div className="brand">System<span>Feed</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div id="auth-container"></div>
            <div className="streak-pill" id="streak-pill">🔥 0 day streak</div>
          </div>
        </div>
        <div className="feed-scroll" id="feed-scroll"></div>
        <nav className="bottom-nav">
          <button className="nav-btn active" data-nav="feed"><span className="nav-dot"></span>Feed</button>
          <button className="nav-btn" data-nav="progress"><span className="nav-dot"></span>Progress</button>
        </nav>
      </section>

      {/* PROGRESS */}
      <section id="screen-progress" className="screen">
        <div className="progress-scroll" id="progress-scroll"></div>
        <nav className="bottom-nav">
          <button className="nav-btn" data-nav="feed"><span className="nav-dot"></span>Feed</button>
          <button className="nav-btn active" data-nav="progress"><span className="nav-dot"></span>Progress</button>
        </nav>
      </section>

      {/* GOAL MODAL */}
      <div className="modal-backdrop" id="goal-modal-backdrop">
        <div className="modal-sheet">
          <h3>Set a learning goal</h3>
          <div id="goal-modal-topics"></div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }} id="goal-modal-confirm" disabled>Add goal</button>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: "8px" }} id="goal-modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}
