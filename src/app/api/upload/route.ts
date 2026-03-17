import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const data = new Uint8Array(buffer);
  const parser = new PDFParse(data);
  const result = await parser.getText();
  return result.text;
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
    } else if (
      name.endsWith(".txt") ||
      name.endsWith(".csv") ||
      name.endsWith(".md")
    ) {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Formato no soportado. Usá PDF, DOCX, TXT, CSV o MD." },
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
    return NextResponse.json(
      { error: "Error procesando el archivo" },
      { status: 500 }
    );
  }
}
