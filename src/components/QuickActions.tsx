import { QuickAction } from "@/lib/quick-actions";

export default function QuickActions({
  actions,
  onAction,
}: {
  actions: QuickAction[];
  onAction: (message: string) => void;
}) {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onAction(a.message)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--accent-border)] text-[var(--accent)] bg-[var(--accent-subtle)] hover:bg-[var(--accent-muted)] hover:border-[var(--accent)] transition-all duration-200"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
          {a.label}
        </button>
      ))}
    </div>
  );
}
