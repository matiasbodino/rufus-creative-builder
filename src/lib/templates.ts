export interface Template {
  id: string;
  layer: "audience" | "ads" | "organic";
  title: string;
  description: string;
  icon: string;
  starterMessage: string;
}

export const LAYER_LABELS: Record<Template["layer"], string> = {
  audience: "Audiencia",
  ads: "Ad Creator",
  organic: "Contenido Organico",
};

export const TEMPLATES: Template[] = [
  // Audience
  {
    id: "avatar-builder",
    layer: "audience",
    title: "Avatar Builder",
    description: "Construir avatars con motivadores y Life-Force 8",
    icon: "users",
    starterMessage:
      "Necesito construir los avatars para una marca. Quiero definir segmentos, motivadores, pain points y niveles de awareness. Arrancamos?",
  },
  {
    id: "messaging-matrix",
    layer: "audience",
    title: "Messaging Matrix",
    description: "Matriz de mensajes por avatar y awareness level",
    icon: "grid",
    starterMessage:
      "Quiero armar una messaging matrix completa: mensajes clave por avatar, nivel de awareness y framework de copy. Tengo los avatars definidos.",
  },
  // Ads
  {
    id: "pitch-campana",
    layer: "ads",
    title: "Pitch de Campana",
    description: "Caso estrategico con concepto, guiones y pauta",
    icon: "rocket",
    starterMessage:
      "Tengo un pitch para un cliente nuevo. Necesito armar el caso completo: insight, concepto creativo, guiones de ads y excel de pauta.",
  },
  {
    id: "ugc-brief",
    layer: "ads",
    title: "Brief UGC / Creators",
    description: "Briefs para creadores con guion y direccion",
    icon: "camera",
    starterMessage:
      "Necesito armar briefs para creadores UGC. Quiero guiones con hooks, desarrollo y CTA, mas la direccion creativa para cada pieza.",
  },
  {
    id: "testing-matrix",
    layer: "ads",
    title: "Testing Matrix",
    description: "Matriz de testing A/B para ads con variantes",
    icon: "beaker",
    starterMessage:
      "Quiero armar una testing matrix para ads: variantes de hook, copy, formato y audiencia. Necesito el Excel con todas las combinaciones.",
  },
  {
    id: "excel-pauta",
    layer: "ads",
    title: "Excel de Pauta",
    description: "Plan de medios con presupuesto y distribucion",
    icon: "table",
    starterMessage:
      "Necesito generar el Excel de pauta para una campana. Tengo el presupuesto total y necesito la distribucion por plataforma, formato y objetivo.",
  },
  // Organic
  {
    id: "estrategia-contenido",
    layer: "organic",
    title: "Estrategia de Contenido",
    description: "Pilares, formatos y calendario editorial",
    icon: "calendar",
    starterMessage:
      "Quiero armar la estrategia de contenido organico para una marca. Necesito definir pilares, formatos, frecuencia y el calendario editorial mensual.",
  },
  {
    id: "guiones-reels",
    layer: "organic",
    title: "Guiones de Reels",
    description: "Scripts para Reels/TikTok con hooks y CTA",
    icon: "video",
    starterMessage:
      "Necesito guiones para Reels y TikTok. Quiero variantes de hooks, desarrollo del contenido y CTAs. Dame los scripts listos para grabar.",
  },
];
