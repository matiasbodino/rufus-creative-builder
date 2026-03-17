import { RefObject } from "react";

const SUGGESTIONS = [
  {
    text: "Tengo un pitch para MercadoLibre, te paso el brief",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    text: "Necesito armar una propuesta de campaña para CyberMonday",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    text: "Quiero la estrategia ongoing para una cuenta de beauty",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    text: "Tengo una transcripción de call con el cliente",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

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
      <p className="text-[var(--text-muted)] max-w-lg mb-10 text-sm sm:text-base leading-relaxed">
        Contame para qué cliente necesitás armar un caso.
        <br className="hidden sm:block" />
        Podés pegar un brief, una transcripción o arrancar de cero.
      </p>

      {/* Suggestion grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => {
              onSuggestion(s.text);
              inputRef.current?.focus();
            }}
            className="group flex items-start gap-3 text-left px-4 py-3.5 rounded-2xl border border-[var(--border)] text-[var(--text-muted)] text-sm leading-snug hover:border-[var(--accent-border)] hover:bg-[var(--accent-muted)] hover:text-[var(--text-secondary)] transition-all duration-200"
          >
            <span className="flex-shrink-0 mt-0.5 text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors">
              {s.icon}
            </span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
