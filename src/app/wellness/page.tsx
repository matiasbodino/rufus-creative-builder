"use client";

import { Apple, Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";
import DashboardBento from "@/components/wellness/DashboardBento";
import NutritionModule from "@/components/wellness/NutritionModule";
import TrainingModule from "@/components/wellness/TrainingModule";

export default function WellnessPage() {
  const [navOpen, setNavOpen] = useState(false);

  const scrollTo = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-10 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="brutal-flat ink-bg w-10 h-10 flex items-center justify-center">
            <span className="display text-xl" style={{ color: "#fff" }}>K</span>
          </span>
          <div>
            <div className="display text-2xl leading-none">KORE</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              Bienestar personal
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollTo("nutricion")}
            className="brutal-sm brutal-press paper-bg px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:neon-bg"
          >
            <Apple size={14} strokeWidth={2.5} /> Alimentación
          </button>
          <button
            onClick={() => scrollTo("entrenamiento")}
            className="brutal-sm brutal-press paper-bg px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:neon-bg"
          >
            <Dumbbell size={14} strokeWidth={2.5} /> Entrenamiento
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setNavOpen((v) => !v)}
          className="sm:hidden brutal-sm brutal-press paper-bg p-2"
          aria-label={navOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={navOpen}
        >
          {navOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>
      </header>

      {navOpen && (
        <nav className="sm:hidden brutal paper-bg p-3 flex flex-col gap-2 -mt-6">
          <button
            onClick={() => scrollTo("nutricion")}
            className="brutal-sm paper-bg px-3 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:neon-bg"
          >
            <Apple size={14} strokeWidth={2.5} /> Alimentación
          </button>
          <button
            onClick={() => scrollTo("entrenamiento")}
            className="brutal-sm paper-bg px-3 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:neon-bg"
          >
            <Dumbbell size={14} strokeWidth={2.5} /> Entrenamiento
          </button>
        </nav>
      )}

      <DashboardBento />
      <NutritionModule />
      <TrainingModule />

      <footer className="border-t-2 border-black pt-5 text-[10px] font-bold uppercase tracking-widest opacity-60 flex flex-wrap items-center justify-between gap-2">
        <span>© KORE · Minimal brutalism wellness</span>
        <span>Hecho para moverse</span>
      </footer>
    </main>
  );
}
