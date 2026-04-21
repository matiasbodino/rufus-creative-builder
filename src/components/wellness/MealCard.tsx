"use client";

import { Check, ChevronDown, Clock, Flame } from "lucide-react";
import { useState } from "react";
import type { MealPlan, MealOption } from "@/lib/wellness/data";

interface MealCardProps {
  plan: MealPlan;
  selectedOptionId: string;
  compliant: boolean;
  onSelect: (optionId: string) => void;
  onToggleCompliance: () => void;
}

export default function MealCard({
  plan,
  selectedOptionId,
  compliant,
  onSelect,
  onToggleCompliance,
}: MealCardProps) {
  const [open, setOpen] = useState(false);
  const selected: MealOption =
    plan.options.find((o) => o.id === selectedOptionId) ?? plan.options[0];

  return (
    <div className={`brutal paper-bg p-5 flex flex-col gap-4 ${compliant ? "opacity-95" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ink-bg">
              {plan.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold opacity-70">
              <Clock size={12} strokeWidth={2.5} />
              {plan.time}
            </span>
          </div>
          <h3 className="display text-2xl sm:text-[28px] mt-1 break-words">
            {selected.name}
          </h3>
        </div>
        <label className="cursor-pointer flex flex-col items-center gap-1">
          <input
            type="checkbox"
            className="brutal-check"
            checked={compliant}
            onChange={onToggleCompliance}
            aria-label={`Marcar ${plan.label} como cumplido`}
          />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {compliant ? "Hecho" : "Pendiente"}
          </span>
        </label>
      </div>

      <p className="text-sm leading-snug opacity-80">{selected.description}</p>

      <div className="flex flex-wrap gap-2">
        <span className="brutal-flat px-2.5 py-1 text-xs font-bold flex items-center gap-1 neon-bg">
          <Flame size={12} strokeWidth={2.75} />
          {selected.kcal} kcal
        </span>
        <span className="brutal-flat px-2.5 py-1 text-xs font-bold">
          P {selected.macros.p}
        </span>
        <span className="brutal-flat px-2.5 py-1 text-xs font-bold">
          C {selected.macros.c}
        </span>
        <span className="brutal-flat px-2.5 py-1 text-xs font-bold">
          G {selected.macros.f}
        </span>
      </div>

      <div className="brutal-flat">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-widest hover:neon-bg transition-colors"
          aria-expanded={open}
        >
          Cambiar opción
          <ChevronDown
            size={16}
            strokeWidth={2.75}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <ul className="border-t-2 border-black divide-y-2 divide-black">
            {plan.options.map((opt) => {
              const active = opt.id === selected.id;
              return (
                <li key={opt.id}>
                  <button
                    onClick={() => {
                      onSelect(opt.id);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 text-sm hover:neon-bg transition-colors ${active ? "neon-bg" : ""}`}
                  >
                    <span className="font-semibold truncate">{opt.name}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="mono text-[11px] font-bold">{opt.kcal}kcal</span>
                      {active && <Check size={14} strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
