"use client";

import { DeliverableRecord } from "@/lib/deliverables";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Recién";
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(dateStr).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function fileIcon(label: string) {
  if (label.includes(".pptx")) return "PPTX";
  if (label.includes(".xlsx")) return "XLSX";
  if (label.includes(".docx")) return "DOCX";
  return "FILE";
}

function fileColor(label: string) {
  if (label.includes(".pptx")) return "bg-orange-500/15 text-orange-400";
  if (label.includes(".xlsx")) return "bg-green-500/15 text-green-400";
  if (label.includes(".docx")) return "bg-blue-500/15 text-blue-400";
  return "bg-gray-500/15 text-gray-400";
}

export default function DeliverableLibrary({
  deliverables,
  onGoToConversation,
}: {
  deliverables: DeliverableRecord[];
  onGoToConversation: (conversationId: string) => void;
}) {
  if (deliverables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p className="text-[var(--text-faint)] text-sm mt-3">
          Todavía no generaste ningún deliverable.
        </p>
        <p className="text-[var(--text-faint)] text-xs mt-1">
          Los archivos DOCX, XLSX y PPTX van a aparecer acá.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-2">
      {deliverables.map((d) => (
        <button
          key={d.id}
          onClick={() => onGoToConversation(d.conversationId)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[var(--bg-surface-hover)] transition-colors group"
        >
          <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${fileColor(d.label)}`}>
            {fileIcon(d.label)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)] transition-colors">
              {d.label.replace(/^Descargar\s+/, "")}
            </div>
            <div className="text-[10px] text-[var(--text-faint)] truncate">
              {d.conversationTitle} · {timeAgo(d.createdAt)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
