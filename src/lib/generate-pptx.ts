import PptxGenJS from "pptxgenjs";

// Rufus brand colors
const COLORS = {
  purple: "653BEB",
  darkBg: "1C0C45",
  darkSurface: "2A1660",
  white: "FFFFFF",
  lightGray: "E0E0E0",
  mediumGray: "9CA3AF",
  darkGray: "374151",
  neonYellow: "E0E000",
  green: "10B981",
  blue: "3B82F6",
  purpleLight: "8B5CF6",
};

interface Pillar {
  name: string;
  description: string;
  angles: string[];
  key_messages?: string[];
}

interface FunnelStrategy {
  tofu?: string[];
  mofu?: string[];
  bofu?: string[];
}

interface KPI {
  metric: string;
  target: string;
}

interface CreativeConcept {
  name: string;
  description: string;
  formats?: string[];
}

interface SampleScript {
  title: string;
  hook_type?: string;
  hook: string;
  body: string;
  cta?: string;
  format: string;
}

interface CalendarWeek {
  week: string;
  posts: {
    day: string;
    platform: string;
    format: string;
    pillar: string;
    description: string;
  }[];
}

interface MethodologyStep {
  step: string;
  description: string;
  outcome?: string;
}

export interface CaseData {
  work_type: "pitch" | "campaign" | "tactical" | "ongoing";
  active_levels: number[];
  client_name: string;
  client_market?: string;
  industry: string;
  is_active_client?: boolean;
  challenge: string;
  business_objective?: string;
  target_audience?: string;
  platforms: string[];
  diagnosis?: string;
  thesis?: string;
  insights?: string[];
  territory?: string;
  pillars: Pillar[];
  funnel_strategy?: FunnelStrategy;
  kpis?: KPI[];
  creative_concepts?: CreativeConcept[];
  sample_scripts?: SampleScript[];
  content_calendar?: CalendarWeek[];
  creator_strategy?: {
    profile_types?: string[];
    casting_criteria?: string[];
    creative_freedom?: string;
    brand_mandatories?: string[];
    dos_and_donts?: { dos?: string[]; donts?: string[] };
  };
  creator_briefs?: {
    title: string;
    objective?: string;
    key_message?: string;
    format?: string;
    script_guidance?: string;
  }[];
  format_mix?: { platform: string; formats: { type: string; frequency: string }[] }[];
  timeline?: string;
  why_rufus?: string;
  next_steps?: string[];
  // Legacy compat
  diagnosis_process?: string[];
  methodology_steps?: MethodologyStep[];
  learnings?: string[];
}

function addCoverSlide(pptx: PptxGenJS, data: CaseData) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  // Orange accent bar top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.08,
    fill: { color: COLORS.purple },
  });

  // Rufus logo "R"
  slide.addText("R", {
    x: 0.8,
    y: 1.2,
    w: 1.2,
    h: 1.2,
    fontSize: 48,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    align: "center",
    valign: "middle",
    shape: pptx.ShapeType.roundRect,
    rectRadius: 0.2,
    fill: { color: COLORS.darkSurface },
  });

  // Work type label
  const typeLabels: Record<string, string> = {
    pitch: "PITCH",
    campaign: "PROPUESTA DE CAMPAÑA",
    tactical: "ESTRATEGIA TÁCTICA",
    ongoing: "ESTRATEGIA ONGOING",
  };
  slide.addText(typeLabels[data.work_type] || "CASE STUDY", {
    x: 0.8,
    y: 2.8,
    w: 8.4,
    h: 0.4,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 4,
  });

  // Client name
  slide.addText(data.client_name, {
    x: 0.8,
    y: 3.2,
    w: 8.4,
    h: 1.0,
    fontSize: 36,
    fontFace: "Instrument Sans",
    color: COLORS.white,
    bold: true,
  });

  // Industry + platforms + market
  const marketLabel = data.client_market ? ` (${data.client_market})` : "";
  slide.addText(
    `${data.industry}${marketLabel} — ${data.platforms.join(", ")}`,
    {
      x: 0.8,
      y: 4.2,
      w: 8.4,
      h: 0.5,
      fontSize: 14,
      fontFace: "Instrument Sans",
      color: COLORS.mediumGray,
    }
  );

  // Rufus Social footer
  slide.addText("RUFUS SOCIAL — Creative Builder", {
    x: 0.8,
    y: 6.8,
    w: 8.4,
    h: 0.3,
    fontSize: 10,
    fontFace: "Instrument Sans",
    color: COLORS.mediumGray,
    align: "left",
  });
}

function addChallengeSlide(pptx: PptxGenJS, data: CaseData) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("EL DESAFÍO", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  slide.addText(data.challenge, {
    x: 0.8,
    y: 1.4,
    w: 8.4,
    h: 2.5,
    fontSize: 18,
    fontFace: "Instrument Sans",
    color: COLORS.white,
    lineSpacingMultiple: 1.4,
  });

  // Platforms chips
  if (data.platforms.length > 0) {
    slide.addText("PLATAFORMAS", {
      x: 0.8,
      y: 4.2,
      w: 8.4,
      h: 0.4,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.mediumGray,
      bold: true,
      charSpacing: 2,
    });
    slide.addText(data.platforms.join("  •  "), {
      x: 0.8,
      y: 4.6,
      w: 8.4,
      h: 0.4,
      fontSize: 14,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
    });
  }
}

function addInsightsSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.insights || data.insights.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("INSIGHTS", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  data.insights.forEach((insight, i) => {
    const yPos = 1.4 + i * 1.0;
    if (yPos > 6.0) return;

    slide.addText(`${String(i + 1).padStart(2, "0")}`, {
      x: 0.8,
      y: yPos,
      w: 0.6,
      h: 0.7,
      fontSize: 20,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
      valign: "top",
    });

    slide.addText(insight, {
      x: 1.6,
      y: yPos,
      w: 7.6,
      h: 0.7,
      fontSize: 14,
      fontFace: "Instrument Sans",
      color: COLORS.white,
      lineSpacingMultiple: 1.3,
      valign: "top",
    });
  });
}

function addTerritorySlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.territory) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("TERRITORIO DE MARCA", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  // Big territory statement
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.8,
    w: 8.4,
    h: 2.5,
    fill: { color: COLORS.darkSurface },
    rectRadius: 0.15,
  });

  slide.addText(data.territory, {
    x: 1.2,
    y: 1.8,
    w: 7.6,
    h: 2.5,
    fontSize: 20,
    fontFace: "Instrument Sans",
    color: COLORS.white,
    bold: true,
    align: "center",
    valign: "middle",
    lineSpacingMultiple: 1.4,
  });
}

function addPillarsSlides(pptx: PptxGenJS, data: CaseData) {
  // Overview slide
  const overviewSlide = pptx.addSlide();
  overviewSlide.background = { color: COLORS.darkBg };

  overviewSlide.addText("PILARES DE CONTENIDO", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  const pillarColors = [COLORS.purple, COLORS.blue, COLORS.purpleLight, COLORS.green, COLORS.neonYellow];
  const maxPillarsOverview = Math.min(data.pillars.length, 5);
  const colW = 8.4 / maxPillarsOverview;

  data.pillars.slice(0, maxPillarsOverview).forEach((pillar, i) => {
    const xPos = 0.8 + i * colW;
    const color = pillarColors[i % pillarColors.length];

    // Color bar
    overviewSlide.addShape(pptx.ShapeType.rect, {
      x: xPos + 0.1,
      y: 1.4,
      w: colW - 0.2,
      h: 0.06,
      fill: { color },
    });

    overviewSlide.addText(pillar.name.toUpperCase(), {
      x: xPos + 0.1,
      y: 1.6,
      w: colW - 0.2,
      h: 0.5,
      fontSize: 11,
      fontFace: "Instrument Sans",
      color,
      bold: true,
    });

    overviewSlide.addText(pillar.description, {
      x: xPos + 0.1,
      y: 2.1,
      w: colW - 0.2,
      h: 1.5,
      fontSize: 9,
      fontFace: "Instrument Sans",
      color: COLORS.lightGray,
      lineSpacingMultiple: 1.3,
      valign: "top",
    });
  });

  // Detail slide per pillar
  data.pillars.forEach((pillar, i) => {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.darkBg };
    const color = pillarColors[i % pillarColors.length];

    slide.addText(`PILAR ${i + 1}`, {
      x: 0.8,
      y: 0.5,
      w: 3,
      h: 0.4,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.mediumGray,
      charSpacing: 2,
    });

    slide.addText(pillar.name, {
      x: 0.8,
      y: 0.9,
      w: 8.4,
      h: 0.6,
      fontSize: 24,
      fontFace: "Instrument Sans",
      color,
      bold: true,
    });

    slide.addText(pillar.description, {
      x: 0.8,
      y: 1.6,
      w: 8.4,
      h: 0.8,
      fontSize: 13,
      fontFace: "Instrument Sans",
      color: COLORS.lightGray,
      lineSpacingMultiple: 1.3,
    });

    // Angles
    slide.addText("ÁNGULOS CREATIVOS", {
      x: 0.8,
      y: 2.7,
      w: 4,
      h: 0.4,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
      charSpacing: 2,
    });

    pillar.angles.forEach((angle, j) => {
      const yPos = 3.2 + j * 0.45;
      if (yPos > 5.8) return;
      slide.addText(`→  ${angle}`, {
        x: 0.8,
        y: yPos,
        w: 4,
        h: 0.4,
        fontSize: 11,
        fontFace: "Instrument Sans",
        color: COLORS.white,
      });
    });

    // Key messages
    if (pillar.key_messages && pillar.key_messages.length > 0) {
      slide.addText("KEY MESSAGES", {
        x: 5.2,
        y: 2.7,
        w: 4,
        h: 0.4,
        fontSize: 10,
        fontFace: "Instrument Sans",
        color: COLORS.purple,
        bold: true,
        charSpacing: 2,
      });

      pillar.key_messages.forEach((msg, j) => {
        const yPos = 3.2 + j * 0.55;
        if (yPos > 5.8) return;
        slide.addText(`"${msg}"`, {
          x: 5.2,
          y: yPos,
          w: 4,
          h: 0.5,
          fontSize: 10,
          fontFace: "Instrument Sans",
          color: COLORS.lightGray,
          italic: true,
          lineSpacingMultiple: 1.2,
        });
      });
    }
  });
}

function addFunnelSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.funnel_strategy) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("ESTRATEGIA DE FUNNEL", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  const stages = [
    { label: "TOFU — REACH", items: data.funnel_strategy.tofu, color: COLORS.green },
    { label: "MOFU — TRUST", items: data.funnel_strategy.mofu, color: COLORS.blue },
    { label: "BOFU — CONVERT", items: data.funnel_strategy.bofu, color: COLORS.purple },
  ];

  stages.forEach((stage, i) => {
    if (!stage.items || stage.items.length === 0) return;
    const xPos = 0.8 + i * 2.9;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.4,
      w: 2.7,
      h: 4.5,
      fill: { color: COLORS.darkSurface },
      rectRadius: 0.12,
    });

    // Color bar top
    slide.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.4,
      w: 2.7,
      h: 0.06,
      fill: { color: stage.color },
    });

    slide.addText(stage.label, {
      x: xPos + 0.2,
      y: 1.6,
      w: 2.3,
      h: 0.5,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: stage.color,
      bold: true,
      charSpacing: 1,
    });

    stage.items.forEach((item, j) => {
      const yPos = 2.2 + j * 0.55;
      if (yPos > 5.5) return;
      slide.addText(`•  ${item}`, {
        x: xPos + 0.2,
        y: yPos,
        w: 2.3,
        h: 0.5,
        fontSize: 9,
        fontFace: "Instrument Sans",
        color: COLORS.lightGray,
        lineSpacingMultiple: 1.2,
      });
    });
  });
}

function addKPIsSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.kpis || data.kpis.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("KPIs & MÉTRICAS", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  const cols = Math.min(data.kpis.length, 4);
  const colW = 8.4 / cols;

  data.kpis.slice(0, 8).forEach((kpi, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const xPos = 0.8 + col * colW;
    const yPos = 1.6 + row * 2.2;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos + 0.1,
      y: yPos,
      w: colW - 0.2,
      h: 1.8,
      fill: { color: COLORS.darkSurface },
      rectRadius: 0.12,
    });

    slide.addText(kpi.target, {
      x: xPos + 0.1,
      y: yPos + 0.2,
      w: colW - 0.2,
      h: 0.8,
      fontSize: 24,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
      align: "center",
    });

    slide.addText(kpi.metric, {
      x: xPos + 0.1,
      y: yPos + 1.0,
      w: colW - 0.2,
      h: 0.6,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.mediumGray,
      align: "center",
    });
  });
}

function addTimelineSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.timeline) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("TIMELINE", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  slide.addText(data.timeline, {
    x: 0.8,
    y: 1.4,
    w: 8.4,
    h: 4.5,
    fontSize: 13,
    fontFace: "Instrument Sans",
    color: COLORS.lightGray,
    lineSpacingMultiple: 1.5,
    valign: "top",
  });
}

// --- How Rufus Thinks specific slides ---

function addDiagnosisSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.diagnosis_process || data.diagnosis_process.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("PROCESO DE DIAGNÓSTICO", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  slide.addText("¿Qué analizamos?", {
    x: 0.8,
    y: 1.2,
    w: 8.4,
    h: 0.5,
    fontSize: 16,
    fontFace: "Instrument Sans",
    color: COLORS.white,
  });

  data.diagnosis_process.forEach((step, i) => {
    const yPos = 1.9 + i * 0.7;
    if (yPos > 6.0) return;

    slide.addShape(pptx.ShapeType.ellipse, {
      x: 1.0,
      y: yPos + 0.05,
      w: 0.35,
      h: 0.35,
      fill: { color: COLORS.purple },
    });
    slide.addText(`${i + 1}`, {
      x: 1.0,
      y: yPos + 0.05,
      w: 0.35,
      h: 0.35,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    slide.addText(step, {
      x: 1.6,
      y: yPos,
      w: 7.6,
      h: 0.5,
      fontSize: 12,
      fontFace: "Instrument Sans",
      color: COLORS.lightGray,
      lineSpacingMultiple: 1.2,
    });
  });
}

function addMethodologySlides(pptx: PptxGenJS, data: CaseData) {
  if (!data.methodology_steps || data.methodology_steps.length === 0) return;

  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("METODOLOGÍA APLICADA", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  data.methodology_steps.forEach((step, i) => {
    const yPos = 1.4 + i * 1.2;
    if (yPos > 5.5) return;

    slide.addText(step.step, {
      x: 0.8,
      y: yPos,
      w: 8.4,
      h: 0.4,
      fontSize: 14,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
    });
    slide.addText(step.description, {
      x: 0.8,
      y: yPos + 0.4,
      w: 5.5,
      h: 0.5,
      fontSize: 11,
      fontFace: "Instrument Sans",
      color: COLORS.lightGray,
    });
    if (step.outcome) {
      slide.addText(`→ ${step.outcome}`, {
        x: 6.5,
        y: yPos + 0.4,
        w: 2.7,
        h: 0.5,
        fontSize: 10,
        fontFace: "Instrument Sans",
        color: COLORS.green,
        italic: true,
      });
    }
  });
}

function addLearningsSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.learnings || data.learnings.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("APRENDIZAJES & RESULTADOS", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  data.learnings.forEach((learning, i) => {
    const yPos = 1.4 + i * 0.8;
    if (yPos > 6.0) return;

    slide.addText("✓", {
      x: 0.8,
      y: yPos,
      w: 0.4,
      h: 0.5,
      fontSize: 16,
      fontFace: "Instrument Sans",
      color: COLORS.green,
      bold: true,
    });
    slide.addText(learning, {
      x: 1.4,
      y: yPos,
      w: 7.8,
      h: 0.5,
      fontSize: 12,
      fontFace: "Instrument Sans",
      color: COLORS.white,
      lineSpacingMultiple: 1.2,
    });
  });
}

// --- Strategy + Production specific slides ---

function addCreativeConceptsSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.creative_concepts || data.creative_concepts.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("CONCEPTOS CREATIVOS", {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.5,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    charSpacing: 3,
  });

  const conceptColors = [COLORS.purple, COLORS.blue, COLORS.purpleLight];

  data.creative_concepts.forEach((concept, i) => {
    const yPos = 1.4 + i * 1.8;
    if (yPos > 5.5) return;
    const color = conceptColors[i % conceptColors.length];

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 8.4,
      h: 1.5,
      fill: { color: COLORS.darkSurface },
      rectRadius: 0.12,
    });

    slide.addText(`CONCEPTO ${i + 1}`, {
      x: 1.1,
      y: yPos + 0.15,
      w: 2,
      h: 0.3,
      fontSize: 8,
      fontFace: "Instrument Sans",
      color,
      bold: true,
      charSpacing: 2,
    });

    slide.addText(concept.name, {
      x: 1.1,
      y: yPos + 0.4,
      w: 5,
      h: 0.4,
      fontSize: 16,
      fontFace: "Instrument Sans",
      color: COLORS.white,
      bold: true,
    });

    slide.addText(concept.description, {
      x: 1.1,
      y: yPos + 0.8,
      w: 5,
      h: 0.5,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.lightGray,
      lineSpacingMultiple: 1.2,
    });

    if (concept.formats && concept.formats.length > 0) {
      slide.addText(concept.formats.join("  •  "), {
        x: 6.3,
        y: yPos + 0.5,
        w: 2.7,
        h: 0.5,
        fontSize: 9,
        fontFace: "Instrument Sans",
        color,
        align: "right",
      });
    }
  });
}

function addScriptsSlides(pptx: PptxGenJS, data: CaseData) {
  if (!data.sample_scripts || data.sample_scripts.length === 0) return;

  data.sample_scripts.forEach((script, i) => {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.darkBg };

    slide.addText(`GUIÓN ${i + 1} — ${script.format.toUpperCase()}`, {
      x: 0.8,
      y: 0.5,
      w: 8.4,
      h: 0.4,
      fontSize: 10,
      fontFace: "Instrument Sans",
      color: COLORS.mediumGray,
      charSpacing: 2,
    });

    slide.addText(script.title, {
      x: 0.8,
      y: 0.9,
      w: 8.4,
      h: 0.5,
      fontSize: 20,
      fontFace: "Instrument Sans",
      color: COLORS.white,
      bold: true,
    });

    if (script.hook_type) {
      slide.addText(`Hook: ${script.hook_type}`, {
        x: 0.8,
        y: 1.5,
        w: 8.4,
        h: 0.3,
        fontSize: 9,
        fontFace: "Instrument Sans",
        color: COLORS.purple,
        italic: true,
      });
    }

    // Hook section
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 2.0,
      w: 8.4,
      h: 1.2,
      fill: { color: COLORS.darkSurface },
      rectRadius: 0.1,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 2.0,
      w: 0.06,
      h: 1.2,
      fill: { color: COLORS.purple },
    });
    slide.addText("HOOK", {
      x: 1.1,
      y: 2.05,
      w: 2,
      h: 0.3,
      fontSize: 8,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
      charSpacing: 2,
    });
    slide.addText(script.hook, {
      x: 1.1,
      y: 2.35,
      w: 7.8,
      h: 0.8,
      fontSize: 12,
      fontFace: "Instrument Sans",
      color: COLORS.white,
      lineSpacingMultiple: 1.3,
    });

    // Body section
    slide.addText("DESARROLLO", {
      x: 0.8,
      y: 3.4,
      w: 2,
      h: 0.3,
      fontSize: 8,
      fontFace: "Instrument Sans",
      color: COLORS.blue,
      bold: true,
      charSpacing: 2,
    });
    slide.addText(script.body, {
      x: 0.8,
      y: 3.7,
      w: 8.4,
      h: 2.0,
      fontSize: 11,
      fontFace: "Instrument Sans",
      color: COLORS.lightGray,
      lineSpacingMultiple: 1.4,
      valign: "top",
    });

    // CTA
    if (script.cta) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 5.9,
        w: 8.4,
        h: 0.7,
        fill: { color: COLORS.purple },
        rectRadius: 0.1,
      });
      slide.addText(`CTA: ${script.cta}`, {
        x: 1.1,
        y: 5.9,
        w: 7.8,
        h: 0.7,
        fontSize: 12,
        fontFace: "Instrument Sans",
        color: COLORS.white,
        bold: true,
        valign: "middle",
      });
    }
  });
}

function addCalendarSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.content_calendar || data.content_calendar.length === 0) return;

  data.content_calendar.forEach((week) => {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.darkBg };

    slide.addText(`CALENDARIO — ${week.week.toUpperCase()}`, {
      x: 0.8,
      y: 0.6,
      w: 8.4,
      h: 0.5,
      fontSize: 12,
      fontFace: "Instrument Sans",
      color: COLORS.purple,
      bold: true,
      charSpacing: 3,
    });

    // Table header
    const headerY = 1.4;
    const headers = ["DÍA", "PLATAFORMA", "FORMATO", "PILAR", "DESCRIPCIÓN"];
    const colWidths = [1.0, 1.3, 1.2, 1.2, 3.7];
    let xPos = 0.8;

    headers.forEach((header, i) => {
      slide.addText(header, {
        x: xPos,
        y: headerY,
        w: colWidths[i],
        h: 0.4,
        fontSize: 8,
        fontFace: "Instrument Sans",
        color: COLORS.purple,
        bold: true,
        charSpacing: 1,
        fill: { color: COLORS.darkSurface },
      });
      xPos += colWidths[i];
    });

    // Rows
    week.posts.forEach((post, j) => {
      const yPos = 1.8 + j * 0.55;
      if (yPos > 6.2) return;

      const values = [post.day, post.platform, post.format, post.pillar, post.description];
      let cellX = 0.8;
      values.forEach((val, k) => {
        slide.addText(val || "", {
          x: cellX,
          y: yPos,
          w: colWidths[k],
          h: 0.5,
          fontSize: 9,
          fontFace: "Instrument Sans",
          color: COLORS.lightGray,
          valign: "top",
          lineSpacingMultiple: 1.1,
        });
        cellX += colWidths[k];
      });

      // Separator line
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: yPos + 0.5,
        w: 8.4,
        h: 0.01,
        fill: { color: COLORS.darkSurface },
      });
    });
  });
}

function addThesisSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.thesis) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("NUESTRO PUNTO DE VISTA", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.5,
    fontSize: 12, fontFace: "Instrument Sans", color: COLORS.purple, bold: true, charSpacing: 3,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 1.8, w: 8.4, h: 3.0,
    fill: { color: COLORS.darkSurface }, rectRadius: 0.15,
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.8, w: 0.08, h: 3.0,
    fill: { color: COLORS.purple },
  });

  slide.addText(data.thesis, {
    x: 1.3, y: 1.8, w: 7.5, h: 3.0,
    fontSize: 18, fontFace: "Instrument Sans", color: COLORS.white, bold: true,
    align: "left", valign: "middle", lineSpacingMultiple: 1.5,
  });
}

function addDiagnosisDetailSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.diagnosis) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("DIAGNÓSTICO", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.5,
    fontSize: 12, fontFace: "Instrument Sans", color: COLORS.purple, bold: true, charSpacing: 3,
  });

  slide.addText(data.diagnosis, {
    x: 0.8, y: 1.4, w: 8.4, h: 4.5,
    fontSize: 14, fontFace: "Instrument Sans", color: COLORS.lightGray,
    lineSpacingMultiple: 1.5, valign: "top",
  });
}

function addCreatorStrategySlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.creator_strategy) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("ESTRATEGIA DE CREATORS", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.5,
    fontSize: 12, fontFace: "Instrument Sans", color: COLORS.purple, bold: true, charSpacing: 3,
  });

  let yPos = 1.4;

  if (data.creator_strategy.profile_types?.length) {
    slide.addText("PERFILES", {
      x: 0.8, y: yPos, w: 4, h: 0.3,
      fontSize: 9, fontFace: "Instrument Sans", color: COLORS.blue, bold: true, charSpacing: 2,
    });
    yPos += 0.35;
    data.creator_strategy.profile_types.forEach((p) => {
      slide.addText(`→  ${p}`, {
        x: 0.8, y: yPos, w: 4, h: 0.35,
        fontSize: 11, fontFace: "Instrument Sans", color: COLORS.white,
      });
      yPos += 0.35;
    });
    yPos += 0.2;
  }

  if (data.creator_strategy.dos_and_donts) {
    const dd = data.creator_strategy.dos_and_donts;
    if (dd.dos?.length) {
      slide.addText("DO's", {
        x: 5.2, y: 1.4, w: 4, h: 0.3,
        fontSize: 9, fontFace: "Instrument Sans", color: COLORS.green, bold: true, charSpacing: 2,
      });
      dd.dos.forEach((d, i) => {
        slide.addText(`✓  ${d}`, {
          x: 5.2, y: 1.8 + i * 0.4, w: 4, h: 0.35,
          fontSize: 10, fontFace: "Instrument Sans", color: COLORS.lightGray,
        });
      });
    }
    if (dd.donts?.length) {
      const startY = 1.8 + (dd.dos?.length || 0) * 0.4 + 0.3;
      slide.addText("DON'Ts", {
        x: 5.2, y: startY, w: 4, h: 0.3,
        fontSize: 9, fontFace: "Instrument Sans", color: "EF4444", bold: true, charSpacing: 2,
      });
      dd.donts.forEach((d, i) => {
        slide.addText(`✗  ${d}`, {
          x: 5.2, y: startY + 0.35 + i * 0.4, w: 4, h: 0.35,
          fontSize: 10, fontFace: "Instrument Sans", color: COLORS.lightGray,
        });
      });
    }
  }
}

function addWhyRufusSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.why_rufus) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("POR QUÉ RUFUS", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.5,
    fontSize: 12, fontFace: "Instrument Sans", color: COLORS.purple, bold: true, charSpacing: 3,
  });

  slide.addText(data.why_rufus, {
    x: 0.8, y: 1.4, w: 8.4, h: 4.0,
    fontSize: 16, fontFace: "Instrument Sans", color: COLORS.white,
    lineSpacingMultiple: 1.5, valign: "top",
  });
}

function addNextStepsSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.next_steps || data.next_steps.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("NEXT STEPS", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.5,
    fontSize: 12, fontFace: "Instrument Sans", color: COLORS.purple, bold: true, charSpacing: 3,
  });

  data.next_steps.forEach((step, i) => {
    const yPos = 1.4 + i * 0.8;
    if (yPos > 6.0) return;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8, y: yPos, w: 0.5, h: 0.5,
      fill: { color: COLORS.purple }, rectRadius: 0.08,
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: yPos, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: "Instrument Sans", color: COLORS.white, bold: true,
      align: "center", valign: "middle",
    });
    slide.addText(step, {
      x: 1.6, y: yPos, w: 7.6, h: 0.5,
      fontSize: 13, fontFace: "Instrument Sans", color: COLORS.white,
      lineSpacingMultiple: 1.2,
    });
  });
}

function addFormatMixSlide(pptx: PptxGenJS, data: CaseData) {
  if (!data.format_mix || data.format_mix.length === 0) return;
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("MIX DE FORMATOS POR PLATAFORMA", {
    x: 0.8, y: 0.6, w: 8.4, h: 0.5,
    fontSize: 12, fontFace: "Instrument Sans", color: COLORS.purple, bold: true, charSpacing: 3,
  });

  const platformColors = [COLORS.purple, COLORS.blue, COLORS.purpleLight, COLORS.green];
  const colW = Math.min(8.4 / data.format_mix.length, 2.8);

  data.format_mix.forEach((pm, i) => {
    const xPos = 0.8 + i * colW;
    const color = platformColors[i % platformColors.length];

    slide.addText(pm.platform.toUpperCase(), {
      x: xPos + 0.1, y: 1.4, w: colW - 0.2, h: 0.4,
      fontSize: 11, fontFace: "Instrument Sans", color, bold: true,
    });

    pm.formats.forEach((f, j) => {
      const yPos = 1.9 + j * 0.5;
      if (yPos > 6.0) return;
      slide.addText(`${f.type} — ${f.frequency}`, {
        x: xPos + 0.1, y: yPos, w: colW - 0.2, h: 0.45,
        fontSize: 10, fontFace: "Instrument Sans", color: COLORS.lightGray,
      });
    });
  });
}

function addClosingSlide(pptx: PptxGenJS, data: CaseData) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.darkBg };

  slide.addText("R", {
    x: 4.0,
    y: 1.8,
    w: 2.0,
    h: 2.0,
    fontSize: 72,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    bold: true,
    align: "center",
    valign: "middle",
    shape: pptx.ShapeType.roundRect,
    rectRadius: 0.3,
    fill: { color: COLORS.darkSurface },
  });

  slide.addText("Rufus Social", {
    x: 0.8,
    y: 4.2,
    w: 8.4,
    h: 0.6,
    fontSize: 24,
    fontFace: "Instrument Sans",
    color: COLORS.white,
    bold: true,
    align: "center",
  });

  slide.addText("Social First. Native First. Data-Informed.", {
    x: 0.8,
    y: 4.8,
    w: 8.4,
    h: 0.4,
    fontSize: 12,
    fontFace: "Instrument Sans",
    color: COLORS.mediumGray,
    align: "center",
  });

  slide.addText(`Caso preparado para ${data.client_name}`, {
    x: 0.8,
    y: 5.6,
    w: 8.4,
    h: 0.4,
    fontSize: 11,
    fontFace: "Instrument Sans",
    color: COLORS.purple,
    align: "center",
  });
}

export async function generateCase(data: CaseData): Promise<Buffer> {
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Rufus Social — Creative Builder";
  pptx.title = `${data.client_name} — Case`;
  pptx.subject = data.work_type;

  const levels = new Set(data.active_levels || [1, 2, 3]);

  // === Build slides based on work_type + active_levels ===

  // All types get cover + challenge
  addCoverSlide(pptx, data);
  addChallengeSlide(pptx, data);

  if (data.work_type === "pitch") {
    // PITCH flow: diagnóstico → insight → thesis → pilares → concepto → plan → why rufus → next steps
    addDiagnosisDetailSlide(pptx, data);
    addInsightsSlide(pptx, data);
    addThesisSlide(pptx, data);
    addPillarsSlides(pptx, data);
    if (levels.has(2)) addCreativeConceptsSlide(pptx, data);
    addFunnelSlide(pptx, data);
    if (levels.has(3)) { addFormatMixSlide(pptx, data); addCalendarSlide(pptx, data); }
    if (levels.has(4)) addCreatorStrategySlide(pptx, data);
    if (levels.has(5)) addScriptsSlides(pptx, data);
    addKPIsSlide(pptx, data);
    addTimelineSlide(pptx, data);
    addWhyRufusSlide(pptx, data);
    addNextStepsSlide(pptx, data);
  } else if (data.work_type === "campaign" || data.work_type === "tactical") {
    // CAMPAÑA / TÁCTICA: contexto → insight → concepto → plan → creators → timeline → KPIs
    addDiagnosisDetailSlide(pptx, data);
    addInsightsSlide(pptx, data);
    addTerritorySlide(pptx, data);
    if (levels.has(2)) addCreativeConceptsSlide(pptx, data);
    addPillarsSlides(pptx, data);
    addFunnelSlide(pptx, data);
    if (levels.has(3)) { addFormatMixSlide(pptx, data); addCalendarSlide(pptx, data); }
    if (levels.has(4)) addCreatorStrategySlide(pptx, data);
    if (levels.has(5)) addScriptsSlides(pptx, data);
    addTimelineSlide(pptx, data);
    addKPIsSlide(pptx, data);
    addNextStepsSlide(pptx, data);
  } else {
    // ONGOING: diagnóstico → estrategia → pilares → mix → modelo → KPIs
    addDiagnosisDetailSlide(pptx, data);
    addInsightsSlide(pptx, data);
    addThesisSlide(pptx, data);
    addTerritorySlide(pptx, data);
    addPillarsSlides(pptx, data);
    addFunnelSlide(pptx, data);
    if (levels.has(3)) { addFormatMixSlide(pptx, data); addCalendarSlide(pptx, data); }
    if (levels.has(4)) addCreatorStrategySlide(pptx, data);
    if (levels.has(5)) addScriptsSlides(pptx, data);
    addKPIsSlide(pptx, data);
    addTimelineSlide(pptx, data);
    addNextStepsSlide(pptx, data);
  }

  addClosingSlide(pptx, data);

  // Generate as base64 then convert to Buffer
  const base64 = (await pptx.write({ outputType: "base64" })) as string;
  return Buffer.from(base64, "base64");
}
