# Office Productivity Monitor - Complete Application

## 📊 Overview
A comprehensive enterprise B2B SaaS dashboard for monitoring office occupancy, desk utilization, and employee productivity across multiple global office locations. The app provides real-time visibility into workplace metrics with drill-down analytics and management tools.

## ✨ Key Features

### 1. **Dashboard** (`/`)
- Real-time KPI cards: Total desks, occupancy, availability, utilization rate, active employees, floors online
- Hourly occupancy trend chart with live updates
- Weekly utilization bar chart
- Department-wise utilization breakdown
- Floor-by-floor summary with occupancy bands
- Recent alerts with severity indicators
- Quick action buttons for common tasks
- Global office selector to filter by location

### 2. **Global Offices** (`/offices`)
- Interactive world map using react-simple-maps with zoom and pan controls
- 16 office locations with real-time occupancy metrics:
  - **US Offices (14):** Bridgewater (HQ), Amherst, Sunrise, Thousand Oaks, Chattanooga, Colorado Springs, York, Palm Bay, Kingston, LaPorte, Louisville, Salt Lake City, Chico, Dayton
  - **International (2):** Mumbai (India), Cebu City (Philippines)
- Color-coded markers (green=open, amber=partial, red=closed)
- Detailed office info panel with occupancy bar, address, timezone, KPIs
- Searchable office list sidebar with occupancy percentages
- Global occupancy metrics at top

### 3. **Floor Maps** (`/floor-maps`)
- Interactive floor layout with desk grid view
- Desk-level status indicators (occupied, empty, reserved, unavailable)
- Department color coding
- Occupancy heatmap visualization
- Floor filtering and search
- Zoom controls for detailed inspection
- Zone breakdown by floor

### 4. **Employees** (`/employees`)
- Searchable employee directory with 120+ employees
- Filter by department, status (in-office/away/remote/offline)
- Employee cards with avatar, name, team, status badge
- Detail panel showing contact, availability, weekly attendance
- Daily duration tracking for in-office employees
- Last active timestamps

### 5. **Analytics** (`/analytics`)
- Monthly utilization trends
- Department-wise radar chart with utilization metrics
- Zone heatmap showing occupancy patterns
- AI-powered insights and recommendations
- Underutilized zone detection
- Peak occupancy times and patterns
- Downloadable reports

### 6. **Alerts** (`/alerts`)
- List of critical, warning, and info-level alerts
- Filter by severity, floor, type, and search
- Alert cards with context and severity badges
- Detail sheet showing recommended actions
- Mark resolved, investigate, assign, export functionality
- 7+ pre-loaded alert types (occupancy thresholds, offline desks, unauthorized access, after-hours activity, zone inactivity, network sync issues)

### 7. **Settings** (`/settings`)
- **Building Configuration:** Floor count, naming, desk allocation
- **Layout Settings:** Grid patterns, aisle spacing, clustering styles
- **Occupancy Rules:** Detection logic, timeouts, reserved desk handling
- **Alert Thresholds:** Customizable occupancy %, inactivity times, offline device limits
- **Integrations:** Network sync status, API endpoints, Websocket configuration (Slack, Teams, Google Calendar toggles)
- Collapsible sections for organized settings
- Save/Reset functionality with confirmation

## 🏗️ Architecture

### Pages & Routing
- `/` - Dashboard (office overview)
- `/offices` - Global office map
- `/floor-maps` - Floor layouts
- `/employees` - Employee directory
- `/analytics` - Advanced analytics
- `/alerts` - Alert management
- `/settings` - Configuration

### Components
- **Sidebar Navigation** - Collapsible nav with live sync indicator and alert badge
- **Topbar** - Page title and subtitle
- **Keyboard Shortcuts** - Cmd+K to toggle shortcuts panel

### Data Model
- **Building:** HQ Tower A, Innovation Hub B
- **Floors:** 5 floors with 40-48 desks each
- **Zones:** 10 zones for different teams
- **Desks:** 196 total desks with status tracking
- **Employees:** 120 employees across 8 departments
- **Alerts:** 7+ alert types with severity levels
- **Office Locations:** 16 global offices with occupancy stats

## 🎨 Design System

### Color Palette
- **Primary:** `oklch(0.65 0.18 200)` - Cyan/Blue
- **Accent:** `oklch(0.55 0.18 145)` - Green (available)
- **Danger:** `oklch(0.55 0.2 27)` - Red (occupied/high)
- **Warning:** `oklch(0.7 0.18 85)` - Amber (partial)
- **Background:** `oklch(0.13 0.005 240)` - Deep Navy
- **Card:** `oklch(0.17 0.006 240)` - Dark Navy
- **Sidebar:** `oklch(0.10 0.005 240)` - Darker Navy

### Typography
- **Sans:** Inter font
- **Mono:** Geist Mono (for technical content)
- Responsive sizes: xs (10px) to 2xl (24px)
- Font weights: normal to bold

### Components
- shadcn/ui components
- Recharts for visualizations
- React Simple Maps for world map
- Lucide icons for UI elements

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser to http://localhost:3000
```

### Key Technologies
- **Next.js 16** - App Router
- **React 19** - UI framework
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **react-simple-maps** - World map visualization
- **d3-geo** - Geospatial utilities
- **Lucide** - Icon set
- **TypeScript** - Type safety

## 📊 Mock Data

All data is generated from a comprehensive mock-data system with:
- Deterministic generation for consistency
- Realistic distribution curves
- Time-based variations
- Seeded randomization for reproducibility

Generate more employees or customize data by editing `/lib/mock-data.ts`.

## 🎯 Use Cases

1. **Facility Managers** - Monitor office capacity, book meeting spaces, manage hot-desking
2. **HR Directors** - Track attendance patterns, plan team events, optimize space usage
3. **Operations Teams** - Identify bottlenecks, resolve connectivity issues, manage alerts
4. **Executives** - Gain insights into office utilization, ROI on real estate, employee engagement
5. **IT Teams** - Monitor device connectivity, troubleshoot network issues via alerts

## 🔄 Real-time Features

- Live occupancy updates (mocked)
- Real-time alert generation
- Sync status indicator
- Auto-refresh capability
- Websocket-ready architecture (can be connected to actual backend)

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization (breakpoints at 640px, 1024px)
- Desktop full layouts
- Touch-friendly controls
- Optimized grid layouts

## 🛠️ Development

### File Structure
```
app/
├── page.tsx              # Dashboard
├── offices/page.tsx      # Global offices
├── floor-maps/page.tsx   # Floor layouts
├── employees/page.tsx    # Employee directory
├── analytics/page.tsx    # Analytics
├── alerts/page.tsx       # Alerts
├── settings/page.tsx     # Settings
└── layout.tsx            # Root layout

components/
├── app-sidebar.tsx       # Navigation sidebar
├── topbar.tsx            # Page header
├── keyboard-shortcuts.tsx # Shortcuts panel
└── ui/                   # shadcn/ui components

lib/
└── mock-data.ts          # All mock data and types
```

### Customization

**Change Office Locations:** Edit `officeLocations` array in `/lib/mock-data.ts`

**Adjust Thresholds:** Modify alert severity logic in `/app/alerts/page.tsx`

**Update Colors:** Edit CSS variables in `/app/globals.css`

**Add New Floors:** Extend `floors` array in `/lib/mock-data.ts`

## 🔐 Security Considerations

- All data is client-side mock data
- No authentication currently implemented
- Ready for API integration (add backend endpoints)
- Types are defined for real API responses

## 📈 Future Enhancements

- Real backend API integration
- User authentication and authorization
- Advanced reporting and exports
- Custom dashboard layouts
- Employee mobile app
- Integration with RFID/Bluetooth beacons
- Machine learning for occupancy prediction
- Slack/Teams notifications for alerts
- Calendar sync with meeting rooms
- Historical data retention

## 📄 License

Built with Vercel AI & shadcn/ui. Ready for production with minimal backend additions.

---

**Last Updated:** March 2026
**Version:** 1.0.0 Complete
**Status:** ✅ All 7 pages fully functional
