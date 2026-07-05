import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir, unlink } from "fs/promises";
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
    const productId = formData.get("productId") as string | null;
    const alt = formData.get("alt") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Formato non supportato" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const metadata = await sharp(buffer).metadata();

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

    // Save metadata to Convex
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const adminUserId = await resolveAdminUserId(convexUrl, adminToken);
      if (adminUserId) {
        await fetch(`${convexUrl}/api/mutation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "media:internalCreate",
            args: {
              filename,
              originalName: file.name,
              mimeType: file.type,
              size: webpBuffer.length,
              width: metadata.width ?? undefined,
              height: metadata.height ?? undefined,
              alt: alt ?? undefined,
              productId: productId ?? undefined,
              uploadedBy: adminUserId,
            },
          }),
        });
      }
    }

    return NextResponse.json({ url, filename, size: webpBuffer.length, width: metadata.width, height: metadata.height });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Errore durante il caricamento" }, { status: 500 });
  }
}

async function resolveAdminUserId(convexUrl: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "adminAuth:getCurrentUser",
        args: { token },
      }),
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user?._id ?? null;
  } catch {
    return null;
  }
}
