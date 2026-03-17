import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const data = new Uint8Array(buffer);
    const parser = new PDFParse(data);
    const result = await parser.getText();
    return result.text || "";
  } catch (err) {
    console.error("PDF parse error:", err);
    // Fallback: try to extract raw text from PDF buffer
    const text = buffer.toString("utf-8");
    // Extract readable text between stream markers
    const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, " ").trim();
    if (readable.length > 100) {
      return readable;
    }
    throw new Error("No se pudo extraer texto del PDF. Intentá convertirlo a DOCX o TXT.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    let text = "";

    if (name.endsWith(".pdf")) {
      text = await extractPdfText(buffer);
    } else if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      // Excel files — extract sheet names and basic info
      text = `[Archivo Excel: ${file.name}] — Los archivos Excel se procesan como referencia. Describí qué contiene o qué necesitás hacer con él.`;
    } else if (
      name.endsWith(".txt") ||
      name.endsWith(".csv") ||
      name.endsWith(".md")
    ) {
      text = buffer.toString("utf-8");
    } else if (
      name.endsWith(".pptx") ||
      name.endsWith(".ppt")
    ) {
      text = `[Archivo PowerPoint: ${file.name}] — Describí qué contiene o qué necesitás hacer con él.`;
    } else if (
      name.endsWith(".png") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".gif") ||
      name.endsWith(".webp")
    ) {
      text = `[Imagen: ${file.name}] — Las imágenes se adjuntan como referencia visual. Describí qué contiene o qué necesitás.`;
    } else {
      return NextResponse.json(
        { error: "Formato no soportado. Usá PDF, DOCX, TXT, CSV, MD, XLSX o PPTX." },
        { status: 400 }
      );
    }

    // Truncate to 50K chars
    if (text.length > 50000) {
      text = text.slice(0, 50000) + "\n\n[...texto truncado a 50.000 caracteres]";
    }

    return NextResponse.json({
      filename: file.name,
      text,
      chars: text.length,
    });
  } catch (err) {
    console.error("Upload error:", err);
    const errorMessage = err instanceof Error ? err.message : "Error procesando el archivo";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
