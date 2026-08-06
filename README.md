# SystemFeed

A TikTok-style, swipeable feed for learning system design — built as a plain static site (HTML/CSS/JS, no build step, no backend). Content is inspired by the kind of material you'd find in the System Design Primer, ByteByteGo, and Hello Interview, but every explanation, question, and answer here is written from scratch for this app.

## How it works

- **Onboarding**: rate your familiarity (1–5, shown as signal bars) with 16 core system design topics.
- **Adaptive feed**: swipe vertically through concept cards, flashcards, multiple-choice questions, and true/false questions. The algorithm weights topics you rated low much more heavily, and rebalances toward other topics as your familiarity score on a topic climbs (tracked from how you answer questions).
- **Progress tab**: overall mastery %, accuracy, streak, a weakest → strongest topic breakdown, and a place to set learning goals (e.g. "get Caching to 80%").
- All progress is stored in the browser's `localStorage` — there's no server or database. Clearing site data / using a different browser resets progress.

## Project structure

```
index.html          — app shell (onboarding / feed / progress screens)
css/style.css        — all styling and design tokens
js/data.js           — the 16 topics + ~65 content cards
js/storage.js        — localStorage read/write helpers
js/algorithm.js       — adaptive card-selection logic
js/app.js            — rendering + event wiring
```

## Run it locally

No install needed — it's static files. From this folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

or with Node:

```bash
npx serve .
```

## Deploy to Vercel

**Option A — Vercel CLI (fastest):**
```bash
npm i -g vercel   # if you don't have it
cd sysdesign-tok
vercel            # follow prompts, accept defaults (it will detect a static site)
vercel --prod     # promote to production
```

**Option B — GitHub + Vercel dashboard:**
1. Push this folder to a new GitHub repo.
2. Go to vercel.com → **Add New… → Project** → import the repo.
3. Framework preset: **Other** (no build command needed, output directory is the repo root).
4. Deploy.

Either way, Vercel serves the files as-is — there's nothing to build.

## Extending it

- **Add topics/cards**: edit `js/data.js`. Every topic needs at least one `concept` card and at least one question card (`mc`, `tf`, or `flashcard`) or the algorithm will fall back to whatever exists.
- **Tune the algorithm**: `js/algorithm.js` — `topicWeight()` controls how strongly weak topics are favored, and `pickCardForTopic()` controls the concept-vs-question mix and the "question every ~N cards" pacing.
- **Add real accounts/sync**: right now everything is local-only. To sync across devices you'd swap `js/storage.js` for calls to a backend (e.g. a small API route + database) instead of `localStorage`.
