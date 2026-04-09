import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const settingsPath = () => path.join(process.cwd(), "..", "processed", "settings.json");

const DEFAULTS = {
  critical: 95,
  standard: 85,
  warning: 75,
  offline_warn_pct: 20,
  offline_crit_pct: 30,
  idle_minutes: 1440,
  idle_count: 10,
};

async function readSettings() {
  try {
    const raw = await readFile(settingsPath(), "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

// GET /api/settings
export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await readSettings();
    const updated = { ...current, ...body };

    const dir = path.dirname(settingsPath());
    await mkdir(dir, { recursive: true });
    await writeFile(settingsPath(), JSON.stringify(updated, null, 2));

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    );
  }
}
