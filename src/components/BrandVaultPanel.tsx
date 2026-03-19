"use client";

import { useState } from "react";
import { BrandProfile } from "@/lib/brand-vault";

export default function BrandVaultPanel({
  brands,
  onSave,
  onDelete,
}: {
  brands: BrandProfile[];
  onSave: (profile: Partial<BrandProfile> & { clientName: string }) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  if (brands.length === 0 && !showAdd) {
    return (
      <div className="text-center mt-8 px-4">
        <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-[var(--text-faint)] text-xs mb-3">
          El Brand Vault guarda contexto de tus clientes para que el output creativo sea específico, no genérico.
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          + Agregar marca
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {brands.map((brand) => (
        <div key={brand.id}>
          <button
            onClick={() => setEditingId(editingId === brand.id ? null : brand.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              editingId === brand.id
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium truncate">{brand.clientName}</span>
              <span className="text-[9px] text-[var(--text-faint)]">
                {brand.category || "sin categoría"}
              </span>
            </div>
            {brand.brandVoice && (
              <p className="text-[10px] text-[var(--text-faint)] mt-0.5 truncate">
                Voz: {brand.brandVoice}
              </p>
            )}
          </button>

          {editingId === brand.id && (
            <BrandEditor
              brand={brand}
              onSave={(updated) => {
                onSave({ ...updated, clientName: brand.clientName });
                setEditingId(null);
              }}
              onDelete={() => {
                onDelete(brand.id);
                setEditingId(null);
              }}
              onClose={() => setEditingId(null)}
            />
          )}
        </div>
      ))}

      {showAdd ? (
        <div className="px-2 py-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del cliente..."
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && newName.trim()) {
                onSave({ clientName: newName.trim() });
                setNewName("");
                setShowAdd(false);
              }
              if (e.key === "Escape") {
                setNewName("");
                setShowAdd(false);
              }
            }}
          />
          <div className="flex gap-1 mt-1">
            <button
              onClick={() => {
                if (newName.trim()) {
                  onSave({ clientName: newName.trim() });
                  setNewName("");
                  setShowAdd(false);
                }
              }}
              className="flex-1 text-[10px] py-1 rounded bg-[var(--accent)] text-white"
            >
              Guardar
            </button>
            <button
              onClick={() => { setNewName(""); setShowAdd(false); }}
              className="flex-1 text-[10px] py-1 rounded bg-[var(--bg-surface)] text-[var(--text-muted)]"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full text-left px-3 py-2 text-xs text-[var(--accent)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
        >
          + Agregar marca
        </button>
      )}
    </div>
  );
}

function BrandEditor({
  brand,
  onSave,
  onDelete,
  onClose,
}: {
  brand: BrandProfile;
  onSave: (updated: Partial<BrandProfile>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    category: brand.category || "",
    targetMarket: brand.targetMarket || "",
    brandVoice: brand.brandVoice || "",
    audiences: brand.audiences || "",
    competitiveContext: brand.competitiveContext || "",
    brandGuidelines: brand.brandGuidelines || "",
    keyInsights: brand.keyInsights || "",
    pastCampaigns: brand.pastCampaigns || "",
    notes: brand.notes || "",
  });

  const fields: { key: keyof typeof form; label: string; multiline?: boolean }[] = [
    { key: "category", label: "Categoría (fintech, FMCG, tech...)" },
    { key: "targetMarket", label: "Mercado (ARG, MEX, LATAM...)" },
    { key: "brandVoice", label: "Voz de marca" },
    { key: "keyInsights", label: "Insights clave", multiline: true },
    { key: "audiences", label: "Audiencias / Avatars", multiline: true },
    { key: "competitiveContext", label: "Competencia", multiline: true },
    { key: "brandGuidelines", label: "Guidelines (DO/DON'T)", multiline: true },
    { key: "pastCampaigns", label: "Campañas anteriores", multiline: true },
    { key: "notes", label: "Notas libres", multiline: true },
  ];

  return (
    <div className="px-2 py-2 space-y-2 border-l-2 border-[var(--accent)] ml-2">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-[10px] text-[var(--text-faint)] block mb-0.5">{f.label}</label>
          {f.multiline ? (
            <textarea
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-2 py-1 rounded text-[11px] bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
              rows={2}
            />
          ) : (
            <input
              type="text"
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-2 py-1 rounded text-[11px] bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          )}
        </div>
      ))}
      <div className="flex gap-1 pt-1">
        <button
          onClick={() => onSave(form)}
          className="flex-1 text-[10px] py-1.5 rounded bg-[var(--accent)] text-white font-medium"
        >
          Guardar
        </button>
        <button
          onClick={onClose}
          className="flex-1 text-[10px] py-1.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)]"
        >
          Cerrar
        </button>
        <button
          onClick={onDelete}
          className="text-[10px] py-1.5 px-2 rounded text-red-400 hover:bg-red-500/10"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
