# Phase 3 — The Bonsai

> Estimated: 2–3 weeks
> Goal: KP tracking, bonsai visualization, titles, categories, seasons, feature unlocks, and reward moments. The bonsai grows.
> Depends on: Phase 2 complete

---

## Tasks

### 3.1 — KP Tracking API

Knowledge Points calculation and recording.

**Tasks:**
- [ ] `POST /api/progress/kp` — record reading/listening session
- [ ] KP calculator service:
  - Reading: 1 KP/page (primary genre), 0.5 KP/page (secondary)
  - Listening: 1 KP/minute (primary), 0.5 KP/minute (secondary)
  - Completion bonus: +20% of total book KP when ≥90% complete
- [ ] Anti-gaming:
  - Idle detection: reject sessions where `sessionSeconds` is unreasonable for `amount`
  - Speed cap: max 2x rate (e.g., 2 KP/page maximum)
  - Session cap: 500 KP/book/day
- [ ] `kp_events` table — log every KP event with source, amount, multiplier
- [ ] `user_progress` table — running totals (total KP, books completed, hours)
- [ ] `category_progress` table — KP per category
- [ ] `POST /api/progress/complete` — mark book as completed, award bonus
- [ ] `GET /api/progress` — full progress overview
- [ ] `GET /api/progress/calendar` — daily reading activity (KP, minutes, books)
- [ ] `GET /api/progress/history` — recent KP events (activity feed)

**Acceptance criteria:**
- [ ] KP calculates correctly for reading and listening
- [ ] Primary/secondary genre multiplier works
- [ ] Completion bonus awards correctly
- [ ] Anti-gaming measures prevent unreasonable KP
- [ ] Running totals accurate
- [ ] Category breakdown accurate

---

### 3.2 — Title System

Japanese titles earned through KP milestones.

**Tasks:**
- [ ] Title ladder definition (shared constant):
  ```
  0      → 初心 Shoshin (Beginner's mind)
  500    → 読者 Dokusha (Reader)
  2,000  → 学生 Gakusei (Student)
  5,000  → 書生 Shosei (Scholar-student)
  12,000 → 学者 Gakusha (Scholar)
  25,000 → 先生 Sensei (Teacher)
  50,000 → 賢者 Kenja (Sage)
  100,000 → 仙人 Sennin (Hermit-sage)
  200,000 → 道 Michi (The Path)
  ```
- [ ] Title check on every KP event — if threshold crossed, update `user_progress.current_title`
- [ ] KP response includes `titleChanged: boolean` and `newTitle`
- [ ] Client shows subtle toast on title change: "学者 Gakusha · Scholar"

**Acceptance criteria:**
- [ ] Titles advance correctly at each threshold
- [ ] Title change notification is subtle (toast, not modal)
- [ ] Current title displayed on home page and bonsai page
- [ ] Next title and KP remaining shown on bonsai page

---

### 3.3 — Feature Unlocks

Features unlocked at KP milestones.

**Tasks:**
- [ ] `unlocks` table — tracks which features are unlocked per user
- [ ] `GET /api/unlocks` — list unlocked features
- [ ] Unlock check on every KP event:
  - First book completed → Reading statistics
  - 500 KP → Bonsai starts growing beyond sprout
  - 1,000 KP → Reader font presets
  - 2,000 KP → Reading calendar
  - 5,000 KP → Seasonal reflections (journal)
  - 10,000 KP → Bonsai export (PNG/SVG)
  - 25,000 KP → Custom font upload for reader
- [ ] Client: check unlocks before showing locked features
- [ ] Unlock notification: "Reading calendar is now available"
- [ ] Locked features show a subtle hint: "Unlock at 2,000 KP"

**Acceptance criteria:**
- [ ] Features hidden until unlocked
- [ ] Unlock notification shown once
- [ ] Locked state shows requirement without being annoying
- [ ] Unlocks persist correctly

---

### 3.4 — Progress Store & Integration

Connect KP tracking to existing reader and player.

**Tasks:**
- [ ] Progress store (`src/lib/stores/progress.ts`)
- [ ] Integrate KP recording into player store — POST every 60 seconds during playback
- [ ] Integrate KP recording into reader — POST on page turn (throttled, every 30 seconds)
- [ ] Completion detection — when ABS progress reaches ≥90%, call complete endpoint
- [ ] Update home page with KP badge and current title
- [ ] Activity feed on home page — recent KP events

**Acceptance criteria:**
- [ ] KP accumulates during reading and listening
- [ ] Progress store reflects accurate totals
- [ ] Home page shows KP and title
- [ ] Activity feed shows recent reading activity

---

### 3.5 — Bonsai Visualization

The generative SVG bonsai tree. *(Spec the algorithm during this phase — see notes below.)*

**Tasks:**
- [ ] Design the bonsai generation algorithm (L-system or procedural)
- [ ] `BonsaiRenderer.svelte` — SVG rendering of the bonsai
- [ ] Growth stages (seed → sprout → sapling → ... → grand bonsai)
- [ ] Genre influence on branch patterns:
  - Fiction/Stories → flowing, curved
  - Technology/Craft → angular, geometric
  - Philosophy/Mind → spiral, inward
  - Finance/Wealth → structured, symmetrical
  - Self → upward-reaching
  - History/World → thick, gnarled
  - Art → asymmetric, expressive
- [ ] Seasonal appearance based on real-world time:
  - Spring → cherry blossoms (pink)
  - Summer → full green canopy
  - Autumn → red/orange/gold leaves
  - Winter → bare branches, snow
- [ ] Subtle breathing animation (scale 1.0 ↔ 1.005, 4s cycle)
- [ ] Growth animation when returning from reading (bonsai updates)
- [ ] Bonsai state stored in `bonsai` table (seed + stage + branch_params)
- [ ] Deterministic: same seed + params always produces same tree
- [ ] `GET /api/bonsai` — return bonsai state
- [ ] `GET /api/bonsai/snapshot` — export as SVG (unlocked at 10,000 KP)

**Acceptance criteria:**
- [ ] Bonsai renders as SVG, centered on page
- [ ] Visually grows with more KP (more branches, denser canopy, thicker trunk)
- [ ] Genre influence visible at higher growth stages
- [ ] Seasonal appearance matches real-world season
- [ ] Each user's tree looks unique (different seed)
- [ ] Breathing animation is subtle and calming
- [ ] Renders correctly in all three themes
- [ ] Export works (SVG and PNG)

---

### 3.6 — Bonsai Page

Full contemplative page for the bonsai.

**Tasks:**
- [ ] Bonsai page (`/bonsai`)
- [ ] Bonsai visualization — large, centered, ~50% of viewport
- [ ] KP counter — large display font, current title in Japanese + English
- [ ] Stats row — books completed, total hours, current season/day
- [ ] Next milestone — progress bar to next title
- [ ] Category chart — donut/radial showing KP distribution
- [ ] Recent activity — last 5 KP events
- [ ] Tablet layout — bonsai large top, stats grid below

**Acceptance criteria:**
- [ ] Bonsai is the visual centerpiece
- [ ] Stats displayed quietly below
- [ ] Category chart is clear and readable
- [ ] Page feels contemplative, not cluttered
- [ ] Works in all three themes

---

### 3.7 — Seasons

90-day reading cycles.

**Tasks:**
- [ ] Season creation — auto-created on first KP event, rolls over every 90 days
- [ ] `GET /api/seasons` — list all seasons
- [ ] `GET /api/seasons/current` — current season details
- [ ] `PATCH /api/seasons/:id` — update reflection text
- [ ] Season end: automatically create snapshot (bonsai SVG, stats)
- [ ] Season summary card — books, KP, hours, bonsai snapshot, reflection
- [ ] Past seasons browsable on bonsai page or profile
- [ ] Reflection prompt on season end: "What did you learn this season?"

**Acceptance criteria:**
- [ ] Seasons auto-create and roll over
- [ ] Current season visible on bonsai page
- [ ] Reflections save and persist
- [ ] Bonsai snapshot preserved for each season
- [ ] Past seasons browsable

---

### 3.8 — Reading Calendar

Visual calendar of reading activity (unlocked at 2,000 KP).

**Tasks:**
- [ ] `ReadingCalendar.svelte` — month view, each day colored by reading intensity
- [ ] Color scale: no reading (empty) → light → medium → dark accent
- [ ] Tooltip on day: "42 KP · 35 min · Psychology of Money"
- [ ] Month navigation (prev/next)
- [ ] Displayed on bonsai page or profile section

**Acceptance criteria:**
- [ ] Calendar shows correct activity per day
- [ ] Intensity gradient is clear and readable
- [ ] Navigation works
- [ ] Hidden until 2,000 KP unlock

---

### 3.9 — Reward Moments

Quiet celebrations for achievements.

**Tasks:**
- [ ] Book completed: gentle full-screen moment — cover image, KP earned, bonsai growth preview, optional reflection prompt: "What will you carry from this book?"
- [ ] Title earned: subtle toast with kanji + romanji + English
- [ ] Feature unlocked: notification with feature name
- [ ] Season milestone (50th book, 100th hour): brief poetic message
- [ ] All moments use theme-appropriate styling
- [ ] All moments dismissable immediately

**Acceptance criteria:**
- [ ] Celebrations feel quiet and proud, not loud
- [ ] Easily dismissable — never blocking
- [ ] Theme-appropriate visuals
- [ ] Reflection prompts are optional (can skip)

---

## Algorithm Note

The bonsai generation algorithm will be specified in detail during this phase, not before.
This is a deliberate decision — the algorithm needs to be prototyped interactively,
not designed in a document. Start with a simple L-system, iterate visually.

A separate `FUMIKI_BONSAI.md` document will be created during Phase 3 to capture
the final algorithm, parameters, and rendering details.

---

## Definition of Done

After Phase 3, the app:
- Tracks KP for every reading/listening session
- Awards titles at milestones with quiet celebrations
- Grows a unique bonsai shaped by reading habits
- Shows category distribution across 7 knowledge areas
- Runs 90-day seasons with reflections and bonsai snapshots
- Displays a reading calendar (color-coded by intensity)
- Unlocks features progressively
- Book completion has a contemplative moment
- All features work in all three themes

---

*Next: Phase 4 — Offline & Polish*
