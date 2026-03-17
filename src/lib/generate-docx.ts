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
  // Avatar (AU1)
  avatars?: {
    name: string;
    age?: string;
    gender?: string;
    location?: string;
    occupation?: string;
    life_stage?: string;
    socioeconomic_level?: string;
    values?: string[];
    self_identity?: string;
    fears?: string[];
    frustrations?: string[];
    aspirations?: string[];
    primary_motivator?: string;
    secondary_motivator?: string;
    anti_motivator?: string;
    digital_platforms?: string[];
    content_habits?: string;
    influences?: string[];
    purchase_journey?: string;
    device?: string;
    tone?: string;
    phrases_would_say?: string[];
    phrases_would_never_say?: string[];
    problem_in_own_words?: string;
    awareness_level?: string;
    hooks_that_work?: string[];
    recommended_building_blocks?: string[];
    copy_tone?: string;
    objections_to_break?: string[];
  }[];
  // Messaging Matrix (AU2)
  messaging_matrix?: {
    rows?: {
      avatar_name: string;
      motivator?: string;
      pain?: string;
      hook_style?: string;
      angle?: string;
      tone?: string;
      platform?: string;
      cta?: string;
      copy_framework?: string;
    }[];
  };
  // Content Strategy (O1)
  organic_strategy?: {
    content_pillars?: {
      name: string;
      description: string;
      function?: string;
      percentage?: string;
      sample_topics?: string[];
    }[];
    format_mix?: {
      platform: string;
      formats: { type: string; frequency: string }[];
    }[];
    tone?: string;
    realtime_strategy?: string;
    weekly_template?: string;
    kpis?: { metric: string; target: string }[];
  };
  // Social Brief (O3)
  social_briefs?: {
    pillar: string;
    format: string;
    platform: string;
    concept: string;
    hook?: string;
    copy?: string;
    visual_direction?: string;
    cta?: string;
    hashtags?: string[];
    publish_date?: string;
  }[];
  // Organic Creator Briefs (O4)
  organic_creator_briefs?: {
    title: string;
    objective?: string;
    key_message?: string;
    format?: string;
    platform?: string;
    tone?: string;
    content_pillar?: string;
    creative_freedom?: string;
    engagement_goal?: string;
    dos?: string[];
    donts?: string[];
    script_guidance?: string;
    hashtags?: string[];
  }[];
  // Reel Scripts (O5)
  reel_scripts?: {
    title: string;
    platform?: string;
    hook: string;
    body: string;
    cta?: string;
    trending_audio?: string;
    visual_notes?: string;
    text_overlays?: string[];
    duration?: string;
    content_pillar?: string;
    caption?: string;
    hashtags?: string[];
  }[];
  // Carousels (O6)
  carousels?: {
    title: string;
    platform?: string;
    content_pillar?: string;
    slides: {
      slide_number: number;
      type?: string;
      headline: string;
      body?: string;
      visual_direction?: string;
    }[];
    caption?: string;
    hashtags?: string[];
  }[];
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

// ─── 7. AVATAR (AU1) ────────────────────────────────────────────

export async function generateAvatar(data: DeliverableData): Promise<Buffer> {
  const avatars = data.avatars || [];

  const sections: Paragraph[] = [
    ...brandHeader(
      `Avatars de Audiencia: ${data.client_name}`,
      `${avatars.length} avatar${avatars.length !== 1 ? "s" : ""} — Base para ads y orgánico`
    ),
  ];

  avatars.forEach((avatar, i) => {
    if (i > 0) {
      sections.push(new Paragraph({ children: [new PageBreak()] }));
    }

    sections.push(
      sectionHeading(`Avatar ${i + 1}: ${avatar.name}`),

      // Identity
      new Paragraph({
        children: [
          new TextRun({ text: "IDENTIDAD", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.age ? [labelValue("Edad", avatar.age)] : []),
      ...(avatar.gender ? [labelValue("Género", avatar.gender)] : []),
      ...(avatar.location ? [labelValue("Ubicación", avatar.location)] : []),
      ...(avatar.occupation ? [labelValue("Ocupación", avatar.occupation)] : []),
      ...(avatar.life_stage ? [labelValue("Etapa de vida", avatar.life_stage)] : []),
      ...(avatar.socioeconomic_level ? [labelValue("NSE", avatar.socioeconomic_level)] : []),

      divider(),

      // Inner World
      new Paragraph({
        children: [
          new TextRun({ text: "MUNDO INTERIOR", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.values?.length ? [labelValue("Valores", avatar.values.join(", "))] : []),
      ...(avatar.self_identity ? [labelValue("Cómo se ve a sí mismo/a", avatar.self_identity)] : []),
      ...(avatar.fears?.length ? [labelValue("Miedos", ""), ...avatar.fears.map(bulletPoint)] : []),
      ...(avatar.frustrations?.length ? [labelValue("Frustraciones", ""), ...avatar.frustrations.map(bulletPoint)] : []),
      ...(avatar.aspirations?.length ? [labelValue("Aspiraciones", ""), ...avatar.aspirations.map(bulletPoint)] : []),

      divider(),

      // Motivators (Life-Force 8)
      new Paragraph({
        children: [
          new TextRun({ text: "MOTIVADORES (LIFE-FORCE 8)", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.primary_motivator ? [labelValue("Motivador primario (emocional)", avatar.primary_motivator)] : []),
      ...(avatar.secondary_motivator ? [labelValue("Motivador secundario (racional)", avatar.secondary_motivator)] : []),

      divider(),

      // Anti-motivator
      new Paragraph({
        children: [
          new TextRun({ text: "ANTI-MOTIVADOR", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        shading: { type: ShadingType.SOLID, color: "FFF3F0" },
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.anti_motivator ? [bodyText(avatar.anti_motivator)] : [bodyText("Por definir")]),

      divider(),

      // Digital Behavior
      new Paragraph({
        children: [
          new TextRun({ text: "COMPORTAMIENTO DIGITAL", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.digital_platforms?.length ? [labelValue("Plataformas", avatar.digital_platforms.join(", "))] : []),
      ...(avatar.content_habits ? [labelValue("Hábitos de consumo", avatar.content_habits)] : []),
      ...(avatar.influences?.length ? [labelValue("Influencias", avatar.influences.join(", "))] : []),
      ...(avatar.purchase_journey ? [labelValue("Journey de compra", avatar.purchase_journey)] : []),
      ...(avatar.device ? [labelValue("Device", avatar.device)] : []),

      divider(),

      // Language
      new Paragraph({
        children: [
          new TextRun({ text: "LENGUAJE", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.tone ? [labelValue("Tono", avatar.tone)] : []),
      ...(avatar.phrases_would_say?.length
        ? [
            labelValue("Frases que diría", ""),
            ...avatar.phrases_would_say.map((p) => bulletPoint(`"${p}"`)),
          ]
        : []),
      ...(avatar.phrases_would_never_say?.length
        ? [
            labelValue("Frases que NUNCA diría", ""),
            ...avatar.phrases_would_never_say.map((p) => bulletPoint(`"${p}"`)),
          ]
        : []),
      ...(avatar.problem_in_own_words
        ? [labelValue("Cómo describe su problema", `"${avatar.problem_in_own_words}"`)]
        : []),

      divider(),

      // Awareness Level
      new Paragraph({
        children: [
          new TextRun({ text: "AWARENESS LEVEL", font: FONT, size: 24, color: PURPLE, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      bodyText(avatar.awareness_level || "Por definir para esta campaña"),

      divider(),

      // Creative Implications
      new Paragraph({
        children: [
          new TextRun({ text: "IMPLICACIONES CREATIVAS", font: FONT, size: 24, color: NEON_YELLOW, bold: true }),
        ],
        shading: { type: ShadingType.SOLID, color: DARK_BG },
        spacing: { before: 200, after: 100 },
      }),
      ...(avatar.hooks_that_work?.length
        ? [labelValue("Hooks que funcionan", ""), ...avatar.hooks_that_work.map(bulletPoint)]
        : []),
      ...(avatar.recommended_building_blocks?.length
        ? [labelValue("Building blocks recomendados", ""), ...avatar.recommended_building_blocks.map(bulletPoint)]
        : []),
      ...(avatar.copy_tone ? [labelValue("Tono de copy", avatar.copy_tone)] : []),
      ...(avatar.objections_to_break?.length
        ? [labelValue("Objeciones a romper", ""), ...avatar.objections_to_break.map(bulletPoint)]
        : []),
    );
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 8. MESSAGING MATRIX (AU2) ─────────────────────────────────

export async function generateMessagingMatrix(data: DeliverableData): Promise<Buffer> {
  const matrix = data.messaging_matrix;
  const rows = matrix?.rows || [];

  const children: (Paragraph | Table)[] = [
    ...brandHeader(
      `Messaging Matrix: ${data.client_name}`,
      `Avatar × Awareness × Angle × Framework`
    ),
  ];

  if (rows.length > 0) {
    // Build table
    const headerCells = [
      "Avatar", "Motivador", "Dolor", "Hook Style", "Angle", "Tono", "Plataforma", "CTA", "Framework"
    ].map(
      (text) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text, font: FONT, size: 18, color: "FFFFFF", bold: true })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { type: ShadingType.SOLID, color: PURPLE },
          width: { size: 1100, type: WidthType.DXA },
        })
    );

    const dataRows = rows.map(
      (r) =>
        new TableRow({
          children: [
            r.avatar_name, r.motivator || "—", r.pain || "—", r.hook_style || "—",
            r.angle || "—", r.tone || "—", r.platform || "—", r.cta || "—", r.copy_framework || "—",
          ].map(
            (val) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: val, font: FONT, size: 18, color: "333333" })],
                  }),
                ],
                width: { size: 1100, type: WidthType.DXA },
              })
          ),
        })
    );

    children.push(
      new Table({
        rows: [new TableRow({ children: headerCells }), ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    );
  } else {
    children.push(bodyText("Matriz vacía — completar con datos de avatars."));
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 9. CONTENT STRATEGY (O1) ──────────────────────────────────

export async function generateContentStrategy(data: DeliverableData): Promise<Buffer> {
  const strategy = data.organic_strategy;

  const sections: Paragraph[] = [
    ...brandHeader(
      `Estrategia de Contenido Orgánico: ${data.client_name}`,
      `Pilares, formatos, tono y calendario`
    ),
  ];

  // Pillars
  if (strategy?.content_pillars?.length) {
    sections.push(sectionHeading("Pilares de contenido"));
    strategy.content_pillars.forEach((p, i) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${i + 1}. ${p.name}`,
              font: FONT, size: 24, color: PURPLE, bold: true,
            }),
            ...(p.function ? [new TextRun({ text: ` — ${p.function}`, font: FONT, size: 22, color: "666666" })] : []),
            ...(p.percentage ? [new TextRun({ text: ` (${p.percentage})`, font: FONT, size: 22, color: "999999" })] : []),
          ],
          spacing: { before: 200, after: 100 },
        }),
        bodyText(p.description),
        ...(p.sample_topics?.length
          ? [labelValue("Temas ejemplo", ""), ...p.sample_topics.map(bulletPoint)]
          : []),
      );
    });
  }

  // Format mix
  if (strategy?.format_mix?.length) {
    sections.push(divider(), sectionHeading("Mix de formatos por plataforma"));
    strategy.format_mix.forEach((pm) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: pm.platform, font: FONT, size: 22, color: PURPLE, bold: true })],
          spacing: { before: 150, after: 80 },
        }),
        ...pm.formats.map((f) => bulletPoint(`${f.type}: ${f.frequency}`)),
      );
    });
  }

  // Tone
  if (strategy?.tone) {
    sections.push(divider(), sectionHeading("Tono"), bodyText(strategy.tone));
  }

  // Weekly template
  if (strategy?.weekly_template) {
    sections.push(divider(), sectionHeading("Grilla semanal tipo"), bodyText(strategy.weekly_template));
  }

  // Real-time strategy
  if (strategy?.realtime_strategy) {
    sections.push(
      divider(),
      sectionHeading("Estrategia Real-Time"),
      bodyText(strategy.realtime_strategy),
    );
  }

  // KPIs
  if (strategy?.kpis?.length) {
    sections.push(divider(), sectionHeading("KPIs orgánicos"));
    strategy.kpis.forEach((k) => sections.push(labelValue(k.metric, k.target)));
  }

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 10. SOCIAL BRIEF (O3) ─────────────────────────────────────

export async function generateSocialBrief(data: DeliverableData): Promise<Buffer> {
  const briefs = data.social_briefs || [];

  const sections: Paragraph[] = [
    ...brandHeader(
      `Social Briefs: ${data.client_name}`,
      `${briefs.length} brief${briefs.length !== 1 ? "s" : ""} de piezas orgánicas`
    ),
  ];

  briefs.forEach((b, i) => {
    sections.push(
      divider(),
      new Paragraph({
        children: [
          new TextRun({
            text: `BRIEF ${i + 1}: ${b.concept.toUpperCase()}`,
            font: FONT, size: 26, color: PURPLE, bold: true,
          }),
        ],
        spacing: { before: 300, after: 150 },
      }),
      labelValue("Pilar", b.pillar),
      labelValue("Formato", b.format),
      labelValue("Plataforma", b.platform),
      labelValue("Concepto", b.concept),
      ...(b.hook ? [labelValue("Hook", b.hook)] : []),
      ...(b.copy ? [sectionHeading("Copy"), bodyText(b.copy)] : []),
      ...(b.visual_direction ? [labelValue("Dirección visual", b.visual_direction)] : []),
      ...(b.cta ? [labelValue("CTA", b.cta)] : []),
      ...(b.hashtags?.length ? [labelValue("Hashtags", b.hashtags.join(" "))] : []),
      ...(b.publish_date ? [labelValue("Fecha de publicación", b.publish_date)] : []),
    );
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 11. ORGANIC CREATOR BRIEF (O4) ────────────────────────────

export async function generateOrganicCreatorBrief(data: DeliverableData): Promise<Buffer> {
  const briefs = data.organic_creator_briefs || [];

  const sections: Paragraph[] = [
    ...brandHeader(
      `Creator Briefs Orgánico: ${data.client_name}`,
      `${briefs.length} brief${briefs.length !== 1 ? "s" : ""} para creators — Contenido orgánico`
    ),
  ];

  briefs.forEach((b, i) => {
    sections.push(
      divider(),
      new Paragraph({
        children: [
          new TextRun({
            text: `BRIEF ${i + 1}: ${b.title.toUpperCase()}`,
            font: FONT, size: 26, color: PURPLE, bold: true,
          }),
        ],
        spacing: { before: 300, after: 150 },
      }),
      ...(b.objective ? [labelValue("Objetivo", b.objective)] : []),
      ...(b.key_message ? [labelValue("Key message", b.key_message)] : []),
      ...(b.format ? [labelValue("Formato", b.format)] : []),
      ...(b.platform ? [labelValue("Plataforma", b.platform)] : []),
      ...(b.content_pillar ? [labelValue("Pilar de contenido", b.content_pillar)] : []),
      ...(b.tone ? [labelValue("Tono", b.tone)] : []),
      ...(b.creative_freedom ? [labelValue("Libertad creativa", b.creative_freedom)] : []),
      ...(b.engagement_goal ? [labelValue("Objetivo de engagement", b.engagement_goal)] : []),
      ...(b.dos?.length
        ? [
            new Paragraph({
              children: [new TextRun({ text: "DO's", font: FONT, size: 22, color: "10B981", bold: true })],
              spacing: { before: 150 },
            }),
            ...b.dos.map(bulletPoint),
          ]
        : []),
      ...(b.donts?.length
        ? [
            new Paragraph({
              children: [new TextRun({ text: "DON'Ts", font: FONT, size: 22, color: "EF4444", bold: true })],
              spacing: { before: 150 },
            }),
            ...b.donts.map(bulletPoint),
          ]
        : []),
      ...(b.script_guidance ? [sectionHeading("Guía de guión"), bodyText(b.script_guidance)] : []),
      ...(b.hashtags?.length ? [labelValue("Hashtags", b.hashtags.join(" "))] : []),
    );
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 12. REEL / TIKTOK SCRIPT (O5) ─────────────────────────────

export async function generateReelScript(data: DeliverableData): Promise<Buffer> {
  const scripts = data.reel_scripts || [];

  const sections: Paragraph[] = [
    ...brandHeader(
      `Scripts Orgánicos: ${data.client_name}`,
      `${scripts.length} guion${scripts.length !== 1 ? "es" : ""} para Reels / TikTok`
    ),
  ];

  scripts.forEach((s, i) => {
    sections.push(
      divider(),
      new Paragraph({
        children: [
          new TextRun({
            text: `GUIÓN ${i + 1}: ${s.title.toUpperCase()}`,
            font: FONT, size: 28, color: PURPLE, bold: true,
          }),
        ],
        spacing: { before: 300, after: 200 },
      }),
      ...(s.platform ? [labelValue("Plataforma", s.platform)] : []),
      ...(s.duration ? [labelValue("Duración", s.duration)] : []),
      ...(s.content_pillar ? [labelValue("Pilar", s.content_pillar)] : []),
      ...(s.trending_audio ? [labelValue("Audio trending", s.trending_audio)] : []),
      new Paragraph({ spacing: { after: 100 } }),

      // Hook
      new Paragraph({
        children: [
          new TextRun({ text: "HOOK", font: FONT, size: 20, color: NEON_YELLOW, bold: true }),
        ],
        shading: { type: ShadingType.SOLID, color: DARK_BG },
        spacing: { after: 50 },
      }),
      bodyText(s.hook),

      // Body
      new Paragraph({
        children: [
          new TextRun({ text: "DESARROLLO", font: FONT, size: 20, color: "FFFFFF", bold: true }),
        ],
        shading: { type: ShadingType.SOLID, color: PURPLE },
        spacing: { after: 50 },
      }),
      bodyText(s.body),

      // CTA
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

      // Text overlays
      ...(s.text_overlays?.length
        ? [labelValue("Text overlays", ""), ...s.text_overlays.map(bulletPoint)]
        : []),

      // Visual notes
      ...(s.visual_notes ? [labelValue("Notas visuales", s.visual_notes)] : []),

      // Caption
      ...(s.caption ? [sectionHeading("Caption"), bodyText(s.caption)] : []),

      // Hashtags
      ...(s.hashtags?.length ? [labelValue("Hashtags", s.hashtags.join(" "))] : []),
    );
  });

  const doc = new Document({
    sections: [{ children: sections }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

// ─── 13. CAROUSEL (O6) ─────────────────────────────────────────

export async function generateCarousel(data: DeliverableData): Promise<Buffer> {
  const carousels = data.carousels || [];

  const sections: Paragraph[] = [
    ...brandHeader(
      `Carruseles: ${data.client_name}`,
      `${carousels.length} carrusel${carousels.length !== 1 ? "es" : ""} — Slide by slide`
    ),
  ];

  carousels.forEach((car, i) => {
    if (i > 0) {
      sections.push(new Paragraph({ children: [new PageBreak()] }));
    }

    sections.push(
      sectionHeading(`Carrusel ${i + 1}: ${car.title}`),
      ...(car.platform ? [labelValue("Plataforma", car.platform)] : []),
      ...(car.content_pillar ? [labelValue("Pilar", car.content_pillar)] : []),
      new Paragraph({ spacing: { after: 150 } }),
    );

    // Slides
    car.slides.forEach((slide) => {
      const slideType = slide.type || "content";
      const bgColor = slideType === "hook" ? DARK_BG : slideType === "cta" ? PURPLE : "F3F0FF";
      const textColor = slideType === "hook" ? NEON_YELLOW : slideType === "cta" ? "FFFFFF" : PURPLE;

      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `SLIDE ${slide.slide_number}${slideType === "hook" ? " — HOOK" : slideType === "cta" ? " — CTA" : ""}`,
              font: FONT, size: 20, color: textColor, bold: true,
            }),
          ],
          shading: { type: ShadingType.SOLID, color: bgColor },
          spacing: { before: 200, after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: slide.headline, font: FONT, size: 24, color: DARK_BG, bold: true }),
          ],
          spacing: { after: 80 },
        }),
        ...(slide.body ? [bodyText(slide.body)] : []),
        ...(slide.visual_direction ? [labelValue("Visual", slide.visual_direction)] : []),
      );
    });

    // Caption
    if (car.caption) {
      sections.push(divider(), sectionHeading("Caption"), bodyText(car.caption));
    }

    // Hashtags
    if (car.hashtags?.length) {
      sections.push(labelValue("Hashtags", car.hashtags.join(" ")));
    }
  });

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
  | "brief_template"
  | "avatar"
  | "messaging_matrix"
  | "content_strategy"
  | "social_brief"
  | "organic_creator_brief"
  | "reel_script"
  | "carousel";

const GENERATORS: Record<DocxDeliverableType, (data: DeliverableData) => Promise<Buffer>> = {
  guia: generateGuia,
  guiones: generateGuiones,
  creator_briefs: generateCreatorBriefs,
  one_pager: generateOnePager,
  strategy_canvas: generateStrategyCanvas,
  brief_template: generateBriefTemplate,
  avatar: generateAvatar,
  messaging_matrix: generateMessagingMatrix,
  content_strategy: generateContentStrategy,
  social_brief: generateSocialBrief,
  organic_creator_brief: generateOrganicCreatorBrief,
  reel_script: generateReelScript,
  carousel: generateCarousel,
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
  avatar: "Avatars de Audiencia",
  messaging_matrix: "Messaging Matrix",
  content_strategy: "Estrategia de Contenido Orgánico",
  social_brief: "Social Briefs",
  organic_creator_brief: "Creator Briefs Orgánico",
  reel_script: "Scripts Reels / TikTok",
  carousel: "Carruseles",
};
