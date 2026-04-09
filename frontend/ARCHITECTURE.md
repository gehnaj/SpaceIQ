# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Office Productivity Monitor                  │
│                     (Next.js 16 App Router)                     │
└─────────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │                        │
         ┌──────▼──────┐         ┌──────▼──────┐
         │   Sidebar   │         │   Topbar    │
         │ Navigation  │         │   Header    │
         └──────┬──────┘         └──────┬──────┘
                │                       │
       ┌────────▼────────┐      ┌──────▼──────┐
       │  Route Links    │      │ Page Title  │
       ├─ Dashboard (/)  │      │ Subtitle    │
       ├─ Offices       │      │ Icons       │
       ├─ Floor Maps    │      └─────────────┘
       ├─ Employees     │
       ├─ Analytics     │
       ├─ Alerts        │
       └─ Settings      │
```

## Page Architecture

```
┌─────────────────────────────────────────┐
│         Root Layout (layout.tsx)        │
│  - Sidebar Navigation                   │
│  - Main Content Area                    │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼──┐  ┌─────▼──┐  ┌────▼──┐
│       │  │        │  │       │
│ Page  │  │Topbar  │  │Sidebar│
│Content│  │        │  │       │
│       │  │        │  │       │
└───────┘  └────────┘  └───────┘
     │
     ├─ KPI Cards
     ├─ Charts/Visualizations
     ├─ Data Tables
     ├─ Filters & Search
     └─ Detail Panels/Sheets
```

## Data Flow

```
┌─────────────────────────────────────────┐
│      Mock Data (lib/mock-data.ts)       │
├─────────────────────────────────────────┤
│  - Buildings & Floors                   │
│  - Offices (16 locations)               │
│  - Employees (120+)                     │
│  - Desks (196)                          │
│  - Alerts (7+)                          │
│  - Analytics Data                       │
└────────────┬────────────────────────────┘
             │
    ┌────────▼─────────┐
    │  useMemo Hooks   │
    │  - getBuildingStats()
    │  - getFloorStats()
    │  - Filter logic
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Components      │
    │  - Render data   │
    │  - Charts        │
    │  - Tables        │
    │  - Cards         │
    └────────┬─────────┘
             │
         Display
```

## Component Hierarchy

```
RootLayout
├── AppSidebar
│   ├── Logo
│   ├── NavItems (7 pages)
│   ├── LiveStatus
│   └── CollapseToggle
├── Main Content
│   ├── Topbar
│   │   ├── Title
│   │   ├── Subtitle
│   │   └── Icons
│   └── Page Component
│       ├── KPI Cards
│       │   ├── Icon
│       │   ├── Value
│       │   └── Label
│       ├── Charts
│       │   ├── AreaChart
│       │   ├── BarChart
│       │   ├── LineChart
│       │   └── RadarChart
│       ├── Tables
│       │   ├── Headers
│       │   ├── Rows
│       │   └── Sorting
│       ├── Filters & Search
│       │   ├── Status Badge
│       │   ├── Search Input
│       │   └── Filter Buttons
│       ├── Detail Sheets
│       │   ├── Header
│       │   ├── Content
│       │   └── Actions
│       └── Map (Offices)
│           ├── World Map
│           ├── Markers
│           └── Zoom Controls
└── KeyboardShortcuts
    └── Shortcuts Panel
```

## Page Routes & Components

```
/                          (Dashboard)
├── Dashboard Overview
├── KPI Cards (6)
├── Charts (2)
├── Floor Summary
├── Alerts List
├── Quick Actions
└── Office Selector

/offices                   (Global Offices)
├── KPI Row (4 metrics)
├── Interactive Map
│   ├── Zoom Controls
│   ├── Markers (16)
│   ├── Legend
│   └── Tooltip
├── Detail Panel
│   ├── Office Info
│   ├── Status Badge
│   ├── KPI Cards (3)
│   ├── Occupancy Bar
│   ├── Address
│   └── CTA Button
└── Office List Sidebar
    └── Filterable List

/floor-maps               (Floor Layouts)
├── Floor Selector
├── Desk Grid
│   ├── Desk Tiles
│   ├── Status Colors
│   └── Hover Details
├── Filters
│   ├── Status Filter
│   └── Zone Filter
├── Heatmap View
└── Statistics

/employees               (Employee Directory)
├── Search Bar
├── Filters
│   ├── Department
│   └── Status
├── Employee Grid
│   ├── Cards
│   ├── Avatar
│   ├── Name
│   └── Badge
└── Detail Sheet
    ├── Full Info
    ├── Weekly Chart
    ├── Contact
    └── Attendance

/analytics              (Analytics)
├── Time Range Selector
├── Monthly Trend
├── Department Radar
├── Zone Heatmap
├── AI Insights
├── Recommendations
└── Export Button

/alerts                 (Alert Management)
├── Alert Stats (3)
├── Filters
│   ├── Severity
│   ├── Type
│   ├── Floor
│   └── Search
├── Alert Cards
│   ├── Icon
│   ├── Message
│   ├── Badge
│   └── Quick Actions
└── Detail Sheet
    ├── Full Details
    ├── Recommended Action
    └── Action Buttons

/settings              (Configuration)
├── Building Config
│   ├── Name Input
│   ├── Floors Input
│   └── Desks Input
├── Layout Settings
│   ├── Template Select
│   ├── Style Select
│   └── Toggles
├── Occupancy Rules
│   ├── Definition Text
│   ├── Timeout Slider
│   └── Logic Toggles
├── Alert Thresholds
│   ├── Occupancy %
│   ├── Inactivity Time
│   └── Offline Limit
├── Integrations
│   ├── Service Toggles
│   ├── Status Indicator
│   └── Config Fields
└── Action Buttons
    ├── Save
    ├── Cancel
    └── Reset
```

## Styling Architecture

```
Tailwind CSS v4
├── Configuration (tailwind.config.js)
├── Global Styles (app/globals.css)
│   ├── Design Tokens
│   │   ├── Colors (5 main + variants)
│   │   ├── Typography
│   │   └── Spacing
│   ├── Base Styles
│   ├── Utilities
│   └── Component Styles
├── Component Styles
│   └── shadcn/ui Components (40+)
└── Responsive Breakpoints
    ├── Mobile (< 640px)
    ├── Tablet (640-1024px)
    └── Desktop (> 1024px)

Color Tokens:
├── Primary: oklch(0.65 0.18 200) - Cyan
├── Accent: oklch(0.55 0.18 145) - Green
├── Destructive: oklch(0.55 0.2 27) - Red
├── Warning: oklch(0.7 0.18 85) - Amber
├── Background: oklch(0.13 0.005 240) - Navy
├── Card: oklch(0.17 0.006 240) - Dark Navy
└── Sidebar: oklch(0.10 0.005 240) - Darker Navy
```

## Integration Points (Future)

```
Frontend (Next.js)
      │
      ├── API Routes (/api/*)
      │   ├── /api/buildings
      │   ├── /api/offices
      │   ├── /api/employees
      │   ├── /api/desks
      │   ├── /api/alerts
      │   └── /api/analytics
      │
      ├── Database
      │   ├── PostgreSQL (primary)
      │   ├── MongoDB (alternative)
      │   └── Real-time sync
      │
      ├── Authentication
      │   ├── Auth.js
      │   ├── Supabase
      │   └── JWT Tokens
      │
      ├── Real-time Updates
      │   ├── WebSocket
      │   ├── Socket.io
      │   └── Server-Sent Events
      │
      ├── External Services
      │   ├── Slack API
      │   ├── Teams API
      │   ├── Google Calendar
      │   └── Analytics Platform
      │
      └── Monitoring
          ├── Sentry (error tracking)
          ├── PostHog (analytics)
          ├── Vercel Analytics
          └── Log aggregation
```

## Performance Optimization

```
Client-Side:
├── Code Splitting
├── Dynamic Imports
├── Image Optimization
├── Component Memoization
├── useMemo Hooks
└── Lazy Loading

Server-Side:
├── API Caching
├── Database Indexing
├── Query Optimization
└── Response Compression

Delivery:
├── CDN (Vercel Edge)
├── Gzip Compression
├── Minification
└── CSS Purging
```

## Security Layers

```
Client:
├── Input Validation
├── XSS Protection
└── CSRF Tokens

Server:
├── Rate Limiting
├── SQL Injection Prevention
├── Authorization Checks
└── Data Validation

Deployment:
├── HTTPS/TLS
├── Security Headers
├── CORS Policies
└── Environment Variables
```

## Development Workflow

```
┌────────────────┐
│  pnpm install  │
└────────┬───────┘
         │
┌────────▼────────┐
│ pnpm dev        │ → http://localhost:3000
└────────┬────────┘
         │
┌────────▼──────────────────┐
│   Make Changes            │
│   - Edit .tsx files       │
│   - Edit .css files       │
│   - Modify mock data      │
└────────┬──────────────────┘
         │
         ├─ Hot Reload (React)
         └─ Page Reload
         │
┌────────▼─────────────┐
│ Preview Changes      │
│ - Browser DevTools   │
│ - Network Tab        │
│ - React Profiler     │
└────────┬─────────────┘
         │
         NO ←─────┐
         │        │
         ├─ Debug & Fix
         │        │
         YES ─────┘
         │
┌────────▼─────────────┐
│ pnpm build           │
└────────┬─────────────┘
         │
┌────────▼─────────────┐
│ pnpm start           │
│ (Production Mode)    │
└────────┬─────────────┘
         │
┌────────▼─────────────┐
│ vercel deploy --prod │
│ (Deploy to Vercel)   │
└─────────────────────┘
```

---

**Created:** March 26, 2026
**Version:** 1.0
**Status:** Complete
