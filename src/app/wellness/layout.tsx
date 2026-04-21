import type { Metadata } from "next";
import "./wellness.css";

export const metadata: Metadata = {
  title: "KORE — Bienestar sin rodeos",
  description: "Seguimiento de alimentación y entrenamiento en casa. Minimal. Directo.",
};

export default function WellnessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
      />
      <div className="wellness-root">{children}</div>
    </>
  );
}
