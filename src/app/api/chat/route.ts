import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, TOOLS } from "@/lib/system-prompt";
import { generateCase, CaseData } from "@/lib/generate-pptx";
import {
  generateDocx,
  DocxDeliverableType,
  DOCX_LABELS,
  DeliverableData,
} from "@/lib/generate-docx";
import {
  generateXlsx,
  XlsxDeliverableType,
  XLSX_LABELS,
  XlsxDeliverableData,
} from "@/lib/generate-xlsx";

const anthropic = new Anthropic();

// Vercel serverless max duration (seconds) — Hobby: 60s, Pro: 300s
export const maxDuration = 60;

const DOCX_TYPES = new Set<string>([
  "guia",
  "guiones",
  "creator_briefs",
  "one_pager",
  "strategy_canvas",
  "brief_template",
  "avatar",
  "messaging_matrix",
  "content_strategy",
  "social_brief",
  "organic_creator_brief",
  "reel_script",
  "carousel",
]);
const XLSX_TYPES = new Set<string>([
  "content_calendar",
  "storyboard",
  "casting_grid",
  "excel_pauta",
  "testing_matrix",
  "editorial_calendar",
]);

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");
}

interface FileResult {
  base64: string;
  filename: string;
  label: string;
  mimeType: string;
}

async function handleToolUse(
  toolBlock: Anthropic.ContentBlock & { type: "tool_use"; name: string; id: string; input: unknown },
): Promise<{ text: string; files: FileResult[] }> {
  const files: FileResult[] = [];
  let summaryText = "";

  if (toolBlock.name === "generate_case") {
    const caseData = toolBlock.input as unknown as CaseData;
    const buffer = await generateCase(caseData);
    const slug = makeSlug(caseData.client_name);
    const filename = `case-${slug}-${Date.now()}.pptx`;
    files.push({
      base64: Buffer.from(buffer).toString("base64"),
      filename,
      label: "Descargar caso (.pptx)",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    summaryText = `Caso PPTX generado para ${caseData.client_name}. Tipo: ${caseData.work_type}. ${caseData.pillars?.length || 0} pilares de contenido. El archivo está listo para descargar.`;
  } else if (toolBlock.name === "generate_deliverable") {
    const input = toolBlock.input as Record<string, unknown>;
    const deliverableType = input.deliverable_type as string;
    const clientName = (input.client_name as string) || "cliente";
    const slug = makeSlug(clientName);
    const ts = Date.now();

    if (DOCX_TYPES.has(deliverableType)) {
      const buffer = await generateDocx(
        deliverableType as DocxDeliverableType,
        input as unknown as DeliverableData
      );
      const filename = `${deliverableType}-${slug}-${ts}.docx`;
      const label = DOCX_LABELS[deliverableType as DocxDeliverableType];
      files.push({
        base64: Buffer.from(buffer).toString("base64"),
        filename,
        label: `Descargar ${label} (.docx)`,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      summaryText = `${label} DOCX generado para ${clientName}. El archivo está listo para descargar.`;
    } else if (XLSX_TYPES.has(deliverableType)) {
      const buffer = await generateXlsx(
        deliverableType as XlsxDeliverableType,
        input as unknown as XlsxDeliverableData
      );
      const filename = `${deliverableType}-${slug}-${ts}.xlsx`;
      const label = XLSX_LABELS[deliverableType as XlsxDeliverableType];
      files.push({
        base64: Buffer.from(buffer).toString("base64"),
        filename,
        label: `Descargar ${label} (.xlsx)`,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      summaryText = `${label} XLSX generado para ${clientName}. El archivo está listo para descargar.`;
    } else {
      summaryText = `Tipo de entregable no reconocido: ${deliverableType}`;
    }
  }

  return { text: summaryText, files };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Sanitize messages for Claude API
    const sanitized: { role: "user" | "assistant"; content: string }[] = [];
    for (const m of messages) {
      const role = m.role as "user" | "assistant";
      const content = m.content as string;
      if (!content || content.startsWith("⚠️")) continue;
      if (sanitized.length === 0 && role !== "user") continue;
      if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === role) {
        sanitized[sanitized.length - 1].content += "\n\n" + content;
      } else {
        sanitized.push({ role, content });
      }
    }

    if (sanitized.length === 0) {
      return NextResponse.json({ message: "No se recibió ningún mensaje. Escribí algo para empezar." });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: TOOLS as Anthropic.Tool[],
      messages: sanitized,
    });

    // Check if Claude wants to use a tool
    if (response.stop_reason === "tool_use") {
      const toolBlock = response.content.find(
        (b): b is Anthropic.ContentBlock & { type: "tool_use" } =>
          b.type === "tool_use"
      );

      if (
        toolBlock &&
        (toolBlock.name === "generate_case" ||
          toolBlock.name === "generate_deliverable")
      ) {
        // Get any text Claude wrote before calling the tool
        const preToolText = response.content
          .filter(
            (b): b is Anthropic.ContentBlock & { type: "text" } =>
              b.type === "text"
          )
          .map((b) => b.text)
          .join("\n");

        const result = await handleToolUse(
          toolBlock as Anthropic.ContentBlock & { type: "tool_use"; name: string; id: string; input: unknown },
        );

        // Combine pre-tool text with summary (no second Claude call needed)
        const finalText = [preToolText, result.text].filter(Boolean).join("\n\n");

        return NextResponse.json({
          message: finalText,
          files: result.files.map((f) => ({
            base64: f.base64,
            filename: f.filename,
            label: f.label,
            mimeType: f.mimeType,
          })),
        });
      }
    }

    // Regular text response
    const text = response.content
      .filter(
        (b): b is Anthropic.ContentBlock & { type: "text" } =>
          b.type === "text"
      )
      .map((b) => b.text)
      .join("\n");

    return NextResponse.json({ message: text });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat error:", errorMessage, err);
    return NextResponse.json(
      { error: `Error procesando la solicitud: ${errorMessage}` },
      { status: 500 }
    );
  }
}
