"use client";

import { Apple } from "lucide-react";
import { useMemo, useState } from "react";
import MealCard from "./MealCard";
import { MEAL_PLAN, type MealSlot } from "@/lib/wellness/data";

type Selections = Record<MealSlot, string>;
type Compliance = Record<MealSlot, boolean>;

const initialSelections: Selections = MEAL_PLAN.reduce((acc, m) => {
  acc[m.slot] = m.options[0].id;
  return acc;
}, {} as Selections);

const initialCompliance: Compliance = MEAL_PLAN.reduce((acc, m) => {
  acc[m.slot] = false;
  return acc;
}, {} as Compliance);

export default function NutritionModule() {
  const [selections, setSelections] = useState<Selections>(initialSelections);
  const [compliance, setCompliance] = useState<Compliance>(initialCompliance);

  const { kcalTotal, kcalTarget, doneCount } = useMemo(() => {
    let kcalTotal = 0;
    let kcalTarget = 0;
    let doneCount = 0;
    for (const plan of MEAL_PLAN) {
      kcalTarget += plan.targetKcal;
      const opt = plan.options.find((o) => o.id === selections[plan.slot]);
      if (opt) kcalTotal += opt.kcal;
      if (compliance[plan.slot]) doneCount += 1;
    }
    return { kcalTotal, kcalTarget, doneCount };
  }, [selections, compliance]);

  const pctDone = Math.round((doneCount / MEAL_PLAN.length) * 100);

  return (
    <section id="nutricion" className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-flat ink-bg p-1.5">
              <Apple size={16} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Módulo 01 · Alimentación
            </span>
          </div>
          <h2 className="display text-5xl sm:text-6xl">Come con plan.</h2>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="brutal-flat paper-bg px-4 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Calorías hoy
            </div>
            <div className="mono text-2xl font-bold leading-tight">
              {kcalTotal}
              <span className="text-sm opacity-60"> / {kcalTarget}</span>
            </div>
          </div>
          <div className="brutal-flat neon-bg px-4 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest">
              Cumplimiento
            </div>
            <div className="mono text-2xl font-bold leading-tight">
              {pctDone}%
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MEAL_PLAN.map((plan) => (
          <MealCard
            key={plan.slot}
            plan={plan}
            selectedOptionId={selections[plan.slot]}
            compliant={compliance[plan.slot]}
            onSelect={(optionId) =>
              setSelections((s) => ({ ...s, [plan.slot]: optionId }))
            }
            onToggleCompliance={() =>
              setCompliance((c) => ({ ...c, [plan.slot]: !c[plan.slot] }))
            }
          />
        ))}
      </div>
    </section>
  );
}
