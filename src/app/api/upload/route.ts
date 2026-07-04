import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { verifyAdminToken } from "@/lib/admin/api-auth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const adminToken = req.headers.get("x-admin-token") || formData.get("adminToken") as string;
    if (!adminToken || !(await verifyAdminToken(adminToken))) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Formato non supportato" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    const hash = crypto.createHash("md5").update(buffer).digest("hex").slice(0, 8);
    const filename = `${hash}-${Date.now()}.webp`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, webpBuffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({ url, filename, size: webpBuffer.length });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Errore durante il caricamento" }, { status: 500 });
  }
}
