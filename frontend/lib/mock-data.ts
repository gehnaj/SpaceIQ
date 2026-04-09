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
  // ─── India ──────────────────────────────────────────────────────────────────
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
    id: "off-in-0",
    name: "Gurugram – Candor TechSpace",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    countryCode: "IN",
    address: "9th Floor, Building 4, Candor TechSpace, Sector 48, Gurugram, Haryana - 122018",
    lat: 28.4136,
    lng: 76.9845,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-0b",
    name: "Mumbai – Fourth Dimension",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    address: "1st, 2nd & 6th Floor, Fourth Dimension Building, Mindspace, Malad West, Mumbai, Maharashtra - 400064",
    lat: 19.1850,
    lng: 72.8340,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 3,
    timezone: "IST",
  },
  {
    id: "off-in-1",
    name: "Mumbai – Umang Towers",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    countryCode: "IN",
    address: "4th Floor, Umang Towers, Malad West, Mumbai, Maharashtra - 400064",
    lat: 19.1865,
    lng: 72.8312,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-2",
    name: "Bengaluru – BTG",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    countryCode: "IN",
    address: "Brigade Tech Gardens SEZ, Block C2 (2nd, 3rd Floor) & Block C4 (2nd Floor), Brooke fields, Kundalahalli Village, Marathahalli Post, Bengaluru, Karnataka - 560037",
    lat: 12.9563,
    lng: 77.7006,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 3,
    timezone: "IST",
  },
  {
    id: "off-in-3",
    name: "Bengaluru – BTP",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    countryCode: "IN",
    address: "2nd Floor, Tower B, Brigade Tech Park, Pattandur Agrahara Village, Whitefield Road, Bangalore, Karnataka - 560066",
    lat: 12.9698,
    lng: 77.7500,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-4",
    name: "Chennai – OTP",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    address: "3rd Floor, Platinum Holding Pvt Ltd, IT/ITES SEZ (Ozone Tech Park), No 2/1, Abu Garden, OMR, Navalur, Chennai, Tamil Nadu - 600130",
    lat: 12.8320,
    lng: 80.2290,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-5",
    name: "Chennai – Sandhya Infocity",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    address: "Block 4, 5th floor, Sandhya Infocity SEZ, 33 Old Mahabalipuram Rd, Navallur village, Chengalpattu District, Chennai, Tamil Nadu - 603103",
    lat: 12.8340,
    lng: 80.2260,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-6",
    name: "Chennai – Milenia",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    address: "RMZ Milenia Business Park, Phase 2, Campus 4A, 2nd Floor, No 143, Dr. M.G.R Road, Kadanchavadi, Chennai, Tamil Nadu - 600096",
    lat: 12.9567,
    lng: 80.2427,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-7",
    name: "Trichy – Raja Complex",
    city: "Trichy",
    state: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    address: "No 6/2, 2nd floor, Raja Trade Center, Bharathirayar Salai (McDonald's Road), Cantonment, Trichy, Tamil Nadu - 620001",
    lat: 10.8064,
    lng: 78.6872,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-8",
    name: "Pondicherry – Savitha Plaza",
    city: "Puducherry",
    state: "Puducherry",
    country: "India",
    countryCode: "IN",
    address: "Savitha Plaza, 1st floor, RS No. 12/2, 100 Feet Road, Annanagar, Puducherry - 605005",
    lat: 11.9340,
    lng: 79.8300,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  {
    id: "off-in-9",
    name: "Hyderabad – BSR-IT",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    countryCode: "IN",
    address: "1st & 5th Floor, Block 1, Survey No 142, BSR Builders LLP IT SEZ, Nanakramguda Village, Serilingampally Mandal, Hyderabad, Telangana - 500008",
    lat: 17.4167,
    lng: 78.3827,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 2,
    timezone: "IST",
  },
  {
    id: "off-in-10",
    name: "Vijayawada – Medha IT Tower",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    country: "India",
    countryCode: "IN",
    address: "1st Floor, Medha IT Tower, Module 01 & 05, ACE Urban Hitech City IT/ITES SEZ, Sy.No.53/1, Kesarpalli Village, Gannavaram Mandal, Krishna, Andhra Pradesh - 521102",
    lat: 16.5490,
    lng: 80.5768,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "IST",
  },
  // ─── Philippines ────────────────────────────────────────────────────────────
  {
    id: "off-ph-1",
    name: "Cebu – Skyrise 1",
    city: "Cebu City",
    state: "Cebu",
    country: "Philippines",
    countryCode: "PH",
    address: "3rd Floor, Skyrise 1 Building, Cebu IT Park, Apas, Cebu City, 6000",
    lat: 10.3310,
    lng: 123.9050,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "PHT",
  },
  {
    id: "off-ph-2",
    name: "McKinley – SH2",
    city: "Taguig City",
    state: "Metro Manila",
    country: "Philippines",
    countryCode: "PH",
    address: "2nd Floor, Science Hub - 2, Campus Avenue, McKinley Hill, Fort Bonifacio, Taguig City",
    lat: 14.5320,
    lng: 121.0498,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "PHT",
  },
  // ─── United Kingdom ─────────────────────────────────────────────────────────
  {
    id: "off-uk-1",
    name: "Belfast – Lincoln Building",
    city: "Belfast",
    state: "Northern Ireland",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Suites 302, 303, 304, 307, 308, Lincoln Building, 27-45 Great Victoria Street, 3rd floor, Belfast",
    lat: 54.5964,
    lng: -5.9340,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-2",
    name: "Birmingham – Tricorn House",
    city: "Birmingham",
    state: "England",
    country: "United Kingdom",
    countryCode: "GB",
    address: "3rd Floor, 51-53 Hagley Road, Birmingham, B16 8TP",
    lat: 52.4767,
    lng: -1.9128,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-3",
    name: "Londonderry – Springtown",
    city: "Derry",
    state: "Northern Ireland",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Springtown Business Park, Northland Road, Derry, BT48",
    lat: 55.0227,
    lng: -7.3000,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-4",
    name: "Derby – Pride Park",
    city: "Derby",
    state: "England",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Riverside Road, Pride Park, Derby, DE24 8HY",
    lat: 52.9165,
    lng: -1.4488,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-5",
    name: "Manchester – Arkwright House",
    city: "Manchester",
    state: "England",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Suite 415, Orega Arkwright House, Parsonage Gardens, Manchester - M3 2LF",
    lat: 53.4839,
    lng: -2.2476,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-6",
    name: "London – Lynton House",
    city: "London",
    state: "England",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Lynton House, 7-12 Tavistock Square, London, WC1H 9LT",
    lat: 51.5255,
    lng: -0.1275,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-7",
    name: "Middlesbrough – Centre Square",
    city: "Middlesbrough",
    state: "England",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Centre Square, Middlesbrough, TS1 2BD",
    lat: 54.5742,
    lng: -1.2350,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  {
    id: "off-uk-8",
    name: "Pontypridd – Llys Cadwyn",
    city: "Pontypridd",
    state: "Wales",
    country: "United Kingdom",
    countryCode: "GB",
    address: "Taff Street, Pontypridd, CF37 4TG",
    lat: 51.6010,
    lng: -3.3430,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GMT",
  },
  // ─── United States ──────────────────────────────────────────────────────────
  {
    id: "off-us-1",
    name: "New Jersey – Bridgewater",
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
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-us-2",
    name: "Amherst – Bryant Woods South",
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
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-us-3",
    name: "Sunrise – Corporate Center I",
    city: "Sunrise",
    state: "FL",
    country: "United States",
    countryCode: "US",
    address: "Corporate Center I, Suite 110, 1551 Sawgrass Corporate Parkway, Sunrise, FL 33323",
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
    id: "off-us-4",
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
    id: "off-us-5",
    name: "Chattanooga",
    city: "Chattanooga",
    state: "TN",
    country: "United States",
    countryCode: "US",
    address: "1232 Premier Dr., Suite 100, Chattanooga, TN 34721",
    lat: 35.0456,
    lng: -85.3097,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "CST",
  },
  {
    id: "off-us-6",
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
    floors: 1,
    timezone: "MST",
  },
  {
    id: "off-us-7",
    name: "York – Queensgate",
    city: "York",
    state: "PA",
    country: "United States",
    countryCode: "US",
    address: "Queensgate Towne Center, #2043, York, PA",
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
    id: "off-us-8",
    name: "Palm Bay – Commerce Park",
    city: "Palm Bay",
    state: "FL",
    country: "United States",
    countryCode: "US",
    address: "2330 Commerce Park Drive, NE, Suite 2, Palm Bay, FL 32905",
    lat: 27.9947,
    lng: -80.5887,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "EST",
  },
  {
    id: "off-us-9",
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
    id: "off-us-10",
    name: "LaPorte",
    city: "LaPorte",
    state: "IN",
    country: "United States",
    countryCode: "US",
    address: "127 East Shore Parkway, Suite A, LaPorte, IN 46350",
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
    id: "off-us-11",
    name: "Louisville – Atrium Centre",
    city: "Louisville",
    state: "KY",
    country: "United States",
    countryCode: "US",
    address: "10400 Linn Station Rd Suite 100, Louisville, KY 40223",
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
    id: "off-us-12",
    name: "Salt Lake City",
    city: "Salt Lake City",
    state: "UT",
    country: "United States",
    countryCode: "US",
    address: "Pacific Landing Office Park, Bldg A, 1355 S 4700 West, Salt Lake City, UT 84104",
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
    id: "off-us-13",
    name: "Chico",
    city: "Chico",
    state: "CA",
    country: "United States",
    countryCode: "US",
    address: "265 Airpark Ste. 100, Chico, CA 95928",
    lat: 39.7285,
    lng: -121.8375,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "PST",
  },
  {
    id: "off-us-14",
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
  // ─── Mexico ─────────────────────────────────────────────────────────────────
  {
    id: "off-mx-1",
    name: "Mexico City",
    city: "Mexico City",
    state: "CDMX",
    country: "Mexico",
    countryCode: "MX",
    address: "Paseo De La Reforma 26, Ciudad de Mexico 06600",
    lat: 19.4326,
    lng: -99.1332,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "CST",
  },
  // ─── Australia ──────────────────────────────────────────────────────────────
  {
    id: "off-au-1",
    name: "Melbourne",
    city: "Melbourne",
    state: "Victoria",
    country: "Australia",
    countryCode: "AU",
    address: "Level-9, 242 Exhibition Street, Melbourne 3000, Victoria",
    lat: -37.8118,
    lng: 144.9695,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "AEST",
  },
  // ─── UAE ────────────────────────────────────────────────────────────────────
  {
    id: "off-ae-1",
    name: "Dubai",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
    countryCode: "AE",
    address: "Office 231, 38th Floor, API Trio Tower, Sheikh Zayed Road, Al Barsha1, Dubai",
    lat: 25.1050,
    lng: 55.2260,
    status: "open",
    totalDesks: 0,
    occupied: 0,
    employees: 0,
    floors: 1,
    timezone: "GST",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

export type DeskStatus = "occupied" | "empty" | "unavailable" | "reserved";
export type EmployeeStatus = "in-office" | "away" | "remote" | "offline";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertType =
  | "occupancy_threshold"
  | "desks_offline"
  | "zone_inactive"
  | "idle_desks";

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
  locationId: string;
  locationName: string;
  floor: string | null;
  message: string;
  detail: string;
  recommendedAction: string;
  createdAt: string;
  captureDate: string;
  resolved: boolean;
  metric?: number;
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

// Alerts are now generated by process_location.py and served via /api/alerts

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
