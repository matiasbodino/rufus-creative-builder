"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  durationMs?: number;
}

export default function Toast({ message, onClose, durationMs = 3200 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, durationMs);
    return () => clearTimeout(t);
  }, [onClose, durationMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-enter fixed bottom-6 left-1/2 z-50 flex items-center gap-3 brutal neon-bg px-5 py-4 w-[min(92vw,440px)]"
      style={{ transform: "translateX(-50%)" }}
    >
      <CheckCircle2 size={24} strokeWidth={2.5} className="shrink-0" />
      <p className="flex-1 font-bold uppercase text-sm tracking-tight">{message}</p>
      <button
        aria-label="Cerrar notificación"
        onClick={onClose}
        className="shrink-0 hover:rotate-90 transition-transform"
      >
        <X size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
