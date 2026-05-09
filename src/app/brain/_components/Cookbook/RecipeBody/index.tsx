"use client";

import type { RecipeKey } from "@/app/brain/_data/recipeIndex";
import RecipeFrame from "@/app/brain/_components/cookbook-blocks/RecipeFrame";
import Step from "@/app/brain/_components/cookbook-blocks/Step";
import RecipeWorked from "@/app/brain/_components/cookbook-blocks/RecipeWorked";
import { P, Bullet, C } from "@/app/brain/_components/cookbook-blocks/textHelpers";
import Callout from "@/app/brain/_components/primitives/Callout";
import Card from "@/app/brain/_components/primitives/Card";
import CodeBlock from "@/app/brain/_components/primitives/CodeBlock";
import CmdLine from "@/app/brain/_components/primitives/CmdLine";
import ConfigFlow from "@/app/brain/_components/interactive/ConfigFlow";
import BootStates from "@/app/brain/_components/walkthrough-blocks/BootStates";
import MCPToolSurface from "@/app/brain/_components/walkthrough-blocks/MCPToolSurface";
import {
  ORIENT_GOOD_SAMPLE,
  CONFIG_SKELETON_SAMPLE,
} from "@/app/brain/_data/codeSamples";

interface RecipeBodyProps {
  recipeKey: RecipeKey;
}

/**
 * Switches on recipeKey to render one of 8 recipe bodies.
 * Must be a client component so it can compose <ConfigFlow/> (client) for
 * the 'flow' recipe and <CmdLine/> (client) for 'quickstart'.
 * Props: { recipeKey: RecipeKey } — no internal state.
 * Maps to JSX RecipeBody switch (lines 97–217).
 */
export default function RecipeBody({ recipeKey }: RecipeBodyProps) {
  if (recipeKey === "quickstart") {
    return (
      <RecipeFrame
        title="quickstart"
        sub="Wire the bundled Obsidian default in three commands. Total time: under two minutes if you already have a vault."
      >
        <Step n="1" what="install + scaffold">
          <CmdLine cmd="npx @aidemd-mcp/server@latest init" />
          <P>
            Creates <C>.aide/</C> and pre-fills <C>.aide/config/brain.aide</C>{" "}
            with the obsidian template. The args list lands with one{" "}
            <span className="text-[color:var(--color-warn)]">YAML null</span> —
            that&apos;s the vault path slot.
          </P>
        </Step>
        <Step n="2" what="wire the slot">
          <CmdLine cmd="/aide:brain config" />
          <P>
            Inside Claude Code. AIDE asks for your vault path, edits{" "}
            <C>brain.aide</C>, runs sync, and tells you to restart. Sync is what
            actually writes the brain entry into <C>.mcp.json</C>.
          </P>
        </Step>
        <Step n="3" what="restart, then seed">
          <P>
            After restart, run <C>/aide:brain config</C> a second time. This
            time the args list has a string, so the seeding flow runs — it
            presence-checks the four entry-point artifacts and writes any that
            are missing.
          </P>
        </Step>
        <Callout kind="success" className="mt-[18px]">
          <span className="text-[color:var(--color-good)]">✓</span> brain ready.
          boot reporter shows{" "}
          <span className="text-[color:var(--color-good)]">ok</span>; the
          orchestrator advances; <C>/aide</C> works.
        </Callout>
      </RecipeFrame>
    );
  }

  if (recipeKey === "flow") {
    return (
      <RecipeFrame
        title="the config flow"
        sub="One command, two paths. The path that runs is determined by what your args list contains — never by anything you pass."
      >
        <ConfigFlow />
      </RecipeFrame>
    );
  }

  if (recipeKey === "states") {
    return (
      <RecipeFrame
        title="boot states"
        sub="At session start the orchestrator reads brain.aide and .mcp.json and surfaces one of four states."
      >
        <BootStates />
      </RecipeFrame>
    );
  }

  if (recipeKey === "mcp") {
    return (
      <RecipeFrame
        title="mcp surface"
        sub="Your server defines its own tool names. AIDE never branches on names — it reads your orientation section to learn them. The shape below is what most brains end up exposing."
      >
        <Card>
          <MCPToolSurface />
        </Card>
      </RecipeFrame>
    );
  }

  if (recipeKey === "orient") {
    return (
      <RecipeFrame
        title="writing aide-orientation"
        sub="A runtime briefing returned verbatim by aide_brain. Agents read it before every brain-touching task. Keep it tight."
      >
        <P>Three jobs:</P>
        <Bullet>
          Name the MCP tools the agent should call (read, list, search, write).
        </Bullet>
        <Bullet>
          List the four entry-point artifacts and where they live.
        </Bullet>
        <Bullet>
          Set scope rules — &quot;stay inside this root&quot;, &quot;don&apos;t follow links into unrelated
          topics&quot;.
        </Bullet>
        <CodeBlock label="aide-orientation (good)" code={ORIENT_GOOD_SAMPLE} />
        <P style={{ marginTop: 14 }}>
          Things <em>not</em> to put here:
        </P>
        <Bullet>
          How to wire the brain (that&apos;s <C>aide-config</C>).
        </Bullet>
        <Bullet>
          The bytes for the entry-point artifacts (those are the seed sections).
        </Bullet>
        <Bullet>
          Domain knowledge or playbook content (lives inside the brain after seeding).
        </Bullet>
      </RecipeFrame>
    );
  }

  if (recipeKey === "configsec") {
    return (
      <RecipeFrame
        title="writing aide-config"
        sub="The script /aide:brain config executes verbatim. It branches on what the args list contains — never on what the user passed."
      >
        <P>Five required moves, in order:</P>
        <Bullet>
          Read <C>brain.aide</C> and quote the unwired-slot value(s) explicitly.
        </Bullet>
        <Bullet>
          Branch: any null → WIRING flow. All strings → SEEDING flow.
        </Bullet>
        <Bullet>
          WIRING: ask the user for missing values, edit <C>brain.aide</C>, run
          sync, STOP and emit a restart message.
        </Bullet>
        <Bullet>
          SEEDING: verify your MCP tools are loaded (else STOP), then for each
          entry-point artifact, presence-check and write-if-missing.
        </Bullet>
        <Bullet>
          Never fall back to native filesystem tools. Other backends have no
          local filesystem.
        </Bullet>
        <CodeBlock
          label="aide-config (skeleton)"
          code={CONFIG_SKELETON_SAMPLE}
        />
      </RecipeFrame>
    );
  }

  if (recipeKey === "fs") {
    return (
      <RecipeFrame
        title="recipe: filesystem brain"
        sub="A flat folder of markdown files, served over MCP. The simplest brain you can build — useful as a learning reference and for solo developers."
      >
        <RecipeWorked
          tools="mcp__brain__read_file · mcp__brain__list_dir · mcp__brain__write_file · mcp__brain__grep"
          slot="args[1] = absolute path to brain root folder"
          wiring="ask the user for the path. offer to mkdir if absent. write into args[1]. sync. STOP."
          seeding="for each artifact: list_dir its directory, then write_file if missing."
        />
      </RecipeFrame>
    );
  }

  if (recipeKey === "notion") {
    return (
      <RecipeFrame
        title="recipe: notion brain"
        sub="Two unwired slots: an integration token and a root page ID. Demonstrates how to handle multi-slot configs and non-file backing stores."
      >
        <RecipeWorked
          tools="mcp__brain__read_page · mcp__brain__list_children · mcp__brain__create_page · mcp__brain__search"
          slot="args[2] = integration token  ·  args[4] = root page ID"
          wiring="ask for token (link to https://www.notion.so/my-integrations) and root page ID. land both. sync. STOP."
          seeding="create coding-playbook + research as nested pages under the root, then create their entry-point pages with seed-section bytes as body."
        />
      </RecipeFrame>
    );
  }

  return null;
}
