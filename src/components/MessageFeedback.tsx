"use client";

import { useState } from "react";
import { getFeedbackItem, saveFeedbackItem } from "@/lib/feedback";

type FeedbackValue = "up" | "down";

export default function MessageFeedback({ messageKey }: { messageKey: string }) {
  const [value, setValue] = useState<FeedbackValue | null>(() => getFeedbackItem(messageKey));

  function handleClick(v: FeedbackValue) {
    const next = value === v ? null : v;
    setValue(next);
    saveFeedbackItem(messageKey, next);
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={() => handleClick("up")}
        className={`p-1 rounded-md transition-colors ${
          value === "up"
            ? "text-[var(--accent)] bg-[var(--accent-subtle)]"
            : "text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-surface)]"
        }`}
        title="Buena respuesta"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={value === "up" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
      <button
        onClick={() => handleClick("down")}
        className={`p-1 rounded-md transition-colors ${
          value === "down"
            ? "text-red-400 bg-red-400/10"
            : "text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-surface)]"
        }`}
        title="Respuesta mejorable"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={value === "down" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
      </button>
    </div>
  );
}
