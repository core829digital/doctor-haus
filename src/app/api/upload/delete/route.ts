import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { verifyAdminToken } from "@/lib/admin/api-auth";

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get("x-admin-token") || req.nextUrl.searchParams.get("token");
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const filename = req.nextUrl.searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "Filename richiesto" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", path.basename(filename));
    await unlink(filePath);

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Errore durante l'eliminazione" }, { status: 500 });
  }
}
