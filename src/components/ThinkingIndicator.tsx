"use client";

import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STATUS_SETS: { keywords: string[]; messages: string[] }[] = [
  {
    keywords: ["avatar", "audiencia", "segmento", "target", "motivador"],
    messages: ["Analizando audiencia...", "Construyendo avatars...", "Mapeando motivadores..."],
  },
  {
    keywords: ["brief", "pitch", "campana", "caso", "propuesta"],
    messages: ["Analizando brief...", "Construyendo estrategia...", "Armando la propuesta..."],
  },
  {
    keywords: ["guion", "script", "hook", "reel", "tiktok", "video"],
    messages: ["Escribiendo guiones...", "Buscando hooks...", "Armando el script..."],
  },
  {
    keywords: ["pauta", "presupuesto", "media", "distribucion"],
    messages: ["Calculando distribucion...", "Armando plan de medios...", "Optimizando pauta..."],
  },
  {
    keywords: ["calendario", "contenido", "editorial", "organico", "pilar"],
    messages: ["Definiendo pilares...", "Planificando contenido...", "Armando calendario..."],
  },
  {
    keywords: ["generar", "genera", "arma", "pptx", "docx", "xlsx", "excel", "documento"],
    messages: ["Generando archivo...", "Armando el deliverable...", "Casi listo..."],
  },
];

const DEFAULT_MESSAGES = ["Pensando...", "Analizando contexto...", "Formulando respuesta..."];

function pickStatusSet(messages: Message[]): string[] {
  // Check last user message for context
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) return DEFAULT_MESSAGES;

  const lower = lastUserMsg.content.toLowerCase();
  for (const set of STATUS_SETS) {
    if (set.keywords.some((kw) => lower.includes(kw))) {
      return set.messages;
    }
  }
  return DEFAULT_MESSAGES;
}

export default function ThinkingIndicator({ messages }: { messages: Message[] }) {
  const statusMessages = pickStatusSet(messages);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">R</span>
        </div>
        <div className="flex items-center gap-2 pt-1.5">
          {/* Spinner */}
          <svg className="animate-spin w-3.5 h-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span
            key={index}
            className="text-sm text-[var(--text-muted)] animate-fade-in"
          >
            {statusMessages[index]}
          </span>
        </div>
      </div>
    </div>
  );
}
