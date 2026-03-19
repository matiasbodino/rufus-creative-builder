// Brand Vault — persistent client context for better creative output

export interface BrandFile {
  id: string;
  name: string;
  uploadedAt: string;
  text: string; // extracted text content
  size: number; // original file size in bytes
}

export interface BrandProfile {
  id: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  // Core brand context
  brandVoice?: string; // informal, empoderador, técnico, etc.
  category?: string; // fintech, FMCG, tech, etc.
  targetMarket?: string; // Argentina, México, LATAM, etc.
  // What we know
  audiences?: string; // avatars, target descriptions
  pastCampaigns?: string; // what worked, what didn't
  competitiveContext?: string; // main competitors
  brandGuidelines?: string; // DO/DON'T, tono, colores
  keyInsights?: string; // product insights, USPs
  // Creative assessment data
  creativeAssessment?: string; // full assessment output
  // Custom context prompt — always injected when this brand is active
  contextPrompt?: string;
  // Uploaded files — text extracted and stored
  files?: BrandFile[];
  // Free-form notes
  notes?: string;
}

const STORAGE_KEY = "rufus-brand-vault";

export function loadBrandVault(): BrandProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBrandVault(profiles: BrandProfile[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getBrandProfile(clientName: string): BrandProfile | null {
  const profiles = loadBrandVault();
  const normalized = clientName.toLowerCase().trim();
  return (
    profiles.find(
      (p) =>
        p.clientName.toLowerCase().trim() === normalized ||
        p.clientName.toLowerCase().includes(normalized) ||
        normalized.includes(p.clientName.toLowerCase())
    ) || null
  );
}

export function upsertBrandProfile(profile: Partial<BrandProfile> & { clientName: string }): BrandProfile {
  const profiles = loadBrandVault();
  const existing = profiles.findIndex(
    (p) => p.clientName.toLowerCase().trim() === profile.clientName.toLowerCase().trim()
  );

  if (existing >= 0) {
    // Update existing
    const updated: BrandProfile = {
      ...profiles[existing],
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    profiles[existing] = updated;
    saveBrandVault(profiles);
    return updated;
  } else {
    // Create new
    const newProfile: BrandProfile = {
      id: `bp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...profile,
    };
    profiles.push(newProfile);
    saveBrandVault(profiles);
    return newProfile;
  }
}

export function deleteBrandProfile(id: string): void {
  const profiles = loadBrandVault();
  saveBrandVault(profiles.filter((p) => p.id !== id));
}

/**
 * Detect client name from conversation messages.
 * Looks for patterns like "Soy de X", "para X", "cliente: X", "marca: X"
 */
export function detectClientName(messages: { role: string; content: string }[]): string | null {
  const patterns = [
    /(?:soy de|trabajo (?:en|para)|somos de|(?:el |la )?(?:marca|cliente|empresa|cuenta) (?:es|se llama)?)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s&.-]{1,30})/i,
    /(?:para|de)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*){0,3})\s*[.,;!?]/,
    /(?:campaña|estrategia|ads|contenido|brief|pitch)\s+(?:de|para)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s&.-]{1,30})/i,
  ];

  // Check user messages (most recent first)
  const userMessages = messages
    .filter((m) => m.role === "user")
    .reverse();

  for (const msg of userMessages) {
    for (const pattern of patterns) {
      const match = msg.content.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim().replace(/[.,;!?]+$/, "").trim();
        // Filter out common false positives
        const ignore = new Set([
          "el", "la", "los", "las", "un", "una", "que", "del", "con", "por",
          "para", "como", "todo", "esta", "este", "eso", "hay", "hoy", "acá",
          "social", "media", "creative", "content", "marketing", "digital",
        ]);
        if (name.length >= 2 && !ignore.has(name.toLowerCase())) {
          return name;
        }
      }
    }
  }
  return null;
}

/**
 * Format brand profile as context string for system prompt injection
 */
export function formatBrandContext(profile: BrandProfile): string {
  const sections: string[] = [
    `## BRAND VAULT: ${profile.clientName.toUpperCase()}`,
    `*(Contexto guardado — última actualización: ${new Date(profile.updatedAt).toLocaleDateString("es-AR")})*`,
  ];

  if (profile.category) sections.push(`**Categoría:** ${profile.category}`);
  if (profile.targetMarket) sections.push(`**Mercado:** ${profile.targetMarket}`);
  if (profile.brandVoice) sections.push(`**Voz de marca:** ${profile.brandVoice}`);
  if (profile.audiences) sections.push(`**Audiencias conocidas:**\n${profile.audiences}`);
  if (profile.keyInsights) sections.push(`**Insights clave:**\n${profile.keyInsights}`);
  if (profile.competitiveContext) sections.push(`**Contexto competitivo:**\n${profile.competitiveContext}`);
  if (profile.brandGuidelines) sections.push(`**Guidelines de marca:**\n${profile.brandGuidelines}`);
  if (profile.pastCampaigns) sections.push(`**Campañas anteriores:**\n${profile.pastCampaigns}`);
  if (profile.creativeAssessment) sections.push(`**Creative Assessment:**\n${profile.creativeAssessment}`);
  if (profile.notes) sections.push(`**Notas:**\n${profile.notes}`);

  // Inject custom context prompt
  if (profile.contextPrompt) {
    sections.push(`**Instrucciones específicas para esta marca:**\n${profile.contextPrompt}`);
  }

  // Inject uploaded file contents (truncated to avoid token overflow)
  if (profile.files && profile.files.length > 0) {
    const fileSection = profile.files.map((f) => {
      const truncated = f.text.length > 3000 ? f.text.slice(0, 3000) + "\n...[truncado]" : f.text;
      return `### Archivo: ${f.name}\n${truncated}`;
    }).join("\n\n");
    sections.push(`**Documentos de referencia (${profile.files.length} archivos):**\n\n${fileSection}`);
  }

  return sections.join("\n\n");
}

/**
 * Pre-flight checklist questions for when no brand vault exists
 */
export const PREFLIGHT_QUESTIONS = [
  "¿Cuál es la voz de marca? (formal / informal / irreverente / técnica / empoderador)",
  "¿Qué funcionó en campañas anteriores? (formato, mensaje, plataforma)",
  "¿Quiénes son los competidores directos?",
  "¿Hay algo que NO se puede decir o hacer? (restricciones, temas prohibidos)",
  "¿Cuál es el insight central del producto/servicio?",
];
