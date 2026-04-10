import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getProjectRoot } from "@/lib/paths";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string; // "inventory" | "logon"
    const locationId = formData.get("locationId") as string;

    if (!file || !type || !locationId) {
      return NextResponse.json({ error: "Missing file, type, or locationId" }, { status: 400 });
    }

    // Save to uploads/{locationId}/{type}.xlsx
    const uploadDir = path.join(getProjectRoot(), "uploads", locationId);
    await mkdir(uploadDir, { recursive: true });

    const fileName = type === "inventory" ? "inventory.xlsx" : "logon.xlsx";
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // If logon data, also save the date and time metadata
    if (type === "logon") {
      const date = formData.get("date") as string;
      const time = formData.get("time") as string;
      if (date) {
        await writeFile(path.join(uploadDir, "logon-date.txt"), date);
      }
      if (time) {
        await writeFile(path.join(uploadDir, "logon-time.txt"), time);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${type} file uploaded for ${locationId}`,
      path: filePath,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Upload failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    );
  }
}
