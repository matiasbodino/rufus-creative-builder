import ExcelJS from "exceljs";

// ─── Brand constants ────────────────────────────────────────────
const PURPLE = "653BEB";
const DARK_BG = "1C0C45";
const NEON_YELLOW = "E0E000";
const FONT = "Instrument Sans";

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

  const cols = ["Semana", "Día", "Plataforma", "Formato", "Pilar", "Descripción"];
  brandTitle(ws, `Calendario de Contenido — ${data.client_name}`, cols.length);

  // Column widths
  ws.columns = [
    { width: 14 },
    { width: 12 },
    { width: 14 },
    { width: 16 },
    { width: 18 },
    { width: 50 },
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

// ─── Export map ─────────────────────────────────────────────────

export type XlsxDeliverableType = "content_calendar" | "storyboard" | "casting_grid";

const GENERATORS: Record<
  XlsxDeliverableType,
  (data: XlsxDeliverableData) => Promise<Buffer>
> = {
  content_calendar: generateContentCalendar,
  storyboard: generateStoryboard,
  casting_grid: generateCastingGrid,
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
};
