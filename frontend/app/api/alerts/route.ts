import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const alertsPath = () => path.join(process.cwd(), "..", "processed", "alerts.json");

async function readAlerts(): Promise<unknown[]> {
  try {
    const raw = await readFile(alertsPath(), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// GET /api/alerts — return all alerts, optionally filtered by locationId
export async function GET(req: NextRequest) {
  const locationId = req.nextUrl.searchParams.get("locationId");

  let alerts = await readAlerts();

  if (locationId) {
    alerts = alerts.filter((a: any) => a.locationId === locationId);
  }

  // Sort: unresolved first, then by severity (critical > warning > info), then newest first
  const sevOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a: any, b: any) => {
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
    const sa = sevOrder[a.severity] ?? 3;
    const sb = sevOrder[b.severity] ?? 3;
    if (sa !== sb) return sa - sb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return NextResponse.json(alerts);
}

// PATCH /api/alerts — resolve or unresolve an alert by id
export async function PATCH(req: NextRequest) {
  try {
    const { id, resolved } = await req.json();
    if (!id || typeof resolved !== "boolean") {
      return NextResponse.json({ error: "Missing id or resolved field" }, { status: 400 });
    }

    const alerts = await readAlerts();
    let found = false;
    for (const alert of alerts as any[]) {
      if (alert.id === id) {
        alert.resolved = resolved;
        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await writeFile(alertsPath(), JSON.stringify(alerts, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 500 }
    );
  }
}
