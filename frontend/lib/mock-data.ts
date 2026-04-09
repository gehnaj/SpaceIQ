// ─── Office Locations ─────────────────────────────────────────────────────────

export type OfficeStatus = "open" | "closed" | "partial";

export interface OfficeLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  address: string;
  lat: number;
  lng: number;
  status: OfficeStatus;
  totalDesks: number;
  occupied: number;
  employees: number;
  floors: number;
  timezone: string;
}

export const officeLocations: OfficeLocation[] = [
  {
    id: "off-1",
    name: "Bridgewater HQ",
    city: "Bridgewater",
    state: "NJ",
    country: "United States",
    countryCode: "US",
    address: "991 US Highway 22 West, Suite 201, Bridgewater, NJ 08807",
    lat: 40.5936,
    lng: -74.6049,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 5,
    timezone: "EST",
  },
  {
    id: "off-2",
    name: "Amherst – Bryant Woods",
    city: "Amherst",
    state: "NY",
    country: "United States",
    countryCode: "US",
    address: "205 & 125 Bryant Woods South, Amherst, NY 14228",
    lat: 42.9870,
    lng: -78.8003,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 2,
    timezone: "EST",
  },
  {
    id: "off-3",
    name: "Sunrise – Corporate Center I",
    city: "Sunrise",
    state: "FL",
    country: "United States",
    countryCode: "US",
    address: "1551 Sawgrass Corporate Pkwy, Suite 110, Sunrise, FL 33323",
    lat: 26.1512,
    lng: -80.2561,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-4",
    name: "Thousand Oaks",
    city: "Thousand Oaks",
    state: "CA",
    country: "United States",
    countryCode: "US",
    address: "556 St Charles Dr STE 100, Thousand Oaks, CA 91360",
    lat: 34.1706,
    lng: -118.8376,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "PST",
  },
  {
    id: "off-5",
    name: "Chattanooga",
    city: "Chattanooga",
    state: "TN",
    country: "United States",
    countryCode: "US",
    address: "1232 Premier Dr., Suite 100, Chattanooga, TN 37421",
    lat: 35.0456,
    lng: -85.3097,
    status: "partial",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "CST",
  },
  {
    id: "off-6",
    name: "Colorado Springs",
    city: "Colorado Springs",
    state: "CO",
    country: "United States",
    countryCode: "US",
    address: "5724 Mark Dabling Blvd., Suite 200, Colorado Springs, CO 80919",
    lat: 38.9072,
    lng: -104.8127,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 2,
    timezone: "MST",
  },
  {
    id: "off-7",
    name: "York – Queensgate",
    city: "York",
    state: "PA",
    country: "United States",
    countryCode: "US",
    address: "Queensgate Towne Center #2043, York, PA",
    lat: 39.9626,
    lng: -76.7277,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-8",
    name: "Palm Bay – Commerce Park",
    city: "Palm Bay",
    state: "FL",
    country: "United States",
    countryCode: "US",
    address: "2330 Commerce Park Dr NE, Suite 2, Palm Bay, FL 32905",
    lat: 27.9947,
    lng: -80.5887,
    status: "partial",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-9",
    name: "Kingston – Grant Avenue",
    city: "Kingston",
    state: "NY",
    country: "United States",
    countryCode: "US",
    address: "709 Grant Ave., Kingston, NY 12449",
    lat: 41.9270,
    lng: -74.0059,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-10",
    name: "LaPorte",
    city: "LaPorte",
    state: "IN",
    country: "United States",
    countryCode: "US",
    address: "127 East Shore Pkwy, Suite A, LaPorte, IN 46350",
    lat: 41.6103,
    lng: -86.7228,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "CST",
  },
  {
    id: "off-11",
    name: "Louisville – Atrium Centre",
    city: "Louisville",
    state: "KY",
    country: "United States",
    countryCode: "US",
    address: "10400 Linn Station Rd, Suite 100, Louisville, KY 40223",
    lat: 38.2527,
    lng: -85.7585,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-12",
    name: "Salt Lake City",
    city: "Salt Lake City",
    state: "UT",
    country: "United States",
    countryCode: "US",
    address: "Pacific Landing Office Park, 1355 S 4700 West, Salt Lake City, UT 84104",
    lat: 40.7608,
    lng: -111.9816,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "MST",
  },
  {
    id: "off-13",
    name: "Chico",
    city: "Chico",
    state: "CA",
    country: "United States",
    countryCode: "US",
    address: "265 Airpark Ste. 100, Chico, CA 95928",
    lat: 39.7285,
    lng: -121.8375,
    status: "partial",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "PST",
  },
  {
    id: "off-14",
    name: "Dayton",
    city: "Dayton",
    state: "OH",
    country: "United States",
    countryCode: "US",
    address: "220 E Monument Ave, Suite 105, Dayton, OH 45402",
    lat: 39.7589,
    lng: -84.1916,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-15",
    name: "Mumbai – Athena Towers",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    address: "1st Floor, Athena Towers, Mindspace Malad, Goregaon (W), Mumbai – 400 063, India",
    lat: 19.1770,
    lng: 72.8385,
    status: "open",
    totalDesks: 2006,
    occupied: 1519,
    employees: 1519,
    floors: 7,
    timezone: "IST",
  },
  {
    id: "off-16",
    name: "Cebu City",
    city: "Cebu City",
    state: "Cebu",
    country: "Philippines",
    countryCode: "PH",
    address: "Cebu IT Park, Apas, Cebu City, Cebu 6000",
    lat: 10.3310,
    lng: 123.9050,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "PHT",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

export type DeskStatus = "occupied" | "empty" | "unavailable" | "reserved";
export type EmployeeStatus = "in-office" | "away" | "remote" | "offline";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertType =
  | "occupancy_threshold"
  | "desks_offline"
  | "unassigned_device"
  | "after_hours"
  | "zone_inactive"
  | "network_sync";

export interface Building {
  id: string;
  name: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  floorName: string;
  totalDesks: number;
}

export interface Zone {
  id: string;
  floorId: string;
  name: string;
}

export interface Desk {
  id: string;
  floorId: string;
  zoneId: string;
  status: DeskStatus;
  assignedEmployeeId: string | null;
  deviceConnected: boolean;
  lastActiveAt: string;
  row: number;
  col: number;
  weeklyUtilization: number;
}

export interface Employee {
  id: string;
  name: string;
  team: string;
  department: string;
  assignedDeskId: string;
  status: EmployeeStatus;
  avatar: string;
  email: string;
  todayDuration: string;
  weeklyAttendance: number[];
  lastActive: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  floorId: string | null;
  deskId: string | null;
  employeeId: string | null;
  message: string;
  detail: string;
  recommendedAction: string;
  createdAt: string;
  resolved: boolean;
}

// ─── Buildings ────────────────────────────────────────────────────────────────

export const buildings: Building[] = [
  { id: "b1", name: "HQ Tower A" },
  { id: "b2", name: "Innovation Hub B" },
];

// ─── Floors ───────────────────────────────────────────────────────────────────

export const floors: Floor[] = [
  { id: "f1", buildingId: "b1", floorNumber: 1, floorName: "Ground Floor", totalDesks: 40 },
  { id: "f2", buildingId: "b1", floorNumber: 2, floorName: "Floor 2", totalDesks: 48 },
  { id: "f3", buildingId: "b1", floorNumber: 3, floorName: "Floor 3", totalDesks: 48 },
  { id: "f4", buildingId: "b1", floorNumber: 4, floorName: "Floor 4", totalDesks: 36 },
  { id: "f5", buildingId: "b1", floorNumber: 5, floorName: "Executive Floor", totalDesks: 24 },
];

// ─── Zones ────────────────────────────────────────────────────────────────────

export const zones: Zone[] = [
  { id: "z1", floorId: "f1", name: "North Wing" },
  { id: "z2", floorId: "f1", name: "South Wing" },
  { id: "z3", floorId: "f2", name: "Engineering Pod" },
  { id: "z4", floorId: "f2", name: "Design Studio" },
  { id: "z5", floorId: "f3", name: "Operations Hub" },
  { id: "z6", floorId: "f3", name: "Product Zone" },
  { id: "z7", floorId: "f4", name: "Sales Floor" },
  { id: "z8", floorId: "f4", name: "Marketing Row" },
  { id: "z9", floorId: "f5", name: "C-Suite" },
  { id: "z10", floorId: "f5", name: "Board Area" },
];

// ─── Employees ────────────────────────────────────────────────────────────────

const firstNames = ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack",
  "Karen", "Leo", "Mia", "Nathan", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tina",
  "Uma", "Victor", "Wendy", "Xander", "Yara", "Zoe", "Aaron", "Beth", "Chris", "Diana",
  "Ethan", "Fiona", "George", "Hannah", "Ivan", "Julia", "Kevin", "Laura", "Mark", "Nina"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson",
  "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark",
  "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright",
  "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell"];
const departments = ["Engineering", "Design", "Product", "Sales", "Marketing", "Operations", "Finance", "HR"];
const teams: Record<string, string[]> = {
  Engineering: ["Backend", "Frontend", "DevOps", "QA"],
  Design: ["UX", "UI", "Brand"],
  Product: ["Growth", "Core", "Platform"],
  Sales: ["Enterprise", "SMB", "SDR"],
  Marketing: ["Content", "Demand Gen", "Events"],
  Operations: ["Facilities", "IT", "Procurement"],
  Finance: ["Accounting", "FP&A"],
  HR: ["Talent", "People Ops"],
};
const statuses: EmployeeStatus[] = ["in-office", "in-office", "in-office", "away", "remote", "offline"];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateEmployees(count = 120): Employee[] {
  return Array.from({ length: count }, (_, i) => {
    const dept = departments[i % departments.length];
    const teamList = teams[dept];
    const team = teamList[i % teamList.length];
    const status = statuses[i % statuses.length];
    return {
      id: `emp-${i + 1}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      team,
      department: dept,
      assignedDeskId: `desk-f${(i % 5) + 1}-${i + 1}`,
      status,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstNames[i % firstNames.length] + lastNames[i % lastNames.length])}`,
      email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@corp.com`,
      todayDuration: status === "in-office" ? `${3 + (i % 6)}h ${(i * 7) % 60}m` : "—",
      weeklyAttendance: [1, 2, 3, 4, 5].map(d => seededRandom(i * 5 + d) > 0.35 ? 1 : 0),
      lastActive: status === "in-office"
        ? `${(i % 30) + 1}m ago`
        : status === "away"
        ? `${(i % 3) + 1}h ago`
        : "Yesterday",
    };
  });
}

export const employees = generateEmployees(120);

// ─── Desks ────────────────────────────────────────────────────────────────────

function generateDesksForFloor(floorId: string, zoneIds: string[], total: number): Desk[] {
  const desks: Desk[] = [];
  const statuses: DeskStatus[] = ["occupied", "occupied", "occupied", "empty", "empty", "reserved", "unavailable"];
  let empIdx = parseInt(floorId.replace("f", "")) * 10;
  const cols = 8;

  for (let i = 0; i < total; i++) {
    const status = statuses[(i + parseInt(floorId.replace("f", ""))) % statuses.length] as DeskStatus;
    const zoneId = zoneIds[Math.floor(i / (total / zoneIds.length))];
    desks.push({
      id: `desk-${floorId}-${i + 1}`,
      floorId,
      zoneId: zoneId || zoneIds[0],
      status,
      assignedEmployeeId: status !== "unavailable" ? `emp-${(empIdx + i) % 120 + 1}` : null,
      deviceConnected: status === "occupied",
      lastActiveAt: status === "occupied" ? `${(i % 45) + 1}m ago` : `${(i % 8) + 1}h ago`,
      row: Math.floor(i / cols),
      col: i % cols,
      weeklyUtilization: status === "unavailable" ? 0 : Math.round(40 + seededRandom(i + parseInt(floorId.replace("f", ""))) * 60),
    });
  }
  return desks;
}

export const allDesks: Desk[] = [
  ...generateDesksForFloor("f1", ["z1", "z2"], 40),
  ...generateDesksForFloor("f2", ["z3", "z4"], 48),
  ...generateDesksForFloor("f3", ["z5", "z6"], 48),
  ...generateDesksForFloor("f4", ["z7", "z8"], 36),
  ...generateDesksForFloor("f5", ["z9", "z10"], 24),
];

// ─── Alerts ───────────────────────────────────────────────────────────────────

export const alerts: Alert[] = [
  {
    id: "a1", type: "occupancy_threshold", severity: "critical",
    floorId: "f3", deskId: null, employeeId: null,
    message: "Floor 3 occupancy exceeds 90% threshold",
    detail: "Floor 3 has 44/48 desks occupied, crossing the 90% alert threshold set for operational safety.",
    recommendedAction: "Notify facilities team and consider redirecting new arrivals to Floor 2.",
    createdAt: "2024-01-15T10:23:00Z", resolved: false,
  },
  {
    id: "a2", type: "unassigned_device", severity: "warning",
    floorId: "f2", deskId: "desk-f2-12", employeeId: null,
    message: "Device connected from unassigned desk",
    detail: "An unregistered device connected from desk F2-12 at 09:47. No employee is assigned to this desk.",
    recommendedAction: "Investigate desk F2-12 and check with IT for unauthorized access.",
    createdAt: "2024-01-15T09:47:00Z", resolved: false,
  },
  {
    id: "a3", type: "after_hours", severity: "warning",
    floorId: "f5", deskId: "desk-f5-3", employeeId: "emp-101",
    message: "Desk occupied outside business hours",
    detail: "Desk F5-3 shows active session at 22:15, outside the defined 08:00–20:00 window.",
    recommendedAction: "Verify with employee or escalate to security.",
    createdAt: "2024-01-14T22:15:00Z", resolved: true,
  },
  {
    id: "a4", type: "desks_offline", severity: "warning",
    floorId: "f1", deskId: null, employeeId: null,
    message: "5 desks went offline on Ground Floor",
    detail: "Desks F1-7 through F1-11 lost network connection at 11:30. Possible switch issue in North Wing.",
    recommendedAction: "Dispatch IT to check the North Wing network switch.",
    createdAt: "2024-01-15T11:30:00Z", resolved: false,
  },
  {
    id: "a5", type: "zone_inactive", severity: "info",
    floorId: "f4", deskId: null, employeeId: null,
    message: "Marketing Row on Floor 4 inactive for 3+ hours",
    detail: "No activity detected in the Marketing Row zone since 08:00. 12 desks all show empty status.",
    recommendedAction: "Check with Marketing team lead regarding attendance today.",
    createdAt: "2024-01-15T11:00:00Z", resolved: false,
  },
  {
    id: "a6", type: "network_sync", severity: "info",
    floorId: null, deskId: null, employeeId: null,
    message: "Network data sync delayed by 45 seconds",
    detail: "Live sync feed experienced a 45-second lag at 10:05. Data has since recovered.",
    recommendedAction: "Monitor sync latency. If delay recurs, restart the sync service.",
    createdAt: "2024-01-15T10:05:00Z", resolved: true,
  },
  {
    id: "a7", type: "occupancy_threshold", severity: "critical",
    floorId: "f2", deskId: null, employeeId: null,
    message: "Floor 2 at 87% — approaching threshold",
    detail: "Floor 2 Engineering Pod is filling rapidly. Currently 42/48 desks occupied.",
    recommendedAction: "Pre-alert facilities. Prepare overflow space on Floor 1.",
    createdAt: "2024-01-15T09:15:00Z", resolved: false,
  },
];

// ─── Hourly occupancy (today) ─────────────────────────────────────────────────

export const hourlyOccupancy = [
  { hour: "6 AM", occupied: 4 },
  { hour: "7 AM", occupied: 18 },
  { hour: "8 AM", occupied: 52 },
  { hour: "9 AM", occupied: 98 },
  { hour: "10 AM", occupied: 142 },
  { hour: "11 AM", occupied: 158 },
  { hour: "12 PM", occupied: 131 },
  { hour: "1 PM", occupied: 118 },
  { hour: "2 PM", occupied: 152 },
  { hour: "3 PM", occupied: 148 },
  { hour: "4 PM", occupied: 129 },
  { hour: "5 PM", occupied: 87 },
  { hour: "6 PM", occupied: 41 },
  { hour: "7 PM", occupied: 14 },
];

export const weeklyTrend = [
  { day: "Mon", utilization: 78 },
  { day: "Tue", utilization: 82 },
  { day: "Wed", utilization: 91 },
  { day: "Thu", utilization: 85 },
  { day: "Fri", utilization: 62 },
];

export const deptUtilization = [
  { dept: "Engineering", utilization: 88, headcount: 34 },
  { dept: "Design", utilization: 74, headcount: 12 },
  { dept: "Product", utilization: 81, headcount: 18 },
  { dept: "Sales", utilization: 65, headcount: 22 },
  { dept: "Marketing", utilization: 52, headcount: 14 },
  { dept: "Operations", utilization: 79, headcount: 10 },
  { dept: "Finance", utilization: 70, headcount: 8 },
  { dept: "HR", utilization: 68, headcount: 6 },
];

export const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  utilization: Math.round(55 + seededRandom(i * 3) * 40),
}));

// ─── Computed helpers ─────────────────────────────────────────────────────────

export function getFloorStats(floorId: string) {
  const desks = allDesks.filter(d => d.floorId === floorId);
  const occupied = desks.filter(d => d.status === "occupied").length;
  const empty = desks.filter(d => d.status === "empty").length;
  const unavailable = desks.filter(d => d.status === "unavailable").length;
  const reserved = desks.filter(d => d.status === "reserved").length;
  const total = desks.length;
  const rate = total > 0 ? Math.round((occupied / (total - unavailable)) * 100) : 0;
  return { total, occupied, empty, reserved, unavailable, rate };
}

export function getBuildingStats() {
  const total = allDesks.length;
  const occupied = allDesks.filter(d => d.status === "occupied").length;
  const empty = allDesks.filter(d => d.status === "empty").length;
  const unavailable = allDesks.filter(d => d.status === "unavailable").length;
  const rate = Math.round((occupied / (total - unavailable)) * 100);
  const activeEmployees = employees.filter(e => e.status === "in-office").length;
  return { total, occupied, empty, unavailable, rate, activeEmployees, floorsOnline: floors.length };
}
