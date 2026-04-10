import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { getProjectRoot } from "@/lib/paths";

export async function GET() {
  const processedDir = path.join(getProjectRoot(), "processed");
  const allSnapshots: Record<string, unknown>[] = [];

  try {
    const locations = await readdir(processedDir);

    for (const loc of locations) {
      const historyPath = path.join(processedDir, loc, "history.json");
      try {
        const raw = await readFile(historyPath, "utf-8");
        const snapshots = JSON.parse(raw);
        allSnapshots.push(...snapshots);
      } catch {
        // No history for this location
      }
    }
  } catch {
    // processed dir doesn't exist
  }

  // Sort by timestamp
  allSnapshots.sort((a, b) =>
    String(a.timestamp).localeCompare(String(b.timestamp))
  );

  return NextResponse.json(allSnapshots);
}
