export interface QuickAction {
  label: string;
  message: string;
}

export function detectQuickActions(content: string): QuickAction[] {
  const lower = content.toLowerCase();
  const actions: QuickAction[] = [];

  // Detect context and suggest relevant next steps
  if (lower.includes("avatar") || lower.includes("audiencia") || lower.includes("segmento")) {
    if (!lower.includes("descarg")) {
      actions.push({ label: "Generar Avatar DOCX", message: "Generame el documento de avatars en DOCX" });
    }
  }

  if (lower.includes("concepto") || lower.includes("campana") || lower.includes("pitch") || lower.includes("estrategia")) {
    if (!lower.includes("descarg")) {
      actions.push({ label: "Generar PPTX", message: "Armame el caso en PowerPoint" });
    }
  }

  if (lower.includes("brief") || lower.includes("creador") || lower.includes("ugc")) {
    if (!lower.includes("descarg")) {
      actions.push({ label: "Armar Brief DOCX", message: "Generame los briefs de creadores en DOCX" });
    }
  }

  if (lower.includes("pauta") || lower.includes("presupuesto") || lower.includes("media plan") || lower.includes("distribucion")) {
    if (!lower.includes("descarg")) {
      actions.push({ label: "Excel de Pauta", message: "Generame el Excel de pauta con la distribucion" });
    }
  }

  if (lower.includes("calendario") || lower.includes("contenido") || lower.includes("editorial")) {
    if (!lower.includes("descarg")) {
      actions.push({ label: "Calendario Editorial", message: "Generame el calendario editorial en Excel" });
    }
  }

  if (lower.includes("guion") || lower.includes("script") || lower.includes("reel")) {
    if (!lower.includes("descarg")) {
      actions.push({ label: "Guiones DOCX", message: "Generame los guiones en documento DOCX" });
    }
  }

  // Max 3 actions
  return actions.slice(0, 3);
}
