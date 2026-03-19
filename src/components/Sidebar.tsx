"use client";

import { useState } from "react";
import { Conversation, groupConversations } from "@/lib/conversations";
import { DeliverableRecord } from "@/lib/deliverables";
import SidebarSection from "./SidebarSection";
import ConversationItem from "./ConversationItem";
import DeliverableLibrary from "./DeliverableLibrary";

type Tab = "cases" | "library";

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onToggleStar,
  onRename,
  onDelete,
  sidebarOpen,
  setSidebarOpen,
  deliverables,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onToggleStar: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  deliverables: DeliverableRecord[];
}) {
  const { starred, today, previous } = groupConversations(conversations);
  const [tab, setTab] = useState<Tab>("cases");

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed lg:relative lg:translate-x-0 z-50
          w-[280px] h-full
          bg-[var(--bg-secondary)]
          flex flex-col
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="flex items-center justify-between p-3 h-14">
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button
            onClick={onNew}
            className="ml-auto p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            title="Nuevo caso"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="px-3 pb-2">
          <button
            onClick={onNew}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:bg-[var(--bg-surface)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo caso
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-3 pb-2 gap-1">
          <button
            onClick={() => setTab("cases")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
              tab === "cases"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                : "text-[var(--text-faint)] hover:text-[var(--text-muted)]"
            }`}
          >
            Casos
          </button>
          <button
            onClick={() => setTab("library")}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === "library"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                : "text-[var(--text-faint)] hover:text-[var(--text-muted)]"
            }`}
          >
            Archivos
            {deliverables.length > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                tab === "library"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-surface-hover)] text-[var(--text-faint)]"
              }`}>
                {deliverables.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {tab === "cases" ? (
            <>
              {starred.length > 0 && (
                <SidebarSection title="Destacados">
                  {starred.map((c) => (
                    <ConversationItem key={c.id} conversation={c} active={c.id === activeId} onSelect={onSelect} onToggleStar={onToggleStar} onRename={onRename} onDelete={onDelete} />
                  ))}
                </SidebarSection>
              )}
              {today.length > 0 && (
                <SidebarSection title="Hoy">
                  {today.map((c) => (
                    <ConversationItem key={c.id} conversation={c} active={c.id === activeId} onSelect={onSelect} onToggleStar={onToggleStar} onRename={onRename} onDelete={onDelete} />
                  ))}
                </SidebarSection>
              )}
              {previous.length > 0 && (
                <SidebarSection title="Anteriores">
                  {previous.map((c) => (
                    <ConversationItem key={c.id} conversation={c} active={c.id === activeId} onSelect={onSelect} onToggleStar={onToggleStar} onRename={onRename} onDelete={onDelete} />
                  ))}
                </SidebarSection>
              )}
              {conversations.length === 0 && (
                <p className="text-[var(--text-faint)] text-xs text-center mt-12 px-4">
                  Tus casos van a aparecer acá
                </p>
              )}
            </>
          ) : (
            <DeliverableLibrary
              deliverables={deliverables}
              onGoToConversation={(id) => {
                onSelect(id);
                setTab("cases");
              }}
            />
          )}
        </div>

        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="text-[var(--text-faint)] text-xs">Rufus Social</span>
        </div>
      </aside>
    </>
  );
}
