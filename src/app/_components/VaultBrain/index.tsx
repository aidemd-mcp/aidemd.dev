"use client";

import { useState } from "react";
import { VAULT_NOTES } from "@/data/vaultNotes";
import type { VaultTab } from "@/types/vault";
import TabButton from "./TabButton";
import NoteCard from "./NoteCard";

/**
 * §04 the brain — vault explorer with research/playbook tab switcher.
 * Left: YOUR VAULT label + 2 tabs + filename list.
 * Right: description + NoteCards for active tab.
 */
export default function VaultBrain() {
  const [activeTab, setActiveTab] = useState<VaultTab>("research");
  const files = VAULT_NOTES[activeTab];

  const description =
    activeTab === "research"
      ? "Domain notes — read by the strategist when filling Strategy."
      : "Convention notes — read by the architect and implementor.";

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[260px_1fr] overflow-hidden"
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        background: "var(--color-card)",
      }}
    >
      {/* Left sidebar */}
      <div
        className="bg-[color:var(--color-bg)] border-b md:border-b-0 md:border-r border-[color:var(--color-border)]"
        style={{ padding: "14px 0" }}
      >
        <div
          className="font-mono text-[11px] text-[color:var(--color-dim)] uppercase"
          style={{ padding: "0 16px 12px", letterSpacing: "1.5px" }}
        >
          YOUR VAULT
        </div>
        <div className="flex gap-[4px] px-[12px] pb-[10px]">
          <TabButton
            label="research"
            isActive={activeTab === "research"}
            onSelect={() => setActiveTab("research")}
          />
          <TabButton
            label="playbook"
            isActive={activeTab === "playbook"}
            onSelect={() => setActiveTab("playbook")}
          />
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {files.map((file) => (
            <li
              key={file.path}
              className="font-mono text-[12px] text-[color:var(--color-fg)]"
              style={{ padding: "8px 16px" }}
            >
              {file.path.split("/").pop()}
            </li>
          ))}
        </ul>
      </div>

      {/* Right content */}
      <div className="p-[20px_24px]">
        <div className="font-mono text-[12px] text-[color:var(--color-dim)] mb-[14px]">
          {description}
        </div>
        <div className="flex flex-col gap-[10px]">
          {files.map((file) => (
            <NoteCard key={file.path} path={file.path} preview={file.preview} />
          ))}
        </div>
      </div>
    </div>
  );
}
