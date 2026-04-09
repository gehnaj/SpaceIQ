import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const { locationId } = await params;
  const jsonPath = path.join(process.cwd(), "..", "processed", locationId, "seat-data.json");

  try {
    const raw = await readFile(jsonPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "No processed data for this location" }, { status: 404 });
  }
}
