import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  ShadingType,
  PageBreak,
  Tab,
} from "docx";

// ─── Brand constants ────────────────────────────────────────────
const PURPLE = "653BEB";
const DARK_BG = "1C0C45";
const NEON_YELLOW = "E0E000";
const FONT = "Calibri";

// ─── Shared helpers ─────────────────────────────────────────────

function brandHeader(title: string, subtitle?: string): Paragraph[] {
  const items: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: "RUFUS SOCIAL",
          font: FONT,
          size: 20,
          color: PURPLE,
          bold: true,
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          font: FONT,
          size: 48,
          color: DARK_BG,
          bold: true,
        }),
      ],
      spacing: { after: subtitle ? 100 : 400 },
    }),
  ];
  if (subtitle) {
    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            font: FONT,
            size: 24,
            color: "666666",
          }),
        ],
        spacing: { after: 400 },
      })
    );
  }
  return items;
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT,
        size: 28,
        color: PURPLE,
        bold: true,
      }),
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: PURPLE },
    },
  });
}

function bodyText(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text, font: FONT, size: 22, color: "333333" }),
    ],
    spacing: { after: 150 },
  });
}

function bulletPoint(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `• ${text}`, font: FONT, size: 22, color: "333333" }),
    ],
    spacing: { after: 80 },
    indent: { left: 360 },
  });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, font: FONT, size: 22, color: PURPLE, bold: true }),
      new TextRun({ text: value, font: FONT, size: 22, color: "333333" }),
    ],
    spacing: { after: 100 },
  });
}

function divider(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
    },
  });
}

// ─── Data interfaces (reuse from CaseData) ──────────────────────

export interface DeliverableData {
  client_name: string;
  work_type: string;
  challenge?: string;
  diagnosis?: string;
  thesis?: string;
  insights?: string[];
  territory?: string;
  platforms?: string[];
  target_audience?: string;
  business_objective?: string;
  pillars?: {
    name: string;
    description: string;
    angles?: string[];
    key_messages?: string[];
  }[];
  creative_concepts?: {
    name: string;
    description: string;
    platform_translations?: { platform: string; execution: string }[];
    formats?: string[];
  }[];
  funnel_strategy?: {
    tofu?: string[];
    mofu?: string[];
    bofu?: string[];
  };
  kpis?: { metric: string; target: string }[];
  content_calendar?: {
    week: string;
    posts: {
      day: string;
      platform: string;
      format: string;
      pillar: string;
      description: string;
    }[];
  }[];
  format_mix?: {
    platform: string;
    formats: { type: string; frequency: string }[];
  }[];
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
  sample_scripts?: {
    title: string;
    hook_type?: string;
    hook: string;
    body: string;
    cta?: string;
    format: string;
    visual_notes?: string;
  }[];
  timeline?: string;
  next_steps?: string[];
  // One-pager specific
  one_pager_summary?: string;
}

// ─── 1. GUÍA (full strategy guide) ─────────────────────────────

export async function generateGuia(data: DeliverableData): Promise<Buffer> {
  const sections: Paragraph[] = [
    ...brandHeader(
      `Guía Estratégica: ${data.client_name}`,
      `${data.work_type.toUpperCase()} — Documento de trabajo`
    ),

    // Challenge
    sectionHeading("Desafío"),
    bodyText(data.challenge || "Por definir"),

    // Diagnosis
    sectionHeading("Diagnóstico"),
    bodyText(data.diagnosis || "Por definir"),

    // Thesis
    sectionHeading("Thesis"),
    bodyText(data.thesis || "Por definir"),

    // Insights
    ...(data.insights?.length
      ? [sectionHeading("Insights clave"), ...data.insights.map(bulletPoint)]
      : []),

    // Territory
    ...(data.territory
      ? [sectionHeading("Territorio de marca"), bodyText(data.territory)]
      : []),

    // Pillars
    ...(data.pillars?.length
      ? [
          sectionHeading("Pilares de contenido"),
          ...data.pillars.flatMap((p, i) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${i + 1}. ${p.name}`,
                  font: FONT,
                  size: 24,
                  color: PURPLE,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            bodyText(p.description),
            ...(p.angles?.length
              ? [
                  labelValue("Ángulos", ""),
                  ...p.angles.map(bulletPoint),
                ]
              : []),
            ...(p.key_messages?.length
              ? [
                  labelValue("Key Messages", ""),
                  ...p.key_messages.map(bulletPoint),
                ]
              : []),
          ]),
        ]
      : []),

    // Funnel
    ...(data.funnel_strategy
      ? [
          sectionHeading("Estrategia de Funnel"),
          ...(data.funnel_strategy.tofu?.length
            ? [labelValue("TOFU (Reach)", ""), ...data.funnel_strategy.tofu.map(bulletPoint)]
            : []),
          ...(data.funnel_strategy.mofu?.length
            ? [labelValue("MOFU (Trust)", ""), ...data.funnel_strategy.mofu.map(bulletPoint)]
            : []),
          ...(data.funnel_strategy.bofu?.length
            ? [labelValue("BOFU (Convert)", ""), ...data.funnel_strategy.bofu.map(bulletPoint)]
            : []),
        ]
      : []),

    // KPIs
    ...(data.kpis?.length
      ? [
          sectionHeading("KPIs"),
          ...data.kpis.map((k) => labelValue(k.metric, k.target)),
        ]
      : []),

    // Creative concepts
    ...(data.creative_concepts?.length
      ? [
          sectionHeading("Conceptos creativos"),
          ...data.creative_concepts.flatMap((c, i) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Concepto ${i + 1}: ${c.name}`,
                  font: FONT,
                  size: 24,
                  color: PURPLE,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            bodyText(c.description),
            ...(c.platform_translations?.length
              ? c.platform_translations.map((pt) =>
                  labelValue(pt.platform, pt.execution)
                )
              : []),
          ]),
        ]
      : []),

    // Timeline
    ...(data.timeline
      ? [sectionHeading("Timeline"), bodyText(data.timeline)]
      : []),

    // Next steps
    ...(data.next_steps?.length
      ? [sectionHeading("Próximos pasos"), ...data.next_steps.map(bulletPoint)]
      : []),
  ];

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 2. GUIONES / SCRIPTS ──────────────────────────────────────

export async function generateGuiones(data: DeliverableData): Promise<Buffer> {
  const scripts = data.sample_scripts || [];

  const sections: Paragraph[] = [
    ...brandHeader(
      `Guiones: ${data.client_name}`,
      `${scripts.length} guiones de producción`
    ),
  ];

  scripts.forEach((s, i) => {
    sections.push(
      divider(),
      new Paragraph({
        children: [
          new TextRun({
            text: `GUIÓN ${i + 1}: ${s.title.toUpperCase()}`,
            font: FONT,
            size: 28,
            color: PURPLE,
            bold: true,
          }),
        ],
        spacing: { before: 300, after: 200 },
      }),
      labelValue("Formato", s.format),
      ...(s.hook_type ? [labelValue("Tipo de hook", s.hook_type)] : []),
      new Paragraph({ spacing: { after: 100 } }),
      new Paragraph({
        children: [
          new TextRun({ text: "HOOK", font: FONT, size: 20, color: NEON_YELLOW, bold: true }),
        ],
        shading: { type: ShadingType.SOLID, color: DARK_BG },
        spacing: { after: 50 },
      }),
      bodyText(s.hook),
      new Paragraph({
        children: [
          new TextRun({ text: "DESARROLLO", font: FONT, size: 20, color: "FFFFFF", bold: true }),
        ],
        shading: { type: ShadingType.SOLID, color: PURPLE },
        spacing: { after: 50 },
      }),
      bodyText(s.body),
      ...(s.cta
        ? [
            new Paragraph({
              children: [
                new TextRun({ text: "CTA", font: FONT, size: 20, color: DARK_BG, bold: true }),
              ],
              shading: { type: ShadingType.SOLID, color: NEON_YELLOW },
              spacing: { after: 50 },
            }),
            bodyText(s.cta),
          ]
        : []),
      ...(s.visual_notes
        ? [labelValue("Notas visuales", s.visual_notes)]
        : [])
    );
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 3. CREATOR BRIEFS ─────────────────────────────────────────

export async function generateCreatorBriefs(data: DeliverableData): Promise<Buffer> {
  const briefs = data.creator_briefs || [];
  const strategy = data.creator_strategy;

  const sections: Paragraph[] = [
    ...brandHeader(
      `Creator Briefs: ${data.client_name}`,
      `${briefs.length} briefs para creators`
    ),
  ];

  // Strategy overview
  if (strategy) {
    sections.push(
      sectionHeading("Estrategia de Creators"),
      ...(strategy.profile_types?.length
        ? [labelValue("Perfiles", strategy.profile_types.join(", "))]
        : []),
      ...(strategy.casting_criteria?.length
        ? [
            labelValue("Criterios de casting", ""),
            ...strategy.casting_criteria.map(bulletPoint),
          ]
        : []),
      ...(strategy.creative_freedom
        ? [labelValue("Libertad creativa", strategy.creative_freedom)]
        : []),
      ...(strategy.brand_mandatories?.length
        ? [
            labelValue("Mandatorios de marca", ""),
            ...strategy.brand_mandatories.map(bulletPoint),
          ]
        : []),
      ...(strategy.dos_and_donts
        ? [
            ...(strategy.dos_and_donts.dos?.length
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "✓ DO's", font: FONT, size: 22, color: "10B981", bold: true }),
                    ],
                    spacing: { before: 150 },
                  }),
                  ...strategy.dos_and_donts.dos.map(bulletPoint),
                ]
              : []),
            ...(strategy.dos_and_donts.donts?.length
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "✗ DON'Ts", font: FONT, size: 22, color: "EF4444", bold: true }),
                    ],
                    spacing: { before: 150 },
                  }),
                  ...strategy.dos_and_donts.donts.map(bulletPoint),
                ]
              : []),
          ]
        : [])
    );
  }

  // Individual briefs
  briefs.forEach((b, i) => {
    sections.push(
      divider(),
      new Paragraph({
        children: [
          new TextRun({
            text: `BRIEF ${i + 1}: ${b.title.toUpperCase()}`,
            font: FONT,
            size: 26,
            color: PURPLE,
            bold: true,
          }),
        ],
        spacing: { before: 300, after: 150 },
      }),
      ...(b.objective ? [labelValue("Objetivo", b.objective)] : []),
      ...(b.key_message ? [labelValue("Key message", b.key_message)] : []),
      ...(b.format ? [labelValue("Formato", b.format)] : []),
      ...(b.script_guidance
        ? [
            sectionHeading("Guía de guión"),
            bodyText(b.script_guidance),
          ]
        : [])
    );
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 4. ONE PAGER ──────────────────────────────────────────────

export async function generateOnePager(data: DeliverableData): Promise<Buffer> {
  const sections: Paragraph[] = [
    ...brandHeader(`${data.client_name}`, `One Pager — Concepto creativo`),

    // Challenge (brief)
    ...(data.challenge
      ? [sectionHeading("El desafío"), bodyText(data.challenge)]
      : []),

    // Thesis (the core idea)
    ...(data.thesis
      ? [sectionHeading("Nuestra visión"), bodyText(data.thesis)]
      : []),

    // Creative concept(s) — just the first one for a one-pager
    ...(data.creative_concepts?.length
      ? [
          sectionHeading("Concepto creativo"),
          new Paragraph({
            children: [
              new TextRun({
                text: data.creative_concepts[0].name,
                font: FONT,
                size: 32,
                color: PURPLE,
                bold: true,
              }),
            ],
            spacing: { after: 150 },
          }),
          bodyText(data.creative_concepts[0].description),
          ...(data.creative_concepts[0].platform_translations?.length
            ? [
                new Paragraph({ spacing: { after: 100 } }),
                ...data.creative_concepts[0].platform_translations.map((pt) =>
                  labelValue(pt.platform, pt.execution)
                ),
              ]
            : []),
        ]
      : []),

    // Pillars (condensed)
    ...(data.pillars?.length
      ? [
          sectionHeading("Pilares"),
          ...data.pillars.map((p) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${p.name}: `, font: FONT, size: 22, color: PURPLE, bold: true }),
                new TextRun({ text: p.description, font: FONT, size: 22, color: "333333" }),
              ],
              spacing: { after: 100 },
            })
          ),
        ]
      : []),

    // Summary if provided
    ...(data.one_pager_summary
      ? [sectionHeading("Resumen ejecutivo"), bodyText(data.one_pager_summary)]
      : []),

    // Next steps
    ...(data.next_steps?.length
      ? [sectionHeading("Próximos pasos"), ...data.next_steps.map(bulletPoint)]
      : []),
  ];

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 5. STRATEGY CANVAS ────────────────────────────────────────

export async function generateStrategyCanvas(data: DeliverableData): Promise<Buffer> {
  const sections: Paragraph[] = [
    ...brandHeader(
      `Strategy Canvas: ${data.client_name}`,
      `Mapa estratégico integral`
    ),

    // Row 1: Challenge + Diagnosis
    sectionHeading("Contexto"),
    labelValue("Desafío", data.challenge || "—"),
    labelValue("Diagnóstico", data.diagnosis || "—"),
    labelValue("Objetivo de negocio", data.business_objective || "—"),
    labelValue("Audiencia", data.target_audience || "—"),
    labelValue("Plataformas", data.platforms?.join(", ") || "—"),

    divider(),

    // Row 2: Strategy
    sectionHeading("Estrategia"),
    labelValue("Thesis", data.thesis || "—"),
    labelValue("Territorio", data.territory || "—"),
    ...(data.insights?.length
      ? [labelValue("Insights", ""), ...data.insights.map(bulletPoint)]
      : []),

    divider(),

    // Row 3: Pillars
    ...(data.pillars?.length
      ? [
          sectionHeading("Pilares de contenido"),
          ...data.pillars.flatMap((p) => [
            new Paragraph({
              children: [
                new TextRun({ text: `▸ ${p.name}`, font: FONT, size: 22, color: PURPLE, bold: true }),
                new TextRun({ text: ` — ${p.description}`, font: FONT, size: 22, color: "333333" }),
              ],
              spacing: { after: 80 },
            }),
          ]),
          divider(),
        ]
      : []),

    // Row 4: Funnel
    ...(data.funnel_strategy
      ? [
          sectionHeading("Funnel"),
          ...(data.funnel_strategy.tofu?.length
            ? [labelValue("TOFU", data.funnel_strategy.tofu.join(" / "))]
            : []),
          ...(data.funnel_strategy.mofu?.length
            ? [labelValue("MOFU", data.funnel_strategy.mofu.join(" / "))]
            : []),
          ...(data.funnel_strategy.bofu?.length
            ? [labelValue("BOFU", data.funnel_strategy.bofu.join(" / "))]
            : []),
          divider(),
        ]
      : []),

    // Row 5: KPIs
    ...(data.kpis?.length
      ? [
          sectionHeading("KPIs"),
          ...data.kpis.map((k) => labelValue(k.metric, k.target)),
        ]
      : []),
  ];

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 6. BRIEF TEMPLATE (for client approval) ───────────────────

export async function generateBriefTemplate(data: DeliverableData): Promise<Buffer> {
  const sections: Paragraph[] = [
    ...brandHeader(`Brief de aprobación`, `${data.client_name} — Para revisión del cliente`),

    sectionHeading("1. Información general"),
    labelValue("Cliente", data.client_name),
    labelValue("Tipo de trabajo", data.work_type),
    labelValue("Plataformas", data.platforms?.join(", ") || "—"),
    labelValue("Audiencia objetivo", data.target_audience || "—"),

    divider(),

    sectionHeading("2. Objetivo"),
    bodyText(data.business_objective || data.challenge || "—"),

    divider(),

    sectionHeading("3. Estrategia propuesta"),
    bodyText(data.thesis || "—"),

    ...(data.pillars?.length
      ? [
          divider(),
          sectionHeading("4. Pilares de contenido"),
          ...data.pillars.flatMap((p, i) => [
            labelValue(`Pilar ${i + 1}`, p.name),
            bodyText(p.description),
          ]),
        ]
      : []),

    ...(data.creative_concepts?.length
      ? [
          divider(),
          sectionHeading("5. Concepto creativo"),
          ...data.creative_concepts.flatMap((c) => [
            labelValue("Nombre", c.name),
            bodyText(c.description),
          ]),
        ]
      : []),

    divider(),

    sectionHeading("Aprobación"),
    new Paragraph({ spacing: { after: 300 } }),
    labelValue("Aprobado por", "________________________________"),
    new Paragraph({ spacing: { after: 100 } }),
    labelValue("Fecha", "________________________________"),
    new Paragraph({ spacing: { after: 100 } }),
    labelValue("Comentarios", ""),
    new Paragraph({
      children: [
        new TextRun({ text: "________________________________", font: FONT, size: 22, color: "999999" }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "________________________________", font: FONT, size: 22, color: "999999" }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "________________________________", font: FONT, size: 22, color: "999999" }),
      ],
    }),
  ];

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── Export map ─────────────────────────────────────────────────

export type DocxDeliverableType =
  | "guia"
  | "guiones"
  | "creator_briefs"
  | "one_pager"
  | "strategy_canvas"
  | "brief_template";

const GENERATORS: Record<DocxDeliverableType, (data: DeliverableData) => Promise<Buffer>> = {
  guia: generateGuia,
  guiones: generateGuiones,
  creator_briefs: generateCreatorBriefs,
  one_pager: generateOnePager,
  strategy_canvas: generateStrategyCanvas,
  brief_template: generateBriefTemplate,
};

export async function generateDocx(
  type: DocxDeliverableType,
  data: DeliverableData
): Promise<Buffer> {
  const generator = GENERATORS[type];
  if (!generator) throw new Error(`Unknown DOCX deliverable type: ${type}`);
  return generator(data);
}

export const DOCX_LABELS: Record<DocxDeliverableType, string> = {
  guia: "Guía estratégica",
  guiones: "Guiones / Scripts",
  creator_briefs: "Creator Briefs",
  one_pager: "One Pager",
  strategy_canvas: "Strategy Canvas",
  brief_template: "Brief de aprobación",
};
