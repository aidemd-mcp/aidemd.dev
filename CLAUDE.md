<!-- aide-methodology -->
## AIDE — Autonomous Intent-Driven Engineering

This project uses the AIDE methodology. AIDE treats a short `.aide` intent
spec living next to orchestrator code as the contract every downstream
agent (architect, implementor, QA) works from — when the intent changes,
the code changes.

The full canonical methodology is installed in this project at
`.aide/docs/`. Start at `.aide/docs/index.md` for the doc list, then
crawl into the specific canonical doc your current task requires. Read
only what the task actually needs — the doc directory is organized for
progressive disclosure, not for front-loading.

**Before writing, editing, or acting on any `.aide` file, crawl the doc directory
and read the canonical doc that governs the work you are about to do.**
Never guess AIDE rules from memory: the files under `.aide/docs/` are
the authoritative source, and any decision that disagrees with them is
wrong by definition.

**AIDE tools quick-reference:**
- `aide_discover` — map where `.aide` specs live in the project
- `aide_read` — read a specific `.aide` file with context
- `aide_scaffold` — create a new `.aide` file
- `aide_validate` — check spec layout for drift or issues
- `aide_init` — bootstrap AIDE into a new project (first-time setup)
- `aide_upgrade` — update/sync/refresh AIDE docs, commands, agents, and skills to the latest canonical versions (use this when asked to "update AIDE", "update the docs", or "sync the methodology")

**Invoking `/aide` and `/aide:*`:** when the user invokes any AIDE slash command, your **first action** must be to invoke the matching skill via the `Skill` tool — for `/aide`, that is `Skill(skill="aide", args=...)`. The slash-command file at `.claude/commands/aide.md` is a thin signpost; the orchestrator prose and the **MANDATORY BOOT SEQUENCE** live in the `aide` skill (`.claude/skills/aide/SKILL.md`). Do NOT attempt to handle the request from the command file alone, do NOT skip the skill, and do NOT respond to the user's request before the boot sequence completes — skipping boot means orchestrating a methodology you don't know.

<!-- aide-methodology -->
