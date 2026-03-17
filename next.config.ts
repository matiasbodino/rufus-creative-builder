import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pptxgenjs", "pdf-parse", "exceljs", "docx"],
};

export default nextConfig;
