import { NextRequest, NextResponse } from "next/server";
import { access, readFile } from "fs/promises";
import { execSync } from "child_process";
import path from "path";
import { officeLocations } from "@/lib/mock-data";
import { getProjectRoot } from "@/lib/paths";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const { locationId } = await params;
  const projectRoot = getProjectRoot();

  const uploadDir = path.join(projectRoot, "uploads", locationId);
  const inventoryPath = path.join(uploadDir, "inventory.xlsx");
  const logonPath = path.join(uploadDir, "logon.xlsx");
  const datePath = path.join(uploadDir, "logon-date.txt");
  const timePath = path.join(uploadDir, "logon-time.txt");
  const outputPath = path.join(projectRoot, "processed", locationId, "seat-data.json");
  const scriptPath = path.join(projectRoot, "process_location.py");

  // Check both files exist
  try {
    await access(inventoryPath);
  } catch {
    return NextResponse.json({ success: false, message: "Inventory file not yet uploaded" }, { status: 400 });
  }

  try {
    await access(logonPath);
  } catch {
    return NextResponse.json({ success: false, message: "Logon file not yet uploaded" }, { status: 400 });
  }

  // Read date
  let date = new Date().toISOString().slice(0, 10); // fallback to today
  try {
    date = (await readFile(datePath, "utf-8")).trim();
  } catch {
    // use default
  }

  // Read time
  let time = "19:30"; // fallback
  try {
    time = (await readFile(timePath, "utf-8")).trim();
  } catch {
    // use default
  }

  // Look up location name
  const locationName = officeLocations.find((o) => o.id === locationId)?.name || locationId;

  // Run processing
  try {
    const cmd = `python "${scriptPath}" --inventory "${inventoryPath}" --logon "${logonPath}" --date "${date}" --time "${time}" --location "${locationId}" --location-name "${locationName}" --output "${outputPath}"`;
    const result = execSync(cmd, {
      cwd: projectRoot,
      timeout: 60000,
      encoding: "utf-8",
    });

    // Count records from output
    const match = result.match(/(\d+) records/);
    const records = match ? parseInt(match[1]) : 0;

    return NextResponse.json({ success: true, records, message: result.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
