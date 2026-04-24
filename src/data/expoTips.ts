import type { ExpoTip, SectionId } from '@/types/expo';

/**
 * Tips for the Expo mascot, keyed by SectionId.
 *
 * ## Source verification
 * Entries for hero, threeLayerModel, vaultBrain, intentTree, quickstart are ported
 * VERBATIM from design_handoff_aidemd_site/prototypes/aidey.jsx `AIDEY_TIPS_DEFAULT`
 * (lines 5-10), with `s/AIDEY/Expo/g` applied to all title/body strings.
 *
 * ## Pose rename: read → think
 * The source uses `pose: 'read'` for the vaultBrain tip. The `ExpoPose` type only
 * allows `'teach' | 'think' | 'wave' | 'point'` — `'read'` is not a valid value.
 * The public/ asset for this pose is `expo-think.png` (copied from `aidey-read.png`
 * in step 3b). Therefore the vaultBrain tip's pose is encoded as `'think'` here to
 * match both the type constraint and the asset filename.
 *
 * ## Authored tips
 * The remaining 5 entries (pipeline, cliDemo, comparison, footer, docs) are authored
 * to cover all 10 SectionIds. Tone: all-lowercase titles, second person, 1-2
 * sentences, engineering-credible. Pose rules: `point` directs attention to on-screen
 * elements; `teach` explains; `wave` greets/signs off; `think` reflects/conceptual.
 */
export const EXPO_TIPS: Readonly<Record<SectionId, ExpoTip>> = {
  // ── ported VERBATIM from AIDEY_TIPS_DEFAULT (s/AIDEY/Expo/g) ──────────────

  hero: {
    pose: 'wave',
    title: "hey — i'm Expo",
    body: 'your domain expert. i walk you through how intent becomes code, one stage at a time. click the pipeline stages or open any node in the intent tree.',
  },

  threeLayerModel: {
    pose: 'teach',
    title: 'the .aide is the contract',
    body: "scope, intent, outcomes.desired, outcomes.undesired. if it doesn't serve the intent, it gets cut.",
  },

  vaultBrain: {
    // Source pose was 'read'. Renamed to 'think' — see JSDoc above (step 3b maps
    // aidey-read.png → expo-think.png; ExpoPose excludes 'read').
    pose: 'think',
    title: 'the brain holds durable knowledge',
    body: 'domain research + your coding playbook live in an Obsidian vault. fill it once, reuse it across every project.',
  },

  intentTree: {
    pose: 'teach',
    title: 'intent cascades',
    body: "every child .aide inherits its parent. you never restate context — you narrow it.",
  },

  quickstart: {
    pose: 'wave',
    title: "that's it!",
    body: 'ready to install? scroll down for the one-liner.',
  },

  // ── authored for remaining sections ───────────────────────────────────────

  pipeline: {
    pose: 'point',
    title: 'six agents, one pipeline',
    body: 'each stage has a single job. click a stage to see exactly what it reads, what it writes, and why.',
  },

  cliDemo: {
    pose: 'point',
    title: 'watch it run',
    body: 'one command bootstraps the whole methodology. the terminal below plays through a real AIDE session — hit pause to read any step.',
  },

  comparison: {
    pose: 'think',
    title: 'heavier on opinion, lighter on you',
    body: 'AIDE front-loads the structure so agents can run without hand-holding. the tradeoff is intentional.',
  },

  footer: {
    pose: 'wave',
    title: 'see you in the repo',
    body: 'the methodology is open. the server is on npm. everything else is in the docs.',
  },

  docs: {
    pose: 'teach',
    title: 'the docs are the canonical reference',
    body: 'every spec format, agent contract, and workflow rule lives here. when in doubt, the docs win.',
  },
};
