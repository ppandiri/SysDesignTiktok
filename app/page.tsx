import React from "react";

export default function Home() {
  return (
    <div id="app">
      {/* ONBOARDING */}
      <section id="screen-onboarding" className="screen active">
        <div id="ob-intro-view" className="ob-intro">
          <div className="eyebrow">SystemFeed</div>
          <h1>Learn system design the way you scroll everything else.</h1>
          <p>First, rate how familiar you are with a few core concepts. Your feed will start on your weakest spots and grow from there as you improve.</p>
          <div className="signal-legend">
            <div className="ob-legend-row"><span className="signal-bars" data-preview="1"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Never heard of it</div>
            <div className="ob-legend-row"><span className="signal-bars" data-preview="3"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Sounds familiar</div>
            <div className="ob-legend-row"><span className="signal-bars" data-preview="5"><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span><span className="bar"></span></span> Could teach it</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "30px" }}>
            <button className="btn btn-primary" id="ob-start-btn">Choose learning pathways →</button>
            <button className="btn btn-ghost" id="ob-skip-btn">Skip to Feed →</button>
          </div>
        </div>

        <div id="ob-pathway-view" style={{ display: "none", flex: 1, flexDirection: "column", padding: "24px 24px calc(24px + var(--safe-bottom))", overflowY: "auto" }}>
          <div className="eyebrow">Learning Pathways</div>
          <h2 style={{ fontSize: "22px", marginTop: "6px" }}>Choose pathways to focus on</h2>
          <p style={{ color: "var(--text-dim)", fontSize: "14px", margin: "8px 0 18px" }}>Select the topics you want in your feed. Fundamentals is included by default.</p>
          
          <div id="ob-pathways-list" className="pathways-grid">
            {/* injected dynamically */}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <button className="btn btn-primary" id="ob-pathway-continue-btn">Rate topic familiarity →</button>
            <button className="btn btn-ghost" id="ob-pathway-skip-btn">Skip to Feed →</button>
          </div>
        </div>

        <div id="ob-survey-view" style={{ display: "none", flex: 1, flexDirection: "column" }}>
          <div className="ob-header">
            <div className="tag-chip" id="ob-step-label">TOPIC 1 / 16</div>
            <div className="ob-progress-track"><div className="ob-progress-fill" id="ob-progress-fill" style={{ width: "0%" }}></div></div>
          </div>
          <div className="ob-card-wrap">
            <div className="ob-topic-card" id="ob-topic-card">
              {/* injected */}
            </div>
            <div className="ob-nav-row">
              <button className="btn btn-ghost" id="ob-back-btn">Back</button>
              <button className="btn btn-primary" id="ob-next-btn" disabled>Next</button>
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
        <div className="progress-scroll" id="progress-scroll">
          {/* injected */}
        </div>
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
