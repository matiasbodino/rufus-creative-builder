"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  initialSeconds?: number;
}

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({ initialSeconds = 0 }: TimerProps) {
  const [elapsed, setElapsed] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const toggle = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  return (
    <div className={`brutal-flat paper-bg p-4 sm:p-5 flex items-center justify-between gap-3 ${running ? "timer-running" : ""}`}>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
          Cronómetro
        </span>
        <span className="mono text-4xl sm:text-5xl font-bold leading-none mt-1">
          {fmt(elapsed)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label={running ? "Pausar cronómetro" : "Iniciar cronómetro"}
          className="brutal-sm brutal-press paper-bg p-3 hover:-translate-y-0.5 transition-transform"
        >
          {running ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} strokeWidth={2.5} />}
        </button>
        <button
          onClick={reset}
          aria-label="Reiniciar cronómetro"
          className="brutal-sm brutal-press paper-bg p-3 hover:-translate-y-0.5 transition-transform"
        >
          <RotateCcw size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
