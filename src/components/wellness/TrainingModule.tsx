"use client";

import { CheckCircle2, Dumbbell, Home, Timer as TimerIcon, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import Timer from "./Timer";
import Toast from "./Toast";
import { ROUTINES, type Routine } from "@/lib/wellness/data";

interface TrainingModuleProps {
  routine?: Routine;
}

export default function TrainingModule({ routine: externalRoutine }: TrainingModuleProps = {}) {
  const [routineId, setRoutineId] = useState<string>(externalRoutine?.id ?? ROUTINES[0].id);
  const routine = useMemo(
    () => ROUTINES.find((r) => r.id === routineId) ?? ROUTINES[0],
    [routineId]
  );
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);

  const completedCount = routine.exercises.filter((e) => done[e.id]).length;
  const totalCount = routine.exercises.length;

  const changeRoutine = (id: string) => {
    setRoutineId(id);
    setDone({});
  };

  const toggleExercise = (id: string) =>
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const finishSession = () => {
    setShowToast(true);
    setDone({});
  };

  return (
    <section id="entrenamiento" className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-flat ink-bg p-1.5">
              <Dumbbell size={16} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Módulo 02 · Entrenamiento
            </span>
          </div>
          <h2 className="display text-5xl sm:text-6xl">Entrena en casa.</h2>
        </div>
        <div className="brutal-flat paper-bg px-4 py-2.5 flex items-center gap-3">
          <Home size={16} strokeWidth={2.5} />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Sin equipamiento
            </div>
            <div className="text-sm font-bold">Solo peso corporal</div>
          </div>
        </div>
      </header>

      {/* Routine chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {ROUTINES.map((r) => {
          const active = r.id === routine.id;
          return (
            <button
              key={r.id}
              onClick={() => changeRoutine(r.id)}
              className={`brutal-sm brutal-press shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${active ? "neon-bg" : "paper-bg"}`}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Routine summary + timer */}
        <div className="brutal paper-bg p-5 flex flex-col gap-4 lg:col-span-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Rutina activa
            </span>
            <h3 className="display text-3xl mt-1">{routine.name}</h3>
            <p className="text-sm mt-2 opacity-80">{routine.focus}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="brutal-flat px-2.5 py-1 text-xs font-bold flex items-center gap-1">
              <TimerIcon size={12} strokeWidth={2.75} />
              {routine.durationMin} min
            </span>
            <span className="brutal-flat neon-bg px-2.5 py-1 text-xs font-bold">
              {routine.level}
            </span>
            <span className="brutal-flat px-2.5 py-1 text-xs font-bold">
              {totalCount} ejercicios
            </span>
          </div>
          <Timer />
          <div className="brutal-flat ink-bg p-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
              Progreso
            </span>
            <span className="mono font-bold text-lg">
              {completedCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* Exercises list */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {routine.exercises.map((ex, idx) => {
            const isDone = !!done[ex.id];
            return (
              <div
                key={ex.id}
                className={`brutal-flat p-4 flex items-center gap-4 ${isDone ? "neon-bg" : "paper-bg"}`}
              >
                <div className="mono text-2xl font-bold w-8 shrink-0 opacity-80">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base sm:text-lg truncate">
                    {ex.name}
                  </h4>
                  {ex.note && (
                    <p className="text-xs opacity-70 mt-0.5">{ex.note}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="brutal-flat paper-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {ex.sets} series
                    </span>
                    <span className="brutal-flat paper-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {ex.reps}
                    </span>
                    {ex.restSec > 0 && (
                      <span className="brutal-flat paper-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Descanso {ex.restSec}s
                      </span>
                    )}
                  </div>
                </div>
                <label className="cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    className="brutal-check"
                    checked={isDone}
                    onChange={() => toggleExercise(ex.id)}
                    aria-label={`Marcar ${ex.name} como completado`}
                  />
                </label>
              </div>
            );
          })}

          <button
            onClick={finishSession}
            disabled={completedCount === 0}
            className="brutal brutal-press mt-2 ink-bg px-5 py-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            <Trophy size={20} strokeWidth={2.5} />
            Finalizar sesión
          </button>
        </div>
      </div>

      {showToast && (
        <Toast
          message={`¡Sesión completada! ${completedCount}/${totalCount} ejercicios`}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Inline success indicator for screen-reader / completeness */}
      {completedCount === totalCount && completedCount > 0 && !showToast && (
        <p className="sr-only" role="status">
          <CheckCircle2 size={12} /> Todos los ejercicios completados.
        </p>
      )}
    </section>
  );
}
