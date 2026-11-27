# Design brief v2 — `/observer` page for AIDEMD.DEV

**For:** Claude Design. Run it in the project that already holds the AIDEMD.DEV prototypes (`Terminal.html`, `docs.html`, `brain.html`) so the new page shares their look.
**Return:** a handoff in the same shape as the `/brain` one — HTML prototype, JSX, and a `handoff.md` saying what to ship. Show **two variants side by side** on a design canvas (§6).

**Why v2:** the first attempt (a long linear explainer plus a stylised live mock) didn't land. This version is rebuilt from research in the brain:
- `research/devtool-feature-pages/2026-11-25-observability-feature-page-structure.md` (7.7, trusted)
- `research/devtool-feature-pages/2026-11-25-status-and-state-visual-design.md` (7.7, trusted)
- `research/devtool-feature-pages/2026-11-25-feature-page-messaging.md` (8.4, trusted)
- `research/seo-aeo/2026-11-25-agentic-sdlc-target-queries-and-competitors.md` (7.9, trusted)

**Copy rule:** every word on this page comes from research or from the founder. Lines marked **DRAFT — founder edits** are built only from research quotes and confirmed observer facts, and the founder rewrites them before the page ships. Don't invent new copy; where a section has no wording here, use a clearly marked placeholder.

---

## 1. Page shape

- **Product first, problem inside the hero.** Comparable pages lead with the product and fold a one-line pain into the hero, instead of opening with a problem section.
- **Short: about 500–1,000 words in total.** At that length it reads as a feature page, not a docs page. Deep mechanics and reference live in the Hooks docs section, linked from here.
- **Show the real UI on the first or second screen.** In the research, captures of the real product beat abstract or stylised stand-ins. Design around the **staged captures of the real observer in the site theme**: `assets/observer-capture-aidemd*.png`. They show the real components and demo data, restyled with the site's colours, font and radii through `assets/observer-aidemd-theme.css`. Use these and add no caption. The `observer-capture*.png` files without `-aidemd` are the app's own theme, kept for reference only. They are demo projects only, real UI:
  - `observer-capture-aidemd.png` / `@2x`: the hero. Home view with four projects. billing-service is *Waiting on you* at Plan approval. acme-api is *Working* at Build step 3 of 6, with the rail part done. mobile-app is *Quiet 25 min · maybe stuck* in QA. docs-site is an ended, collapsed row. The "1 waiting" button is visible.
  - `observer-capture-aidemd-rail.png` / `@2x`: a close-up of one pipeline rail.
  - `observer-capture-aidemd-session.png`: one session's page, with the running-phase banner and the rail along the bottom. Its footer rail clips the last "Done" chip; crop it or prefer the hero.

  A static image or short loop beats an interactive mock. Use the captures as they are; don't redraw them.
- **What the real UI does not show,** so the page must not imply it does:
  - **HALT and BLOCKED** are replies the agent gets at session start, not screens in the observer. Show them as a short terminal/agent-reply snippet next to the "one open session per project" section, not inside the capture.
  - **Ended sessions** leave the live list on Home, where they appear only as a collapsed row.
- **Name: "the observer"** (founder decision). The page calls it the observer everywhere. The capture's header still reads "AIDE Pipeline Viewer"; leave it as captured and don't repeat that name in the page copy.
- **One concrete action in the hero, repeated at the bottom:** how to get it (install AIDE; the observer starts with `/aide`) and the local address.

## 2. Positioning — what to lead with (founder-approved)

Anthropic's own `claude agents` view already shows working / needs input / completed and sends notifications. Opening with that three-state line would read as a duplicate. So the hero leads with what that view doesn't have:
- **the pipeline rail:** which phase each session is in (spec, plan, build, QA, fix…), with gates, plan steps and QA verdicts;
- **one open session per project:** HALT and BLOCKED stop two agents colliding in the same project;
- **one local web view across every project on the machine.**

The three states come after, as supporting detail.

## 3. Confirmed facts (founder-verified — state them plainly)

- Local and read-only. Serves on `127.0.0.1` behind an access token. One observer per user per machine, covering every project.
- No telemetry and no account. MIT licensed, open source.
- Works on Windows, macOS and Linux (most comparable monitors are macOS or tmux only).
- Hooks are for Claude Code. AIDE's install and upgrade wire them in, so there is no extra config.
- No desktop notifications: you see "waiting" on the page; it doesn't ping you. Don't imply otherwise.
- Hooks: `aidemd-mcp hook` runs on SessionStart, UserPromptSubmit, PostToolUse (→ working), Stop (→ waiting), SessionEnd (→ ended). They print nothing and never fail or block the agent.
- A session quiet for more than 15 minutes is marked "maybe stuck". It is never ended for being quiet.
- Port: `AIDE_OBSERVER_PORT` if set, else the first free port in 24680–24689. Data root: `AIDEMD_HOME` if set, else `%USERPROFILE%\.aidemd` (Windows), `~/Library/Application Support/aidemd` (macOS), `~/.local/state/aidemd` (Linux).

## 4. Sections, in order — the job each does and what research says it should say

1. **Hero.**
   - *Job:* name the thing and what it answers, in one line.
   - *Say:* per §2, lead with the pipeline rail, the per-project control and the single local view across projects. The subhead carries "local, read-only" as short phrases.
   - *Heading words:* "monitor … sessions" and "see what … is doing" match what developers search; avoid "dashboard".
   - *Visual:* the capture.
2. **Problem.**
   - *Job:* one to three sentences naming the multi-session situation in the developer's own voice.
   - **DRAFT — founder edits**, built from research quotes: several agent sessions open at once, and no way to tell which one is blocked waiting for you, or whether two of them are working in the same project.
3. **The pipeline rail.**
   - *Job:* show that each session reports where it is in the work: phases, gates, plan steps, QA.
   - *Pattern:* step-level visibility, as LangSmith and AgentOps phrase it. Don't claim replay or rewind.
4. **One open session per project.**
   - *Job:* explain HALT, BLOCKED and end session in a few lines. No comparable page has wording for this, so it is founder copy.
   - **DRAFT — founder edits**, built from facts: before an agent starts, the observer checks whether another session is open in that project. If one is, it stops with HALT and names that session, what it was doing and how long it's been quiet; you choose to end it or close the new one. Ending only marks a session ended; nothing is deleted. If the observer can't start, BLOCKED stops the session, so nothing runs unobserved.
5. **Working, waiting, ended.**
   - *Job:* one line per state so readers can map it to their own situation.
   - *Pattern:* "needs your input" / "waiting on something only you can provide". Use "waiting for you", which matches the "waiting for input" searches.
   - The meanings come from the founder; use the confirmed facts in §3 as the basis and mark them DRAFT.
6. **How it knows.**
   - *Job:* two sentences on the signal source: the hooks on the five events (§3), wired in by AIDE.
   - *Pattern:* hooks give real-time signals that watching session files can't.
7. **Maybe stuck.**
   - *Job:* two sentences: quiet for 15 minutes → "maybe stuck", hedged because quiet isn't proof of a crash. State the 15 minutes explicitly; every comparable tool uses 10, so don't imply 15 is standard.
   - Avoid "stuck" as a heading word; searches for it are about agents hanging.
8. **Local and private.**
   - *Job:* answer "does my data leave my machine?" and "can it change anything?" in three short sentences, from §3.
9. **Setup.**
   - *Job:* the facts needed to open it: port and data root, plus a link to the **Hooks** docs section for the full reference.
10. **Closing action.** The same action as the hero.

## 5. States — visual system (from the status-design research)

> **Settled:** the captures are in the site theme, so any state legend or callout on the page uses the **same values as `assets/observer-aidemd-theme.css`**:
> - working/done green `#6aaa7c` for text and icons, with `#3d6b4a` for fills only;
> - waiting amber `#d6b25a`;
> - danger `#ff5f56`;
> - text `#e8dfce` / `#aba497` / `#948e82`;
> - surfaces `#0d0b08` / `#16120d` / `#231e19`.
>
> All text pairs measure at least 4.5:1. The founder confirmed that the lightened green `#6aaa7c` counts as the site green for text, not as "a second green". The table below is the research's shape-and-label guidance; take its colours from the theme file above.

Shape and label guidance (from the research):

| State | Colour | Shape | Label |
|---|---|---|---|
| working | the site's green, lightened for text and icons; brand `#3d6b4a` for fills only | filled dot, slow pulse (off under reduced motion) | working |
| waiting | grey | hollow ring | waiting for you |
| ended | dim grey | check | ended + time |
| HALT | red | stop shape | HALT |
| BLOCKED | amber | triangle | BLOCKED |
| maybe stuck | amber outline | hollow triangle, no spinner | maybe stuck · quiet 15m |
| rail phase: done / current / pending | grey ✓ / green dot / dim ring | as listed | phase name |

Rules:
- Never use colour alone; every state has a shape and a word.
- Green means live, nothing else.
- One warning colour.
- Finished states don't move.
- Four colours in total, scoped to this page. Forest green stays the site's only accent everywhere else.

## 6. Variants

- **Variant A — Capture-led stack:** the capture full-width under a short hero. Sections 2–10 follow as compact blocks, with the state legend (§5) set beside the capture.
- **Variant B — Annotated capture:** hero copy beside the capture. Numbered callouts on the capture (rail, HALT, a waiting session, maybe stuck) link to sections 3–7, so the explanation is anchored to the real UI.

Both variants:
- stay within about 500–1,000 words;
- add `observer` to the top nav (`docs · brain · observer · github ↗ · npm ↗`, proposed) and show the mobile treatment;
- use a 1280 design width, responsive to mobile;
- say in `handoff.md` whether they need client-side JS and what for.

## 7. Out of scope

- The Hooks docs content itself: it ships from the `@aidemd-mcp/server` package as its own docs section after Skills. Only link to it.
- The landing page and the docs pages, apart from the nav entry.
