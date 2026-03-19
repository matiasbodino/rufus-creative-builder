import { RefObject, ReactNode } from "react";
import { TEMPLATES, LAYER_LABELS, Template } from "@/lib/templates";

const ICONS: Record<string, ReactNode> = {
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  rocket: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  camera: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  beaker: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  ),
  table: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  video: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
};

const LAYER_ORDER: Template["layer"][] = ["audience", "ads", "organic"];

export default function EmptyState({
  onSuggestion,
  inputRef,
}: {
  onSuggestion: (text: string) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Logo */}
      <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-6">
        <span className="text-white font-bold text-xl">R</span>
      </div>

      {/* Title */}
      <h1 className="text-[var(--text-primary)] text-2xl sm:text-3xl font-semibold mb-2 tracking-tight">
        Creative Builder
      </h1>
      <p className="text-[var(--text-muted)] max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
        Elegí un punto de partida o contame qué necesitás armar.
      </p>

      {/* Templates grouped by layer */}
      <div className="w-full max-w-2xl space-y-5">
        {LAYER_ORDER.map((layer) => {
          const layerTemplates = TEMPLATES.filter((t) => t.layer === layer);
          if (layerTemplates.length === 0) return null;
          return (
            <div key={layer}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
                  {LAYER_LABELS[layer]}
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {layerTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSuggestion(t.starterMessage);
                      inputRef.current?.focus();
                    }}
                    className="group flex items-start gap-3 text-left px-4 py-3 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-muted)] transition-all duration-200"
                  >
                    <span className="flex-shrink-0 mt-0.5 text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors">
                      {ICONS[t.icon]}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        {t.title}
                      </div>
                      <div className="text-xs text-[var(--text-faint)] mt-0.5 leading-snug">
                        {t.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
