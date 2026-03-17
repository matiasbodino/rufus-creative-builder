import ExcelJS from "exceljs";

// ─── Brand constants ────────────────────────────────────────────
const PURPLE = "653BEB";
const DARK_BG = "1C0C45";
const NEON_YELLOW = "E0E000";
const FONT = "Calibri";

// ─── Shared styling helpers ─────────────────────────────────────

function headerStyle(ws: ExcelJS.Worksheet, row: ExcelJS.Row, colCount: number) {
  row.height = 32;
  row.font = { name: FONT, size: 11, bold: true, color: { argb: "FFFFFFFF" } };
  row.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${PURPLE}` },
    };
    cell.border = {
      bottom: { style: "thin", color: { argb: `FF${DARK_BG}` } },
    };
  }
}

function altRowStyle(row: ExcelJS.Row, colCount: number, isEven: boolean) {
  row.font = { name: FONT, size: 10 };
  row.alignment = { vertical: "middle", wrapText: true };
  if (isEven) {
    for (let i = 1; i <= colCount; i++) {
      row.getCell(i).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F0FF" },
      };
    }
  }
}

function brandTitle(ws: ExcelJS.Worksheet, title: string, colSpan: number) {
  ws.mergeCells(1, 1, 1, colSpan);
  const titleCell = ws.getCell("A1");
  titleCell.value = `RUFUS SOCIAL — ${title.toUpperCase()}`;
  titleCell.font = { name: FONT, size: 14, bold: true, color: { argb: `FF${PURPLE}` } };
  titleCell.alignment = { vertical: "middle" };
  ws.getRow(1).height = 40;

  // Empty row as spacer
  ws.getRow(2).height = 10;
}

// ─── Data interface ─────────────────────────────────────────────

export interface XlsxDeliverableData {
  client_name: string;
  work_type: string;
  campaign_name?: string;
  content_calendar?: {
    week: string;
    posts: {
      day: string;
      platform: string;
      format: string;
      pillar: string;
      description: string;
      hashtags?: string;
      status?: string;
    }[];
  }[];
  storyboards?: {
    scene: number;
    duration: string;
    visual: string;
    audio: string;
    text_overlay?: string;
    notes?: string;
  }[];
  casting_grid?: {
    role: string;
    platform: string;
    follower_range: string;
    niche: string;
    content_style: string;
    budget_range?: string;
    notes?: string;
  }[];
  format_mix?: {
    platform: string;
    formats: { type: string; frequency: string }[];
  }[];
  // Excel pauta (copy outs)
  excel_pauta?: {
    deliveries: {
      name: string;
      audience?: string;
      funnel_stages: {
        stage: string; // AWARENESS, CONSIDERACIÓN, CONVERSIÓN
        pieces: {
          platform: string; // Meta, TikTok, YouTube, DV360, Spotify, Seedtag
          piece_type: string; // Producto, UGC, CRE
          format: string; // VID, CAR, IMG
          version: number;
          copy_fields: {
            field_name: string; // Título, Texto principal, Descripción, Texto, CTA, etc.
            char_limit: number;
            copy: string;
          }[];
          delivery_formats?: string[]; // 1080x1920, 1080x1350, etc.
          slide_descriptions?: string[]; // For carousels
        }[];
      }[];
    }[];
  };
  // Testing matrix
  testing_matrix?: {
    hypothesis?: string;
    variables: {
      hooks?: string[];
      angles?: string[];
      formats?: string[];
      copy_variants?: string[];
      audiences?: string[];
    };
    combinations?: {
      name: string;
      hook: string;
      angle: string;
      format: string;
      copy_variant?: string;
      hypothesis: string;
      priority: string; // Alta, Media, Baja
      metrics: string;
    }[];
    metrics_to_measure?: string[];
  };
}

// ─── 1. CONTENT CALENDAR ────────────────────────────────────────

export async function generateContentCalendar(
  data: XlsxDeliverableData
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rufus Creative Builder";

  const ws = wb.addWorksheet("Calendario", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const cols = ["Semana", "Día", "Plataforma", "Formato", "Pilar", "Descripción", "Hashtags", "Status"];
  brandTitle(ws, `Calendario de Contenido — ${data.client_name}`, cols.length);

  // Column widths
  ws.columns = [
    { width: 14 },
    { width: 12 },
    { width: 14 },
    { width: 16 },
    { width: 18 },
    { width: 50 },
    { width: 25 },
    { width: 14 },
  ];

  // Header row
  const headerRow = ws.addRow(cols);
  headerStyle(ws, headerRow, cols.length);

  // Data
  let rowIdx = 0;
  (data.content_calendar || []).forEach((week) => {
    week.posts.forEach((post) => {
      const row = ws.addRow([
        week.week,
        post.day,
        post.platform,
        post.format,
        post.pillar,
        post.description,
        post.hashtags || "",
        post.status || "Pendiente",
      ]);
      altRowStyle(row, cols.length, rowIdx % 2 === 0);
      rowIdx++;
    });
  });

  // Format mix sheet if available
  if (data.format_mix?.length) {
    const fmWs = wb.addWorksheet("Mix de Formatos");
    const fmCols = ["Plataforma", "Formato", "Frecuencia"];
    brandTitle(fmWs, "Mix de Formatos", fmCols.length);

    fmWs.columns = [{ width: 18 }, { width: 22 }, { width: 18 }];

    const fmHeader = fmWs.addRow(fmCols);
    headerStyle(fmWs, fmHeader, fmCols.length);

    let fmIdx = 0;
    data.format_mix.forEach((pm) => {
      pm.formats.forEach((f) => {
        const row = fmWs.addRow([pm.platform, f.type, f.frequency]);
        altRowStyle(row, fmCols.length, fmIdx % 2 === 0);
        fmIdx++;
      });
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ─── 2. STORYBOARD ─────────────────────────────────────────────

export async function generateStoryboard(
  data: XlsxDeliverableData
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rufus Creative Builder";

  const ws = wb.addWorksheet("Storyboard", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const cols = ["Escena", "Duración", "Visual", "Audio / VO", "Texto overlay", "Notas"];
  brandTitle(ws, `Storyboard — ${data.client_name}`, cols.length);

  ws.columns = [
    { width: 10 },
    { width: 12 },
    { width: 35 },
    { width: 30 },
    { width: 20 },
    { width: 25 },
  ];

  const headerRow = ws.addRow(cols);
  headerStyle(ws, headerRow, cols.length);

  (data.storyboards || []).forEach((s, i) => {
    const row = ws.addRow([
      s.scene,
      s.duration,
      s.visual,
      s.audio,
      s.text_overlay || "",
      s.notes || "",
    ]);
    altRowStyle(row, cols.length, i % 2 === 0);
    row.height = 40;
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ─── 3. CASTING GRID ───────────────────────────────────────────

export async function generateCastingGrid(
  data: XlsxDeliverableData
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rufus Creative Builder";

  const ws = wb.addWorksheet("Casting Grid", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const cols = ["Rol", "Plataforma", "Seguidores", "Nicho", "Estilo de contenido", "Budget", "Notas"];
  brandTitle(ws, `Casting Grid — ${data.client_name}`, cols.length);

  ws.columns = [
    { width: 18 },
    { width: 14 },
    { width: 16 },
    { width: 18 },
    { width: 28 },
    { width: 14 },
    { width: 25 },
  ];

  const headerRow = ws.addRow(cols);
  headerStyle(ws, headerRow, cols.length);

  (data.casting_grid || []).forEach((c, i) => {
    const row = ws.addRow([
      c.role,
      c.platform,
      c.follower_range,
      c.niche,
      c.content_style,
      c.budget_range || "",
      c.notes || "",
    ]);
    altRowStyle(row, cols.length, i % 2 === 0);
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ─── 4. EXCEL PAUTA (Copy Outs) ─────────────────────────────────

// Platform color map for visual differentiation
const PLATFORM_COLORS: Record<string, string> = {
  Meta: "FF1877F2",
  TikTok: "FF010101",
  YouTube: "FFFF0000",
  DV360: "FF34A853",
  Spotify: "FF1DB954",
  Seedtag: "FF6366F1",
};

// Platform-specific default copy field definitions
const PLATFORM_COPY_FIELDS: Record<string, { field_name: string; char_limit: number }[]> = {
  Meta_VID: [
    { field_name: "Título", char_limit: 25 },
    { field_name: "Texto principal", char_limit: 120 },
    { field_name: "Descripción", char_limit: 120 },
  ],
  Meta_IMG: [
    { field_name: "Título", char_limit: 25 },
    { field_name: "Texto principal", char_limit: 120 },
    { field_name: "Descripción", char_limit: 120 },
  ],
  Meta_CAR: [
    { field_name: "Título", char_limit: 25 },
    { field_name: "Texto principal", char_limit: 120 },
    { field_name: "Descripción", char_limit: 120 },
  ],
  TikTok_VID: [{ field_name: "Texto", char_limit: 100 }],
  TikTok_IMG: [{ field_name: "Texto", char_limit: 100 }],
  YouTube_VID: [
    { field_name: "CTA", char_limit: 10 },
    { field_name: "Título", char_limit: 15 },
  ],
};

const PLATFORM_DELIVERY_FORMATS: Record<string, string[]> = {
  Meta: ["1080x1920", "1080x1350", "1080x1080"],
  TikTok: ["1080x1920"],
  YouTube: ["1920x1080", "1080x1920"],
  DV360: ["120x600", "160x600", "300x250", "300x600", "728x90", "970x250", "320x480"],
  Spotify: ["640x640", "300x250"],
  Seedtag: ["587x330", "350x525", "587x100", "350x80"],
};

function buildNomenclature(
  brand: string,
  deliveryNum: number,
  stage: string,
  platform: string,
  pieceType: string,
  format: string,
  version: number
): string {
  const brandSlug = brand.replace(/\s+/g, "").substring(0, 10).toUpperCase();
  const stageMap: Record<string, string> = {
    AWARENESS: "Awareness",
    "CONSIDERACIÓN": "Consideracion",
    CONSIDERACION: "Consideracion",
    "CONVERSIÓN": "Conversion",
    CONVERSION: "Conversion",
  };
  const stageName = stageMap[stage.toUpperCase()] || stage.replace(/\s+/g, "");
  return `Rufus_${brandSlug}_E${deliveryNum}_${stageName}${platform}${pieceType}_${format}___${version}`;
}

export async function generateExcelPauta(
  data: XlsxDeliverableData
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rufus Creative Builder";

  const campaignName = data.campaign_name || "Campaña";
  const clientName = data.client_name;
  const pauta = data.excel_pauta;

  if (!pauta || !pauta.deliveries || pauta.deliveries.length === 0) {
    // Generate a placeholder structure
    const ws = wb.addWorksheet(`${clientName} | TOC`);
    brandTitle(ws, `${clientName} ${campaignName} | COPY OUTS`, 5);
    ws.columns = [
      { width: 5 },
      { width: 30 },
      { width: 20 },
      { width: 16 },
      { width: 20 },
    ];
    const tocHeader = ws.addRow(["", "ENTREGA", "DRIVE", "STATUS", "EDITABLES"]);
    headerStyle(ws, tocHeader, 5);
    ws.addRow(["", "E1 | AWARENESS", "→ Sheet", "Pendiente", ""]);
    ws.addRow(["", "E1 | CONSIDERACIÓN", "→ Sheet", "Pendiente", ""]);
    altRowStyle(ws.getRow(4), 5, true);
    altRowStyle(ws.getRow(5), 5, false);

    const buffer = await wb.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // ── TOC Tab ──
  const tocWs = wb.addWorksheet(`${clientName} | TOC`.substring(0, 31));
  tocWs.columns = [
    { width: 5 },
    { width: 40 },
    { width: 20 },
    { width: 16 },
    { width: 20 },
  ];
  brandTitle(tocWs, `${clientName} ${campaignName} | COPY OUTS`, 5);
  const tocHeaderRow = tocWs.addRow(["", "ENTREGA", "DRIVE", "STATUS", "EDITABLES"]);
  headerStyle(tocWs, tocHeaderRow, 5);

  let tocRowIdx = 0;
  pauta.deliveries.forEach((delivery, dIdx) => {
    delivery.funnel_stages.forEach((stage) => {
      const row = tocWs.addRow([
        "",
        `E${dIdx + 1} | ${delivery.audience || ""} ${stage.stage.toUpperCase()}`.trim(),
        `→ Sheet`,
        "Pendiente",
        "",
      ]);
      altRowStyle(row, 5, tocRowIdx % 2 === 0);
      tocRowIdx++;
    });
  });

  // ── Per-delivery per-stage tabs ──
  pauta.deliveries.forEach((delivery, dIdx) => {
    delivery.funnel_stages.forEach((stage) => {
      const rawName = `E${dIdx + 1} | ${stage.stage.toUpperCase()}`;
      const sheetName = rawName.substring(0, 31);
      const ws = wb.addWorksheet(sheetName, {
        views: [{ state: "frozen", ySplit: 3 }],
      });

      // Columns: A=Platform, B=Nomenclature, C=Preview, D=Link/Type, E=Formats, F=Copy Type, G=Copy, H=WC, I=Link YT
      ws.columns = [
        { width: 14 },
        { width: 52 },
        { width: 10 },
        { width: 22 },
        { width: 22 },
        { width: 26 },
        { width: 55 },
        { width: 6 },
        { width: 16 },
      ];

      // Header rows
      ws.mergeCells(1, 1, 1, 9);
      const titleCell = ws.getCell("A1");
      titleCell.value = `${clientName} ${campaignName} | ${delivery.audience || ""}`.trim();
      titleCell.font = { name: FONT, size: 13, bold: true, color: { argb: `FF${PURPLE}` } };
      ws.getRow(1).height = 32;

      ws.mergeCells(2, 1, 2, 9);
      const stageCell = ws.getCell("A2");
      stageCell.value = stage.stage.toUpperCase();
      stageCell.font = { name: FONT, size: 11, bold: true, color: { argb: `FF${DARK_BG}` } };
      ws.getRow(2).height = 24;

      const colHeaders = [
        "PLATAFORMA", "NOMENCLATURA", "PREVIEW", "LINK", "FORMATOS",
        "COPY OUTS", "", "", "LINK YOUTUBE",
      ];
      const hRow = ws.addRow(colHeaders);
      headerStyle(ws, hRow, colHeaders.length);

      // Group pieces by platform
      const byPlatform: Record<string, typeof stage.pieces> = {};
      stage.pieces.forEach((piece) => {
        if (!byPlatform[piece.platform]) byPlatform[piece.platform] = [];
        byPlatform[piece.platform].push(piece);
      });

      let currentRow = 4;
      const platformNames = Object.keys(byPlatform);

      platformNames.forEach((platformName) => {
        const pieces = byPlatform[platformName];
        const platformStartRow = currentRow;

        pieces.forEach((piece) => {
          const nomenclature = buildNomenclature(
            clientName,
            dIdx + 1,
            stage.stage,
            platformName,
            piece.piece_type,
            piece.format,
            piece.version
          );

          const deliveryFormats = piece.delivery_formats
            || PLATFORM_DELIVERY_FORMATS[platformName]
            || [];

          // Use provided copy_fields or fall back to platform defaults
          const copyFields = piece.copy_fields.length > 0
            ? piece.copy_fields
            : (PLATFORM_COPY_FIELDS[`${platformName}_${piece.format}`] || []).map((f) => ({
                ...f,
                copy: "",
              }));

          if (copyFields.length === 0) {
            // Platforms with no copy (DV360, Spotify, Seedtag)
            const row = ws.addRow([
              "",
              nomenclature,
              "",
              `${piece.piece_type} ${piece.format}`,
              deliveryFormats.join("\n"),
              "Sin copy",
              "",
              "",
              "",
            ]);
            row.font = { name: FONT, size: 10 };
            row.alignment = { vertical: "middle", wrapText: true };
            row.height = 24;
            currentRow++;
          } else {
            copyFields.forEach((cf, cfIdx) => {
              const row = ws.addRow([
                "",
                cfIdx === 0 ? nomenclature : "",
                cfIdx === 0 ? "" : "",
                cfIdx === 0 ? `${piece.piece_type} ${piece.format}` : "",
                cfIdx === 0 ? deliveryFormats.join("\n") : "",
                `${cf.field_name} (${cf.char_limit})`,
                cf.copy,
                cf.copy ? cf.copy.length : 0,
                "",
              ]);
              row.font = { name: FONT, size: 10 };
              row.alignment = { vertical: "middle", wrapText: true };
              row.height = cfIdx === 0 ? 28 : 24;

              // Highlight if copy exceeds limit
              if (cf.copy && cf.copy.length > cf.char_limit) {
                row.getCell(7).font = {
                  name: FONT, size: 10, color: { argb: "FFDC2626" }, bold: true,
                };
                row.getCell(8).font = {
                  name: FONT, size: 10, color: { argb: "FFDC2626" }, bold: true,
                };
              }

              currentRow++;
            });

            // Carousel slide descriptions
            if (piece.format === "CAR" && piece.slide_descriptions) {
              piece.slide_descriptions.forEach((desc, sIdx) => {
                const row = ws.addRow([
                  "", "", "", "", "",
                  `Slide ${sIdx + 1}`,
                  desc,
                  desc.length,
                  "",
                ]);
                row.font = { name: FONT, size: 10 };
                row.alignment = { vertical: "middle", wrapText: true };
                row.height = 24;
                currentRow++;
              });
            }
          }
        });

        // Merge platform column for all rows of this platform
        if (currentRow > platformStartRow) {
          if (currentRow - 1 > platformStartRow) {
            ws.mergeCells(platformStartRow, 1, currentRow - 1, 1);
          }
          const platformCell = ws.getCell(platformStartRow, 1);
          platformCell.value = platformName.toUpperCase();
          platformCell.font = { name: FONT, size: 11, bold: true, color: { argb: "FFFFFFFF" } };
          platformCell.alignment = { vertical: "middle", horizontal: "center", textRotation: 90 };
          const platformColor = PLATFORM_COLORS[platformName] || `FF${PURPLE}`;
          platformCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: platformColor },
          };
        }

        // Light border between platforms
        for (let r = platformStartRow; r < currentRow; r++) {
          for (let c = 1; c <= 9; c++) {
            const cell = ws.getCell(r, c);
            cell.border = {
              bottom: { style: "hair", color: { argb: "FFE0E0E0" } },
              right: c < 9 ? { style: "hair", color: { argb: "FFE0E0E0" } } : undefined,
            };
          }
        }
      });
    });
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ─── 5. TESTING MATRIX ──────────────────────────────────────────

export async function generateTestingMatrix(
  data: XlsxDeliverableData
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rufus Creative Builder";

  const matrix = data.testing_matrix;

  // Sheet 1: Variables
  const varWs = wb.addWorksheet("Variables", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  brandTitle(varWs, `Testing Matrix — ${data.client_name}`, 5);

  if (matrix?.hypothesis) {
    varWs.mergeCells(2, 1, 2, 5);
    const hypCell = varWs.getCell("A2");
    hypCell.value = `Hipótesis: ${matrix.hypothesis}`;
    hypCell.font = { name: FONT, size: 11, italic: true, color: { argb: `FF${DARK_BG}` } };
    varWs.getRow(2).height = 28;
  }

  varWs.columns = [
    { width: 18 },
    { width: 35 },
    { width: 35 },
    { width: 35 },
    { width: 35 },
  ];

  const varHeaders = ["Variable", "Opción 1", "Opción 2", "Opción 3", "Opción 4"];
  const varHRow = varWs.addRow(varHeaders);
  headerStyle(varWs, varHRow, varHeaders.length);

  const variables = matrix?.variables || {};
  const varRowsData: [string, string[]][] = [
    ["Hooks", variables.hooks || []],
    ["Ángulos", variables.angles || []],
    ["Formatos", variables.formats || []],
    ["Copy", variables.copy_variants || []],
    ["Audiencias", variables.audiences || []],
  ];

  varRowsData.forEach(([name, options], idx) => {
    if (options.length === 0) return;
    const rowData = [name, ...options.slice(0, 4)];
    while (rowData.length < 5) rowData.push("");
    const row = varWs.addRow(rowData);
    altRowStyle(row, 5, idx % 2 === 0);
    row.height = 28;
    row.getCell(1).font = { name: FONT, size: 10, bold: true, color: { argb: `FF${PURPLE}` } };
  });

  // Sheet 2: Combinations / Prioritization
  const combWs = wb.addWorksheet("Combinaciones", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const combCols = ["Nombre", "Hook", "Ángulo", "Formato", "Copy", "Hipótesis", "Prioridad", "Métricas"];
  brandTitle(combWs, `Combinaciones de Testing — ${data.client_name}`, combCols.length);

  combWs.columns = [
    { width: 22 },
    { width: 28 },
    { width: 22 },
    { width: 16 },
    { width: 22 },
    { width: 35 },
    { width: 12 },
    { width: 25 },
  ];

  const combHRow = combWs.addRow(combCols);
  headerStyle(combWs, combHRow, combCols.length);

  const combinations = matrix?.combinations || [];
  if (combinations.length > 0) {
    combinations.forEach((combo, idx) => {
      const row = combWs.addRow([
        combo.name,
        combo.hook,
        combo.angle,
        combo.format,
        combo.copy_variant || "",
        combo.hypothesis,
        combo.priority,
        combo.metrics,
      ]);
      altRowStyle(row, combCols.length, idx % 2 === 0);
      row.height = 28;

      // Color-code priority
      const prioCell = row.getCell(7);
      const prioColors: Record<string, string> = {
        Alta: "FFDC2626",
        Media: "FFFBBF24",
        Baja: "FF10B981",
      };
      const prioColor = prioColors[combo.priority] || `FF${PURPLE}`;
      prioCell.font = { name: FONT, size: 10, bold: true, color: { argb: prioColor } };
    });
  } else {
    // Auto-generate combinations from variables
    const hooks = variables.hooks || ["Hook 1"];
    const angles = variables.angles || ["Ángulo 1"];
    const formats = variables.formats || ["Formato 1"];
    let combIdx = 0;
    hooks.slice(0, 3).forEach((hook) => {
      angles.slice(0, 2).forEach((angle) => {
        formats.slice(0, 2).forEach((format) => {
          combIdx++;
          const row = combWs.addRow([
            `Variación ${combIdx}`,
            hook,
            angle,
            format,
            "",
            "A completar",
            combIdx <= 3 ? "Alta" : combIdx <= 6 ? "Media" : "Baja",
            "CTR, Hook Rate, CPA",
          ]);
          altRowStyle(row, combCols.length, combIdx % 2 === 0);
          row.height = 28;
        });
      });
    });
  }

  // Sheet 3: Metrics
  if (matrix?.metrics_to_measure && matrix.metrics_to_measure.length > 0) {
    const metricsWs = wb.addWorksheet("Métricas");
    brandTitle(metricsWs, "Métricas de Testing", 3);

    metricsWs.columns = [{ width: 5 }, { width: 30 }, { width: 50 }];
    const mHRow = metricsWs.addRow(["#", "Métrica", "Descripción"]);
    headerStyle(metricsWs, mHRow, 3);

    matrix.metrics_to_measure.forEach((metric, idx) => {
      const row = metricsWs.addRow([idx + 1, metric, ""]);
      altRowStyle(row, 3, idx % 2 === 0);
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ─── Export map ─────────────────────────────────────────────────

export type XlsxDeliverableType =
  | "content_calendar"
  | "storyboard"
  | "casting_grid"
  | "excel_pauta"
  | "testing_matrix";

const GENERATORS: Record<
  XlsxDeliverableType,
  (data: XlsxDeliverableData) => Promise<Buffer>
> = {
  content_calendar: generateContentCalendar,
  storyboard: generateStoryboard,
  casting_grid: generateCastingGrid,
  excel_pauta: generateExcelPauta,
  testing_matrix: generateTestingMatrix,
};

export async function generateXlsx(
  type: XlsxDeliverableType,
  data: XlsxDeliverableData
): Promise<Buffer> {
  const generator = GENERATORS[type];
  if (!generator) throw new Error(`Unknown XLSX deliverable type: ${type}`);
  return generator(data);
}

export const XLSX_LABELS: Record<XlsxDeliverableType, string> = {
  content_calendar: "Calendario de contenido",
  storyboard: "Storyboard",
  casting_grid: "Casting Grid",
  excel_pauta: "Excel de Pauta (Copy Outs)",
  testing_matrix: "Testing Matrix",
};
