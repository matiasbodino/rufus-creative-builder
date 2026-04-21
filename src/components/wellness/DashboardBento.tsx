"use client";

import { Activity, Droplet, Flame, Moon, TrendingUp } from "lucide-react";

const TODAY = new Date().toLocaleDateString("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function DashboardBento() {
  return (
    <section aria-label="Resumen diario" className="grid grid-cols-4 md:grid-cols-6 gap-4">
      {/* Headline — big bento */}
      <div className="col-span-4 md:col-span-4 brutal ink-bg p-5 sm:p-7 flex flex-col justify-between min-h-[200px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
            {TODAY}
          </span>
          <span className="brutal-flat neon-bg px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
            On track
          </span>
        </div>
        <div>
          <h1 className="display text-6xl sm:text-7xl md:text-8xl leading-[0.85]">
            Hoy.
            <br />
            <span className="neon-bg text-black px-1">Mueve</span>
            <br />
            y come.
          </h1>
          <p className="mt-4 text-sm opacity-70 max-w-md">
            Un solo lugar para tus comidas y tu entrenamiento. Sin ruido.
            Sin excusas.
          </p>
        </div>
      </div>

      {/* Streak */}
      <div className="col-span-2 md:col-span-2 brutal neon-bg p-5 flex flex-col justify-between min-h-[200px]">
        <div className="flex items-center justify-between">
          <Flame size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Racha
          </span>
        </div>
        <div>
          <div className="display text-6xl md:text-7xl">14</div>
          <div className="text-xs font-bold uppercase tracking-widest mt-1">
            Días seguidos
          </div>
        </div>
      </div>

      {/* Water */}
      <div className="col-span-2 md:col-span-2 brutal paper-bg p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between">
          <Droplet size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Hidratación
          </span>
        </div>
        <div>
          <div className="display text-4xl">1.8L</div>
          <div className="text-xs font-bold opacity-60 mt-1">Meta 2.5L</div>
          <div className="mt-2 h-3 brutal-flat paper-bg overflow-hidden">
            <div className="h-full neon-bg" style={{ width: "72%" }} />
          </div>
        </div>
      </div>

      {/* Sleep */}
      <div className="col-span-2 md:col-span-2 brutal paper-bg p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between">
          <Moon size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Sueño
          </span>
        </div>
        <div>
          <div className="display text-4xl">7h 20m</div>
          <div className="text-xs font-bold opacity-60 mt-1">Calidad 82%</div>
        </div>
      </div>

      {/* Active minutes */}
      <div className="col-span-4 md:col-span-2 brutal paper-bg p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-center justify-between">
          <Activity size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Actividad
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="display text-4xl">48</div>
            <div className="text-xs font-bold opacity-60 mt-1">min activos</div>
          </div>
          <div className="flex items-center gap-1 brutal-flat ink-bg px-2 py-1">
            <TrendingUp size={12} strokeWidth={2.75} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              +12%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
