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

// Vercel serverless max duration (seconds) — Hobby: 60s, Pro: 300s
export const maxDuration = 60;

const DOCX_TYPES = new Set<string>([
  "guia", "guiones", "creator_briefs", "one_pager", "strategy_canvas",
  "brief_template", "avatar", "messaging_matrix", "content_strategy",
  "social_brief", "organic_creator_brief", "reel_script", "carousel",
]);
const XLSX_TYPES = new Set<string>([
  "content_calendar", "storyboard", "casting_grid", "excel_pauta",
  "testing_matrix", "editorial_calendar",
]);

function makeSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
}

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function processToolUse(
  toolBlock: { name: string; id: string; input: unknown },
): Promise<{ toolResultContent: string; files: { url: string; label: string }[] }> {
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
    toolResultContent = `Caso PPTX generado: ${filename}.`;
  } else if (toolBlock.name === "generate_deliverable") {
    const input = toolBlock.input as Record<string, unknown>;
    const deliverableType = input.deliverable_type as string;
    const clientName = (input.client_name as string) || "cliente";
    const slug = makeSlug(clientName);
    const ts = Date.now();

    if (DOCX_TYPES.has(deliverableType)) {
      const buffer = await generateDocx(deliverableType as DocxDeliverableType, input as unknown as DeliverableData);
      const filename = `${deliverableType}-${slug}-${ts}.docx`;
      await writeFile(path.join(dir, filename), buffer);
      const label = DOCX_LABELS[deliverableType as DocxDeliverableType];
      files.push({ url: `/cases/${filename}`, label: `Descargar ${label} (.docx)` });
      toolResultContent = `${label} DOCX generado: ${filename}.`;
    } else if (XLSX_TYPES.has(deliverableType)) {
      const buffer = await generateXlsx(deliverableType as XlsxDeliverableType, input as unknown as XlsxDeliverableData);
      const filename = `${deliverableType}-${slug}-${ts}.xlsx`;
      await writeFile(path.join(dir, filename), buffer);
      const label = XLSX_LABELS[deliverableType as XlsxDeliverableType];
      files.push({ url: `/cases/${filename}`, label: `Descargar ${label} (.xlsx)` });
      toolResultContent = `${label} XLSX generado: ${filename}.`;
    } else {
      toolResultContent = `Error: tipo desconocido: ${deliverableType}`;
    }
  }

  return { toolResultContent, files };
}

export async function POST(req: Request) {
  let body: { messages: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = body;

  // Sanitize messages for Claude API
  const sanitized: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of messages) {
    const role = m.role as "user" | "assistant";
    const content = m.content as string;
    if (!content || content.startsWith("\u26A0\uFE0F")) continue;
    if (sanitized.length === 0 && role !== "user") continue;
    if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === role) {
      sanitized[sanitized.length - 1].content += "\n\n" + content;
    } else {
      sanitized.push({ role, content });
    }
  }

  if (sanitized.length === 0) {
    return new Response(
      sseEvent("text", { text: "No se recibió ningún mensaje. Escribí algo para empezar." }) +
        sseEvent("done", {}),
      { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } },
    );
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        try {
          controller.enqueue(encoder.encode(sseEvent(event, data)));
        } catch {
          // controller may already be closed
        }
      }

      try {
        // First call — stream text to the client
        const firstStream = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          stream: true,
          system: SYSTEM_PROMPT,
          tools: TOOLS as Anthropic.Tool[],
          messages: sanitized,
        });

        // Collect the full response while streaming text deltas
        const contentBlocks: Anthropic.ContentBlock[] = [];
        let currentBlock: Partial<Anthropic.ContentBlock> | null = null;
        let stopReason: string | null = null;
        let inputJsonBuf = "";

        for await (const event of firstStream) {
          if (event.type === "content_block_start") {
            if (event.content_block.type === "text") {
              currentBlock = { type: "text", text: "" };
            } else if (event.content_block.type === "tool_use") {
              currentBlock = {
                type: "tool_use",
                id: event.content_block.id,
                name: event.content_block.name,
                input: {},
              };
              inputJsonBuf = "";
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta.type === "text_delta" && currentBlock?.type === "text") {
              (currentBlock as { text: string }).text += event.delta.text;
              send("text", { text: event.delta.text });
            } else if (event.delta.type === "input_json_delta" && currentBlock?.type === "tool_use") {
              inputJsonBuf += event.delta.partial_json;
            }
          } else if (event.type === "content_block_stop") {
            if (currentBlock) {
              if (currentBlock.type === "tool_use" && inputJsonBuf) {
                try {
                  (currentBlock as Record<string, unknown>).input = JSON.parse(inputJsonBuf);
                } catch {
                  (currentBlock as Record<string, unknown>).input = {};
                }
              }
              contentBlocks.push(currentBlock as Anthropic.ContentBlock);
              currentBlock = null;
            }
          } else if (event.type === "message_delta") {
            stopReason = (event.delta as { stop_reason?: string }).stop_reason || null;
          }
        }

        // Check for tool use
        if (stopReason === "tool_use") {
          const tb = contentBlocks.find(
            (b): b is Anthropic.ContentBlock & { type: "tool_use" } => b.type === "tool_use",
          );

          if (tb && (tb.name === "generate_case" || tb.name === "generate_deliverable")) {
            send("status", { text: "Generando archivo..." });

            const { toolResultContent, files } = await processToolUse({
              name: tb.name,
              id: tb.id,
              input: tb.input,
            });

            if (files.length > 0) {
              send("files", { files });
            }

            // Follow-up call — also streamed, with reduced tokens
            send("clear", {});

            const secondStream = await anthropic.messages.create({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1024,
              stream: true,
              system: SYSTEM_PROMPT,
              tools: TOOLS as Anthropic.Tool[],
              messages: [
                ...sanitized,
                { role: "assistant" as const, content: contentBlocks },
                {
                  role: "user" as const,
                  content: [
                    {
                      type: "tool_result" as const,
                      tool_use_id: tb.id,
                      content: toolResultContent,
                    },
                  ],
                },
              ],
            });

            for await (const event of secondStream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                send("text", { text: event.delta.text });
              }
            }
          }
        }

        send("done", {});
      } catch (err: unknown) {
        console.error("Stream error:", err);
        const msg = err instanceof Error ? err.message : "Error desconocido";
        send("error", { message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
