import ExcelJS from "exceljs";

// ─── Brand constants (Natura reference) ─────────────────────────
const PURPLE = "653BEB"; // Platform color for Meta
const LIGHT_PURPLE = "C1B1F7"; // Piece-type separator + TOC headers
const HEADER_BLUE = "C9DAF8"; // Column header row fill
const SAGE_BG = "D9DAC8"; // Row 1-2 title background
const GREEN_FORMATS = "D9EAD3"; // Formats column highlight
const WHITE = "FFFFFF";
const DARK_TEXT = "06083F"; // Dark text color
const FONT = "Instrument Sans";

// ─── Platform color map (exact from Natura Excel) ───────────────
const PLATFORM_COLORS: Record<string, string> = {
  Meta: `FF${PURPLE}`,
  TikTok: "FFFF9900",
  YouTube: "FFF9CB9C",
  DV360: "FFCFE2F3",
  Spotify: "FF1DB954",
  Seedtag: "FF6366F1",
  RCN: "FFEAD1DC",
  THANSKTOYOU: "FFD9D2E9",
};

// ─── Platform-specific default copy field definitions ───────────
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
      bottom: { style: "thin", color: { argb: "FF1C0C45" } },
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
  // Editorial Calendar (O9)
  editorial_calendar?: {
    weeks: {
      week: string;
      entries: {
        day: string;
        platform: string;
        format: string;
        pillar?: string;
        concept_preview?: string;
        visual_description?: string;
        hashtags?: string;
        status?: string;
        is_realtime_slot?: boolean;
        cultural_moment?: string;
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

// ─── 4. EXCEL PAUTA (Copy Outs) — Natura reference format ───────

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

// Helper: apply sage background to title rows 1-2
function applyTitleRows(
  ws: ExcelJS.Worksheet,
  titleText: string,
  stageText: string,
  colSpan: number
) {
  // Row 1: Campaign title
  ws.mergeCells(1, 1, 1, colSpan);
  const titleCell = ws.getCell("A1");
  titleCell.value = titleText;
  titleCell.font = { name: FONT, size: 11, bold: true, color: { theme: 1 } };
  titleCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${SAGE_BG}` },
  };

  // Row 2: Stage name
  ws.mergeCells(2, 1, 2, colSpan);
  const stageCell = ws.getCell("A2");
  stageCell.value = stageText;
  stageCell.font = { name: FONT, size: 9, bold: true, color: { theme: 1 } };
  stageCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  stageCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${SAGE_BG}` },
  };
}

// Helper: apply column header rows 3-4
function applyColumnHeaders(ws: ExcelJS.Worksheet) {
  // Merge rows 3-4 for each header column
  // A: PLATAFORMA, B: NOMENCLATURA, C: PREVIEW, D: LINK, E: FORMATOS
  const leftHeaders = [
    { col: 1, label: "PLATAFORMA" },
    { col: 2, label: "NOMENCLATURA" },
    { col: 3, label: "PREVIEW" },
    { col: 4, label: "LINK" },
    { col: 5, label: "FORMATOS" },
  ];

  leftHeaders.forEach(({ col, label }) => {
    ws.mergeCells(3, col, 4, col);
    const cell = ws.getCell(3, col);
    cell.value = label;
    cell.font = { name: FONT, size: 9, bold: true, color: { argb: `FF${DARK_TEXT}` } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${HEADER_BLUE}` },
    };
  });

  // F-H: COPY OUTS (merged across F3:H4)
  ws.mergeCells(3, 6, 4, 8);
  const copyCell = ws.getCell(3, 6);
  copyCell.value = "COPY OUTS";
  copyCell.font = { name: FONT, bold: true, color: { theme: 1 } };
  copyCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  copyCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { theme: 4 },
  };

  // I: LINK YOUTUBE (merged I3:I4)
  ws.mergeCells(3, 9, 4, 9);
  const ytCell = ws.getCell(3, 9);
  ytCell.value = "LINK YOUTUBE";
  ytCell.font = { name: FONT, bold: true, color: { theme: 1 } };
  ytCell.alignment = { vertical: "middle" };
  ytCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { theme: 5 },
  };
}

// Helper: create piece-type separator row (e.g. "VIDEO ANIMADO PRODUCTO")
function addPieceTypeSeparator(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  hasSlides: boolean
) {
  // Merge B:E for the label
  ws.mergeCells(rowNum, 2, rowNum, 5);
  const labelCell = ws.getCell(rowNum, 2);
  labelCell.value = label;
  labelCell.font = { name: FONT, size: 9, bold: true, color: { argb: "FFFFFFFF" } };
  labelCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  labelCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${LIGHT_PURPLE}` },
  };

  // F5-style: "Tipo de texto" label
  const typeCell = ws.getCell(rowNum, 6);
  typeCell.value = "Tipo de texto";
  typeCell.font = { name: FONT, color: { theme: 1 } };
  typeCell.alignment = { horizontal: "center", vertical: "middle" };

  // H: "WC" label
  const wcCell = ws.getCell(rowNum, 8);
  wcCell.value = "WC";
  wcCell.font = { name: FONT, size: 9, bold: true, color: { argb: `FF${DARK_TEXT}` } };
  wcCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

  // I: "-"
  const iCell = ws.getCell(rowNum, 9);
  iCell.value = "-";
  iCell.font = { name: FONT, color: { theme: 1 } };
  iCell.alignment = { horizontal: "center", vertical: "middle" };

  ws.getRow(rowNum).height = 18;

  // If carousel, add "Descripción por slide" header in J-O
  if (hasSlides) {
    ws.mergeCells(rowNum, 10, rowNum, 15);
    const slideHeaderCell = ws.getCell(rowNum, 10);
    slideHeaderCell.value = "Descripción por slide";
    slideHeaderCell.font = { name: FONT, size: 9, bold: true, color: { argb: "FFFFFFFF" } };
    slideHeaderCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    slideHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${LIGHT_PURPLE}` },
    };
  }
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
    const tocName = `${clientName.toUpperCase()} ${campaignName.toUpperCase()} CO | T`.substring(0, 31);
    const ws = wb.addWorksheet(tocName);
    ws.columns = [
      { width: 3.63 },
      { width: 21 },
      { width: 20.25 },
      { width: 17.25 },
      { width: 19.75 },
    ];

    // Row 2: TOC Headers
    const tocHeaders = ["", "ENTREGA", "DRIVE", "STATUS", "EDITABLES"];
    ws.getRow(2).height = 34.5;
    tocHeaders.forEach((h, i) => {
      if (i === 0) return;
      const cell = ws.getCell(2, i + 1);
      cell.value = h;
      cell.font = { name: FONT, bold: true, color: { theme: 1 } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${LIGHT_PURPLE}` },
      };
    });

    ws.getRow(3).height = 18;
    ws.getCell("B3").value = "E1 | AWARENESS";
    ws.getCell("B3").font = { name: FONT, bold: true, underline: true, color: { argb: "FF0000FF" } };
    ws.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("C3").value = "AWARENESS E1";
    ws.getCell("D3").value = "Pendiente";
    ws.getCell("D3").alignment = { horizontal: "center", vertical: "middle" };

    ws.getRow(4).height = 18;
    ws.getCell("B4").value = "E1 | CONSIDERACIÓN";
    ws.getCell("B4").font = { name: FONT, bold: true, underline: true, color: { argb: "FF0000FF" } };
    ws.getCell("B4").alignment = { horizontal: "center", vertical: "middle" };
    ws.getCell("C4").value = "CONSIDERACIÓN E1";
    ws.getCell("D4").value = "Pendiente";
    ws.getCell("D4").alignment = { horizontal: "center", vertical: "middle" };

    const buffer = await wb.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // ── TOC Tab ──
  const tocName = `${clientName.toUpperCase()} ${campaignName.toUpperCase()} CO | T`.substring(0, 31);
  const tocWs = wb.addWorksheet(tocName);
  tocWs.columns = [
    { width: 3.63 },
    { width: 21 },
    { width: 20.25 },
    { width: 17.25 },
    { width: 19.75 },
  ];

  // Row 2: TOC Headers with light purple fill
  tocWs.getRow(2).height = 34.5;
  const tocHeaderLabels = ["ENTREGA", "DRIVE", "STATUS", "EDITABLES"];
  tocHeaderLabels.forEach((h, i) => {
    const cell = tocWs.getCell(2, i + 2); // B2, C2, D2, E2
    cell.value = h;
    cell.font = { name: FONT, bold: true, color: { theme: 1 } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${LIGHT_PURPLE}` },
    };
  });

  // TOC entries starting at row 3
  let tocRow = 3;
  pauta.deliveries.forEach((delivery, dIdx) => {
    delivery.funnel_stages.forEach((stage) => {
      const stageAbbrev = stage.stage.toUpperCase().substring(0, 3);
      const entregaLabel = `E${dIdx + 1} | ${delivery.audience || ""} ${stageAbbrev}`.trim();
      const stageSheetLabel = `${stage.stage.toUpperCase()} E${dIdx + 1}`;

      tocWs.getRow(tocRow).height = 18;

      const bCell = tocWs.getCell(tocRow, 2);
      bCell.value = entregaLabel;
      bCell.font = { name: FONT, bold: true, underline: true, color: { argb: "FF0000FF" } };
      bCell.alignment = { horizontal: "center", vertical: "middle" };

      const cCell = tocWs.getCell(tocRow, 3);
      cCell.value = stageSheetLabel;
      cCell.font = { name: FONT, underline: true, color: { theme: 1 } };
      cCell.alignment = { horizontal: "center", vertical: "middle" };

      const dCell = tocWs.getCell(tocRow, 4);
      dCell.value = "Pendiente";
      dCell.font = { name: FONT, color: { theme: 1 } };
      dCell.alignment = { horizontal: "center", vertical: "middle" };

      const eCell = tocWs.getCell(tocRow, 5);
      eCell.value = "";
      eCell.font = { name: FONT, color: { theme: 1 } };
      eCell.alignment = { horizontal: "center", vertical: "middle" };

      // Merge STATUS and EDITABLES for pairs of stages
      // The real Excel merges D and E for each pair of AW/CON rows per delivery
      tocRow++;
    });
  });

  // ── Per-delivery per-stage tabs ──
  pauta.deliveries.forEach((delivery, dIdx) => {
    delivery.funnel_stages.forEach((stage) => {
      const rawName = `E${dIdx + 1} | ${stage.stage.toUpperCase()}`;
      const sheetName = rawName.substring(0, 31);
      const ws = wb.addWorksheet(sheetName);

      // Column widths (matching Natura reference)
      ws.getColumn(1).width = 8.5;   // A: PLATAFORMA
      ws.getColumn(2).width = 26.75;  // B: NOMENCLATURA
      ws.getColumn(3).width = 23.63;  // C: PREVIEW
      ws.getColumn(4).width = 15.63;  // D: LINK
      ws.getColumn(5).width = 15.88;  // E: FORMATOS
      ws.getColumn(6).width = 15.88;  // F: Copy type
      ws.getColumn(7).width = 28.88;  // G: Copy text
      ws.getColumn(8).width = 13;     // H: WC
      ws.getColumn(9).width = 15;     // I: LINK YOUTUBE
      // J-O for carousel slide descriptions
      for (let c = 10; c <= 15; c++) {
        ws.getColumn(c).width = 20;
      }

      // Row 1-2: Title rows
      const audienceLabel = delivery.audience ? ` | ${delivery.audience.toUpperCase()}` : "";
      const titleText = `${clientName.toUpperCase()} ${campaignName.toUpperCase()}${audienceLabel}`;
      applyTitleRows(ws, titleText, stage.stage.toUpperCase(), 9);

      // Row 3-4: Column headers
      applyColumnHeaders(ws);

      // Group pieces by platform for proper rendering
      const byPlatform: Record<string, typeof stage.pieces> = {};
      stage.pieces.forEach((piece) => {
        if (!byPlatform[piece.platform]) byPlatform[piece.platform] = [];
        byPlatform[piece.platform].push(piece);
      });

      // Group within platform by piece_type+format to create separator rows
      let currentRow = 5; // Data starts at row 5
      const platformNames = Object.keys(byPlatform);

      platformNames.forEach((platformName) => {
        const pieces = byPlatform[platformName];
        const platformStartRow = currentRow;

        // Group pieces by their display type (e.g. "VIDEO ANIMADO PRODUCTO", "VIDEO UCG", "CARRUSEL PRODUCTO")
        const pieceGroups: { label: string; pieces: typeof pieces; isCarousel: boolean }[] = [];
        const groupMap = new Map<string, typeof pieces>();

        pieces.forEach((piece) => {
          const formatLabel = piece.format === "CAR" ? "CARRUSEL" : piece.format === "VID" ? "VIDEO ANIMADO" : "Estática";
          const typeLabel = piece.piece_type === "UGC" ? "UCG" : piece.piece_type === "CRE" ? "UCG" : piece.piece_type.toUpperCase();
          const key = `${formatLabel} ${typeLabel}`;
          if (!groupMap.has(key)) groupMap.set(key, []);
          groupMap.get(key)!.push(piece);
        });

        groupMap.forEach((groupPieces, label) => {
          pieceGroups.push({
            label,
            pieces: groupPieces,
            isCarousel: label.startsWith("CARRUSEL"),
          });
        });

        pieceGroups.forEach((group) => {
          // Add piece-type separator row
          addPieceTypeSeparator(ws, currentRow, group.label, group.isCarousel);
          currentRow++;

          group.pieces.forEach((piece) => {
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

            const pieceStartRow = currentRow;

            if (copyFields.length === 0) {
              // Platforms with no copy (DV360, Spotify, Seedtag) - still 3 merged rows
              const numRows = 3;
              for (let r = 0; r < numRows; r++) {
                const rowNum = currentRow + r;
                const row = ws.getRow(rowNum);
                row.height = 24;

                // F, G, H, I = "-"
                ws.getCell(rowNum, 6).value = "-";
                ws.getCell(rowNum, 6).font = { name: FONT, color: { theme: 1 } };
                ws.getCell(rowNum, 6).alignment = { horizontal: "center", vertical: "middle" };
                if (r === 0) {
                  ws.getCell(rowNum, 6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${WHITE}` } };
                }
                ws.getCell(rowNum, 7).value = "-";
                ws.getCell(rowNum, 8).value = "-";
                ws.getCell(rowNum, 9).value = "-";
              }

              // Merge B, C, D, E across all rows
              if (numRows > 1) {
                ws.mergeCells(pieceStartRow, 2, pieceStartRow + numRows - 1, 2);
                if (piece.format !== "CAR") {
                  ws.mergeCells(pieceStartRow, 3, pieceStartRow + numRows - 1, 3);
                }
                ws.mergeCells(pieceStartRow, 4, pieceStartRow + numRows - 1, 4);
                ws.mergeCells(pieceStartRow, 5, pieceStartRow + numRows - 1, 5);
                ws.mergeCells(pieceStartRow, 9, pieceStartRow + numRows - 1, 9);
              }

              // Set nomenclature
              const nCell = ws.getCell(pieceStartRow, 2);
              nCell.value = nomenclature;
              nCell.font = { name: FONT, size: 9, color: { theme: 1 } };
              nCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

              // Link in D
              const dCell = ws.getCell(pieceStartRow, 4);
              dCell.value = `${piece.piece_type} ${piece.format}`;
              dCell.font = { name: FONT, size: 9, color: { argb: "FF1155CC" }, underline: true };
              dCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

              // Formats in E with green background
              const eCell = ws.getCell(pieceStartRow, 5);
              eCell.value = deliveryFormats.join("\n");
              eCell.font = { name: FONT, size: 8, color: { theme: 1 } };
              eCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
              eCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: `FF${GREEN_FORMATS}` },
              };

              currentRow += numRows;
            } else {
              // Platforms with copy
              const numCopyRows = copyFields.length;

              copyFields.forEach((cf, cfIdx) => {
                const rowNum = currentRow;
                const row = ws.getRow(rowNum);
                row.height = cfIdx === 0 ? 26.25 : 50;

                // F: Copy type label (e.g. "Título (25)")
                const fCell = ws.getCell(rowNum, 6);
                fCell.value = `${cf.field_name} (${cf.char_limit})`;
                fCell.font = { name: FONT, color: { theme: 1 } };
                fCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                if (cfIdx === 0 || cfIdx === 1) {
                  fCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${WHITE}` } };
                }

                // G: Copy text
                const gCell = ws.getCell(rowNum, 7);
                gCell.value = cf.copy;
                gCell.font = { name: FONT, color: { theme: 1 } };
                gCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                if (cfIdx === 0 || cfIdx === 1) {
                  gCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${WHITE}` } };
                }

                // H: Word count (LEN formula)
                const hCell = ws.getCell(rowNum, 8);
                if (cf.copy) {
                  hCell.value = { formula: `LEN(G${rowNum})` };
                } else {
                  hCell.value = 0;
                }
                hCell.font = { name: FONT, size: 9, color: { theme: 1 } };
                hCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                if (cfIdx === 0 || cfIdx === 1) {
                  hCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${WHITE}` } };
                }

                // I: Link YouTube
                const iCell = ws.getCell(rowNum, 9);
                iCell.value = "-";
                iCell.font = { name: FONT, color: { theme: 1 } };
                iCell.alignment = { horizontal: "center", vertical: "middle" };

                // Highlight if copy exceeds limit
                if (cf.copy && cf.copy.length > cf.char_limit) {
                  gCell.font = { name: FONT, color: { argb: "FFDC2626" }, bold: true };
                  hCell.font = { name: FONT, size: 9, color: { argb: "FFDC2626" }, bold: true };
                }

                currentRow++;
              });

              // Merge B, D, E, I across all copy rows
              if (numCopyRows > 1) {
                ws.mergeCells(pieceStartRow, 2, pieceStartRow + numCopyRows - 1, 2);
                ws.mergeCells(pieceStartRow, 3, pieceStartRow + numCopyRows - 1, 3);
                ws.mergeCells(pieceStartRow, 4, pieceStartRow + numCopyRows - 1, 4);
                ws.mergeCells(pieceStartRow, 5, pieceStartRow + numCopyRows - 1, 5);
                ws.mergeCells(pieceStartRow, 9, pieceStartRow + numCopyRows - 1, 9);
              }

              // Set nomenclature in B
              const nCell = ws.getCell(pieceStartRow, 2);
              nCell.value = nomenclature;
              nCell.font = { name: FONT, size: 9, color: { theme: 1 } };
              nCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

              // Link in D
              const dCell = ws.getCell(pieceStartRow, 4);
              dCell.value = `${piece.piece_type} ${piece.format}`;
              dCell.font = { name: FONT, size: 9, color: { argb: "FF1155CC" }, underline: true };
              dCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

              // Formats in E with green background
              const eCell = ws.getCell(pieceStartRow, 5);
              eCell.value = deliveryFormats.join("\n");
              eCell.font = { name: FONT, size: 8, color: { theme: 1 } };
              eCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
              eCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: `FF${GREEN_FORMATS}` },
              };

              // Carousel slide descriptions in columns J-O (row by row like Natura)
              if (piece.format === "CAR" && piece.slide_descriptions) {
                // Add slide number headers in the first copy row
                piece.slide_descriptions.forEach((desc, sIdx) => {
                  if (sIdx >= 6) return; // Max 6 slides (J-O)
                  const slideCol = 10 + sIdx; // J=10, K=11, ...
                  // Slide header in the title row
                  const headerCell = ws.getCell(pieceStartRow, slideCol);
                  headerCell.value = `Slide ${sIdx + 1}`;
                  headerCell.font = { name: FONT, color: { theme: 1 } };
                  headerCell.alignment = { horizontal: "center", vertical: "middle" };
                });

                // Slide content merged across the remaining copy rows
                if (numCopyRows > 1) {
                  piece.slide_descriptions.forEach((desc, sIdx) => {
                    if (sIdx >= 6) return;
                    const slideCol = 10 + sIdx;
                    // Merge from second copy row to last copy row
                    if (numCopyRows > 2) {
                      ws.mergeCells(pieceStartRow + 1, slideCol, pieceStartRow + numCopyRows - 1, slideCol);
                    }
                    const slideCell = ws.getCell(pieceStartRow + 1, slideCol);
                    slideCell.value = desc;
                    slideCell.font = { name: FONT, color: { theme: 1 } };
                    slideCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                  });
                }
              }
            }
          });
        });

        // Merge and style platform column (A) for all rows of this platform
        if (currentRow > platformStartRow) {
          if (currentRow - 1 > platformStartRow) {
            ws.mergeCells(platformStartRow, 1, currentRow - 1, 1);
          }
          const platformCell = ws.getCell(platformStartRow, 1);
          platformCell.value = platformName.toUpperCase();
          platformCell.font = { name: FONT, size: 9, bold: true, color: { argb: "FFFFFFFF" } };
          platformCell.alignment = { horizontal: "center", vertical: "middle", textRotation: 90, wrapText: true };
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
    hypCell.font = { name: FONT, size: 11, italic: true, color: { argb: "FF1C0C45" } };
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

// ─── 6. EDITORIAL CALENDAR (O9) ─────────────────────────────────

export async function generateEditorialCalendar(
  data: XlsxDeliverableData
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Rufus Creative Builder";

  const ws = wb.addWorksheet("Calendario Editorial", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  const cols = [
    "Semana", "Día", "Plataforma", "Formato", "Pilar",
    "Concepto / Copy Preview", "Dirección Visual", "Hashtags", "Status", "Momento Cultural"
  ];
  brandTitle(ws, `Calendario Editorial Orgánico — ${data.client_name}`, cols.length);

  ws.columns = [
    { width: 14 },  // Semana
    { width: 12 },  // Día
    { width: 14 },  // Plataforma
    { width: 16 },  // Formato
    { width: 18 },  // Pilar
    { width: 45 },  // Concepto / Copy Preview
    { width: 30 },  // Dirección Visual
    { width: 25 },  // Hashtags
    { width: 14 },  // Status
    { width: 22 },  // Momento Cultural
  ];

  const headerRow = ws.addRow(cols);
  headerStyle(ws, headerRow, cols.length);

  const REALTIME_BG = "FFFFF3CD"; // Soft yellow for real-time slots
  const CULTURAL_BG = "FFE8DAEF"; // Soft purple for cultural moments

  let rowIdx = 0;
  const calendar = data.editorial_calendar;
  if (calendar?.weeks) {
    calendar.weeks.forEach((week) => {
      week.entries.forEach((entry) => {
        const status = entry.is_realtime_slot ? "Real-Time" : (entry.status || "Planificado");
        const row = ws.addRow([
          week.week,
          entry.day,
          entry.platform,
          entry.format,
          entry.pillar || (entry.is_realtime_slot ? "— Real-Time —" : ""),
          entry.concept_preview || (entry.is_realtime_slot ? "[Slot reservado para contenido real-time]" : ""),
          entry.visual_description || "",
          entry.hashtags || "",
          status,
          entry.cultural_moment || "",
        ]);
        altRowStyle(row, cols.length, rowIdx % 2 === 0);

        // Highlight real-time slots
        if (entry.is_realtime_slot) {
          for (let c = 1; c <= cols.length; c++) {
            row.getCell(c).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: REALTIME_BG },
            };
          }
          row.getCell(9).font = { name: FONT, size: 10, bold: true, color: { argb: "FFD97706" } };
        }

        // Highlight cultural moments
        if (entry.cultural_moment) {
          const momentCell = row.getCell(10);
          momentCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: CULTURAL_BG },
          };
          momentCell.font = { name: FONT, size: 10, bold: true, color: { argb: `FF${PURPLE}` } };
        }

        rowIdx++;
      });
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
  | "testing_matrix"
  | "editorial_calendar";

const GENERATORS: Record<
  XlsxDeliverableType,
  (data: XlsxDeliverableData) => Promise<Buffer>
> = {
  content_calendar: generateContentCalendar,
  storyboard: generateStoryboard,
  casting_grid: generateCastingGrid,
  excel_pauta: generateExcelPauta,
  testing_matrix: generateTestingMatrix,
  editorial_calendar: generateEditorialCalendar,
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
  editorial_calendar: "Calendario Editorial Orgánico",
};
