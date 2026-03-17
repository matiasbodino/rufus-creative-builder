import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
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

const DOCX_TYPES = new Set<string>([
  "guia",
  "guiones",
  "creator_briefs",
  "one_pager",
  "strategy_canvas",
  "brief_template",
]);
const XLSX_TYPES = new Set<string>([
  "content_calendar",
  "storyboard",
  "casting_grid",
]);

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");
}

async function handleToolUse(
  toolBlock: Anthropic.ContentBlock & { type: "tool_use"; name: string; id: string; input: unknown },
  response: Anthropic.Message,
  messages: { role: string; content: string }[]
): Promise<{ text: string; files: { url: string; label: string }[] }> {
  const dir = path.join(process.cwd(), "public", "cases");
  await mkdir(dir, { recursive: true });

  const files: { url: string; label: string }[] = [];
  let toolResultContent = "";

  if (toolBlock.name === "generate_case") {
    const caseData = toolBlock.input as unknown as CaseData;
    const buffer = await generateCase(caseData);
    const slug = makeSlug(caseData.client_name);
    const filename = `case-${slug}-${Date.now()}.pptx`;
    await writeFile(path.join(dir, filename), buffer);
    files.push({ url: `/cases/${filename}`, label: "Descargar caso (.pptx)" });
    toolResultContent = `Caso PPTX generado exitosamente: ${filename}. Tipo: ${caseData.work_type}. Cliente: ${caseData.client_name}. Niveles activos: ${caseData.active_levels?.join(", ")}. ${caseData.pillars.length} pilares de contenido.`;
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
      await writeFile(path.join(dir, filename), buffer);
      const label = DOCX_LABELS[deliverableType as DocxDeliverableType];
      files.push({ url: `/cases/${filename}`, label: `Descargar ${label} (.docx)` });
      toolResultContent = `${label} DOCX generado exitosamente: ${filename}. Cliente: ${clientName}.`;
    } else if (XLSX_TYPES.has(deliverableType)) {
      const buffer = await generateXlsx(
        deliverableType as XlsxDeliverableType,
        input as unknown as XlsxDeliverableData
      );
      const filename = `${deliverableType}-${slug}-${ts}.xlsx`;
      await writeFile(path.join(dir, filename), buffer);
      const label = XLSX_LABELS[deliverableType as XlsxDeliverableType];
      files.push({ url: `/cases/${filename}`, label: `Descargar ${label} (.xlsx)` });
      toolResultContent = `${label} XLSX generado exitosamente: ${filename}. Cliente: ${clientName}.`;
    } else {
      toolResultContent = `Error: tipo de entregable desconocido: ${deliverableType}`;
    }
  }

  // Follow-up to get Claude's summary
  const followUp = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    tools: TOOLS as Anthropic.Tool[],
    messages: [
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "assistant" as const, content: response.content },
      {
        role: "user" as const,
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: toolBlock.id,
            content: toolResultContent,
          },
        ],
      },
    ],
  });

  const text = followUp.content
    .filter(
      (b): b is Anthropic.ContentBlock & { type: "text" } =>
        b.type === "text"
    )
    .map((b) => b.text)
    .join("\n");

  return { text, files };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: TOOLS as Anthropic.Tool[],
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
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
        const result = await handleToolUse(
          toolBlock as Anthropic.ContentBlock & { type: "tool_use"; name: string; id: string; input: unknown },
          response,
          messages
        );

        return NextResponse.json({
          message: result.text,
          file: result.files[0]?.url,
          files: result.files,
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
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
