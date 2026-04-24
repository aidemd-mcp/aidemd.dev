import type { IntentNode } from '@/types/intentTree';

/**
 * Verbatim port from design_handoff_aidemd_site/prototypes/shared.jsx lines 68-158.
 * INTENT_TREE is the .aide/ root; SRC_TREE is the src/ tree.
 * Exported as a 2-element tuple consumed by the IntentTree marketing section.
 */
const INTENT_TREE: IntentNode = {
  name: '.aide/',
  kind: 'dir',
  note: 'project root — top of the intent tree',
  children: [
    {
      name: 'intent.aide',
      kind: 'intent',
      note: 'project-level contract every child inherits',
      preview: {
        scope: '.',
        intent: 'Generate personalized retention emails for lapsed customers that feel hand-written, not templated.',
        desired: ['Opening references a specific past purchase', 'Body under 80 words', 'CTA is a single link, not a button array'],
        undesired: ['Generic "we miss you" openers', 'Emojis in subject line', 'Mentions of discount % the customer did not earn'],
      },
    },
  ],
};

const SRC_TREE: IntentNode = {
  name: 'src/',
  kind: 'dir',
  children: [
    {
      name: '.aide',
      kind: 'intent',
      note: 'src-level intent — narrows project root',
      preview: {
        scope: 'src/',
        intent: 'Orchestrate the email pipeline: segment audience, draft, personalize, send.',
        desired: ['Every send is traceable to a segment', 'Personalization fields resolved before send'],
        undesired: ['Sends to unsegmented users', 'Template placeholders reaching production'],
      },
    },
    {
      name: 'service/',
      kind: 'dir',
      children: [
        {
          name: 'retention/',
          kind: 'dir',
          children: [
            {
              name: '.aide',
              kind: 'intent',
              note: 'feature strategy — retention emails',
              preview: {
                scope: 'src/service/retention',
                intent: 'Bring lapsed customers back by referencing something they actually did.',
                desired: ['Reference is factual, drawn from order history', 'Tone matches brand voice (warm, not desperate)'],
                undesired: ['Fabricated references to purchases that never happened', 'Guilt-trip language'],
              },
            },
            { name: 'plan.aide', kind: 'plan', note: 'architect plan, approved 2d ago' },
            { name: 'todo.aide', kind: 'todo', note: '2 open items from last QA loop' },
            { name: 'index.ts', kind: 'code', note: 'orchestrator — retention pipeline' },
            {
              name: 'draftOpener/',
              kind: 'dir',
              children: [
                {
                  name: '.aide',
                  kind: 'intent',
                  note: 'sub-spec — opener strategy',
                  preview: {
                    scope: 'src/service/retention/draftOpener',
                    intent: 'Write an opener that names the specific past purchase without sounding like a receipt.',
                    desired: ['First sentence names the product category, not SKU', 'Under 20 words'],
                    undesired: ['"We noticed you bought…" — surveillance tone', 'Listing multiple items'],
                  },
                },
                { name: 'index.ts', kind: 'code', note: 'orchestrator' },
                {
                  name: 'extractSignal/',
                  kind: 'dir',
                  children: [
                    { name: 'index.ts', kind: 'code', note: 'helper — no .aide (self-explanatory)' },
                  ],
                },
                {
                  name: 'phraseOpener/',
                  kind: 'dir',
                  children: [
                    { name: 'index.ts', kind: 'code', note: 'helper — no .aide' },
                  ],
                },
              ],
            },
            {
              name: 'personalize/',
              kind: 'dir',
              children: [
                { name: '.aide', kind: 'intent', note: 'sub-spec — personalization' },
                { name: 'index.ts', kind: 'code' },
              ],
            },
            {
              name: 'sendEmail/',
              kind: 'dir',
              children: [
                { name: 'index.ts', kind: 'code', note: 'helper — no .aide (single-purpose)' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const INTENT_TREE_ROOTS: readonly [IntentNode, IntentNode] = [INTENT_TREE, SRC_TREE];
