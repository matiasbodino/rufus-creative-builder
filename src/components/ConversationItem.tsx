"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation } from "@/lib/conversations";

export default function ConversationItem({
  conversation, active, onSelect, onToggleStar, onRename, onDelete,
}: {
  conversation: Conversation; active: boolean;
  onSelect: (id: string) => void; onToggleStar: (id: string) => void;
  onRename: (id: string, title: string) => void; onDelete: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(conversation.title);
  const editRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (editing) editRef.current?.focus(); }, [editing]);
  useEffect(() => {
    if (!showMenu) return;
    function handleClick(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  function commitRename() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== conversation.title) onRename(conversation.id, trimmed);
    else setEditValue(conversation.title);
    setEditing(false);
  }

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
        active ? "bg-[var(--bg-surface)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]"
      }`}
      onClick={() => !editing && onSelect(conversation.id)}
    >
      {editing ? (
        <input ref={editRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={commitRename}
          onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") { setEditValue(conversation.title); setEditing(false); } }}
          onClick={(e) => e.stopPropagation()} className="flex-1 bg-[var(--bg-primary)] border border-[var(--accent-border)] rounded-lg px-2 py-1 text-sm text-[var(--text-primary)] outline-none min-w-0" />
      ) : (
        <span className="flex-1 truncate text-sm">{conversation.title}</span>
      )}
      {!editing && (
        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="opacity-0 group-hover:opacity-100 text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-all p-0.5 rounded">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
        </button>
      )}
      {showMenu && (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 z-50 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-lg py-1 min-w-[140px]" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setEditValue(conversation.title); setEditing(true); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] transition-colors">Renombrar</button>
          <button onClick={() => { onToggleStar(conversation.id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] transition-colors">{conversation.starred ? "Quitar destacado" : "Destacar"}</button>
          <button onClick={() => { onDelete(conversation.id); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[var(--bg-surface-hover)] transition-colors">Eliminar</button>
        </div>
      )}
    </div>
  );
}
