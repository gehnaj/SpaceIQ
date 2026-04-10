import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getProjectRoot } from "@/lib/paths";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const { locationId } = await params;
  const historyPath = path.join(
    getProjectRoot(),
    "processed",
    locationId,
    "history.json"
  );

  try {
    const raw = await readFile(historyPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
