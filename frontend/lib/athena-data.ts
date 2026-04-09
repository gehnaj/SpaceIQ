import rawData from "./athena-seat-data.json";

// ─── Raw record shape from Python output ─────────────────────────────────────

interface RawSeatRecord {
  Building: string;
  Floor: string;
  Deskno: string;
  "Computer Name": string;
  "Serial Number": string | null;
  "Asset Type": string | null;
  Model: string | null;
  "Domain Name": string | null;
  "Logon User Name": string | null;
  "User Logon Count": number | null;
  "Logon Time": string | null;
  "Logoff Time": string | null;
  Status: string;
  Since: string;
  sinceMinutes: number | null;
}

// ─── Desk status: occupied (red), recent (yellow), empty (green) ─────────────

export type AthenaDeskStatus = "occupied" | "recent" | "empty";

export interface AthenaFloor {
  id: string;
  floorName: string;
  rawFloorKey: string;
  totalDesks: number;
}

export interface AthenaDesk {
  id: string;
  floorId: string;
  deskno: string;
  computerName: string;
  serialNumber: string | null;
  assetType: string | null;
  model: string | null;
  status: AthenaDeskStatus;
  logonUserName: string | null;
  logonTime: string | null;
  logoffTime: string | null;
  since: string;
  sinceMinutes: number | null;
  row: number;
  col: number;
}

// ─── Floor ordering and display names ────────────────────────────────────────

const FLOOR_CONFIG: { key: string; name: string }[] = [
  { key: "ground", name: "Ground Floor" },
  { key: "1st  Floor", name: "1st Floor" },
  { key: "2nd Floor", name: "2nd Floor" },
  { key: "3rd Floor", name: "3rd Floor" },
  { key: "4th Floor", name: "4th Floor" },
  { key: "5th Floor", name: "5th Floor" },
  { key: "6th Floor", name: "6th Floor" },
];

// ─── Derive status from raw record ───────────────────────────────────────────

function deriveStatus(rec: RawSeatRecord): AthenaDeskStatus {
  if (rec.Status === "Logged In") return "occupied";
  if (rec.Status === "Offline") {
    if (rec.sinceMinutes !== null && rec.sinceMinutes < 30) return "recent";
    return "empty";
  }
  return "empty";
}

// ─── Build floors ────────────────────────────────────────────────────────────

const records = rawData as RawSeatRecord[];

// Exclude WFH from physical floor maps
const physicalRecords = records.filter(
  (r) => r.Floor && r.Floor !== "WFH"
);

export const athenaFloors: AthenaFloor[] = FLOOR_CONFIG.filter((fc) =>
  physicalRecords.some((r) => r.Floor === fc.key)
).map((fc, i) => {
  const floorDesks = physicalRecords.filter((r) => r.Floor === fc.key);
  return {
    id: `ath-f${i}`,
    floorName: fc.name,
    rawFloorKey: fc.key,
    totalDesks: floorDesks.length,
  };
});

// ─── Build desks with grid positions ─────────────────────────────────────────

const GRID_COLS = 12;

export const athenaDesks: AthenaDesk[] = athenaFloors.flatMap((floor) => {
  const floorRecords = physicalRecords
    .filter((r) => r.Floor === floor.rawFloorKey)
    .sort((a, b) => (a.Deskno || "").localeCompare(b.Deskno || ""));

  return floorRecords.map((rec, i) => ({
    id: `${floor.id}-${i}`,
    floorId: floor.id,
    deskno: rec.Deskno || `Desk ${i + 1}`,
    computerName: rec["Computer Name"],
    serialNumber: rec["Serial Number"],
    assetType: rec["Asset Type"],
    model: rec.Model,
    status: deriveStatus(rec),
    logonUserName: rec["Logon User Name"],
    logonTime: rec["Logon Time"],
    logoffTime: rec["Logoff Time"],
    since: rec.Since || "",
    sinceMinutes: rec.sinceMinutes,
    row: Math.floor(i / GRID_COLS),
    col: i % GRID_COLS,
  }));
});

// ─── WFH summary ────────────────────────────────────────────────────────────

const wfhRecords = records.filter((r) => r.Floor === "WFH");
export const wfhSummary = {
  total: wfhRecords.length,
  loggedIn: wfhRecords.filter((r) => r.Status === "Logged In").length,
  offline: wfhRecords.filter((r) => r.Status === "Offline").length,
  noData: wfhRecords.filter((r) => r.Status === "").length,
};

// ─── Floor stats helper ──────────────────────────────────────────────────────

export function getAthenaFloorStats(floorId: string) {
  const desks = athenaDesks.filter((d) => d.floorId === floorId);
  const occupied = desks.filter((d) => d.status === "occupied").length;
  const recent = desks.filter((d) => d.status === "recent").length;
  const empty = desks.filter((d) => d.status === "empty").length;
  const total = desks.length;
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
  return { total, occupied, recent, empty, rate };
}

// ─── Building-level stats ────────────────────────────────────────────────────

export function getAthenaBuildingStats() {
  const total = athenaDesks.length;
  const occupied = athenaDesks.filter((d) => d.status === "occupied").length;
  const recent = athenaDesks.filter((d) => d.status === "recent").length;
  const empty = athenaDesks.filter((d) => d.status === "empty").length;
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const uniqueUsers = new Set(
    athenaDesks.filter((d) => d.logonUserName).map((d) => d.logonUserName)
  ).size;
  return {
    total,
    occupied,
    recent,
    empty,
    rate,
    activeUsers: uniqueUsers,
    floorsOnline: athenaFloors.length,
    wfh: wfhSummary,
  };
}

export const GRID_COLUMNS = GRID_COLS;
