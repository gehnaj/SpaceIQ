# Office Locations Reference

## Global Office Summary
- **Total Offices:** 16
- **US Offices:** 14
- **International:** 2 (India, Philippines)
- **Total Desks:** 1,024
- **Total Employees:** 939
- **Total Floors:** 19

## Office Details by Region

### United States (14 Offices, 1,116 Desks, 891 Employees)

#### Northeast
1. **Bridgewater, NJ - HQ** ⭐
   - Location: 991 US Highway 22 West
   - Desks: 196 | Occupied: 148 | Employees: 162 | Floors: 5
   - Timezone: EST
   - Status: Open

2. **Amherst, NY - Bryant Woods**
   - Location: 205 & 125 Bryant Woods South
   - Desks: 120 | Occupied: 87 | Employees: 94 | Floors: 2
   - Timezone: EST
   - Status: Open

3. **York, PA - Queensgate**
   - Location: Queensgate Towne Center
   - Desks: 48 | Occupied: 31 | Employees: 36 | Floors: 1
   - Timezone: EST
   - Status: Open

4. **Kingston, NY - Grant Avenue**
   - Location: 709 Grant Ave
   - Desks: 36 | Occupied: 28 | Employees: 31 | Floors: 1
   - Timezone: EST
   - Status: Open

#### Southeast/South
5. **Sunrise, FL - Corporate Center I**
   - Location: 1551 Sawgrass Corporate Pkwy
   - Desks: 80 | Occupied: 62 | Employees: 68 | Floors: 1
   - Timezone: EST
   - Status: Open

6. **Palm Bay, FL - Commerce Park**
   - Location: 2330 Commerce Park Dr NE
   - Desks: 44 | Occupied: 18 | Employees: 23 | Floors: 1
   - Timezone: EST
   - Status: Partial ⚠️

7. **Chattanooga, TN**
   - Location: 1232 Premier Dr.
   - Desks: 56 | Occupied: 22 | Employees: 29 | Floors: 1
   - Timezone: CST
   - Status: Partial ⚠️

8. **Louisville, KY - Atrium Centre**
   - Location: 10400 Linn Station Rd
   - Desks: 60 | Occupied: 45 | Employees: 52 | Floors: 1
   - Timezone: EST
   - Status: Open

#### Midwest
9. **LaPorte, IN**
   - Location: 127 East Shore Pkwy
   - Desks: 40 | Occupied: 29 | Employees: 33 | Floors: 1
   - Timezone: CST
   - Status: Open

10. **Dayton, OH**
    - Location: 220 E Monument Ave
    - Desks: 44 | Occupied: 33 | Employees: 38 | Floors: 1
    - Timezone: EST
    - Status: Open

#### Mountain/West
11. **Colorado Springs, CO**
    - Location: 5724 Mark Dabling Blvd
    - Desks: 72 | Occupied: 55 | Employees: 61 | Floors: 2
    - Timezone: MST
    - Status: Open

12. **Salt Lake City, UT**
    - Location: Pacific Landing Office Park
    - Desks: 52 | Occupied: 38 | Employees: 44 | Floors: 1
    - Timezone: MST
    - Status: Open

#### West Coast
13. **Thousand Oaks, CA**
    - Location: 556 St Charles Dr STE 100
    - Desks: 64 | Occupied: 41 | Employees: 48 | Floors: 1
    - Timezone: PST
    - Status: Open

14. **Chico, CA**
    - Location: 265 Airpark Ste. 100
    - Desks: 32 | Occupied: 14 | Employees: 18 | Floors: 1
    - Timezone: PST
    - Status: Partial ⚠️

### International (2 Offices, 152 Desks, 140 Employees)

#### Asia-Pacific
15. **Mumbai, India** 🇮🇳
    - Location: Bandra Kurla Complex (BKC)
    - Desks: 88 | Occupied: 74 | Employees: 79 | Floors: 2
    - Timezone: IST (UTC+5:30)
    - Status: Open

16. **Cebu City, Philippines** 🇵🇭
    - Location: Cebu IT Park, Apas
    - Desks: 64 | Occupied: 58 | Employees: 61 | Floors: 1
    - Timezone: PHT (UTC+8)
    - Status: Open

---

## Occupancy Analysis

### By Status
- **Open:** 13 offices (high occupancy)
- **Partial:** 3 offices (reduced hours or capacity)
- **Closed:** 0 offices

### By Region
- **Northeast US:** 4 offices, 300 desks
- **Southeast US:** 3 offices, 180 desks
- **Midwest US:** 2 offices, 100 desks
- **Mountain/West US:** 2 offices, 124 desks
- **West Coast US:** 2 offices, 96 desks
- **Asia-Pacific:** 2 offices, 152 desks

### Occupancy Rates
- **Highest:** Bridgewater (76%)
- **Lowest:** Palm Bay (41%)
- **Average:** 66%
- **Most Utilized:** Cebu City (91%)
- **Least Utilized:** Chico (44%)

---

## Time Zones Represented

- **EST (Eastern):** 8 offices
- **CST (Central):** 2 offices
- **MST (Mountain):** 2 offices
- **PST (Pacific):** 2 offices
- **IST (India):** 1 office
- **PHT (Philippines):** 1 office

---

## Managing Multiple Locations

### Tips for Dashboard Usage

1. **View All:** Default view shows global metrics
2. **Filter by Office:** Use office selector on dashboard to focus on one location
3. **Global Map:** Click any office marker to zoom and see details
4. **Real-time Sync:** All offices update simultaneously
5. **Time Zone Aware:** Settings account for different business hours

### Meeting Across Offices

- Mumbai: IST (UTC+5:30) - Earliest by ~10 hours
- Cebu City: PHT (UTC+8) - 2.5 hours behind India
- US Time Zones: 13-16 hours behind India
- Best overlap: Early morning US + Evening India/Philippines

---

## Adding or Modifying Offices

To update office data, edit `/lib/mock-data.ts`:

```typescript
{
  id: "off-new",
  name: "New Office Name",
  city: "City",
  state: "State",
  country: "Country",
  countryCode: "XX",
  address: "Full Address",
  lat: 0.0,
  lng: 0.0,
  status: "open", // or "partial" or "closed"
  totalDesks: 100,
  occupied: 75,
  employees: 80,
  floors: 2,
  timezone: "EST",
}
```

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total Offices | 16 |
| Global Desks | 1,024 |
| Global Employees | 939 |
| Countries | 3 (US, India, Philippines) |
| Time Zones | 6 |
| Average Occupancy | 66% |
| Floors | 19 total |
| Open Offices | 13 (81%) |
| Partial Offices | 3 (19%) |

---

**Last Updated:** March 26, 2026
**Status:** All offices operational with real-time tracking
