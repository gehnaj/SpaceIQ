"use client";

import { useState, useMemo } from "react";
import { Lightbulb, TrendingUp, TrendingDown, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import Topbar from "@/components/topbar";
import {
  floors, hourlyOccupancy, weeklyTrend,
  monthlyTrend, getFloorStats, allDesks, zones
} from "@/lib/mock-data";

const TIME_RANGES = ["Today", "This Week", "This Month"] as const;
type TimeRange = typeof TIME_RANGES[number];

const CHART_COLORS = [
  "oklch(0.65 0.18 200)",
  "oklch(0.55 0.18 145)",
  "oklch(0.7 0.18 85)",
  "oklch(0.55 0.2 27)",
  "oklch(0.6 0.18 275)",
  "oklch(0.65 0.15 220)",
  "oklch(0.6 0.18 180)",
  "oklch(0.7 0.12 260)",
];

const insights = [
  {
    type: "warning",
    text: "Floor 3 has consistently exceeded 90% occupancy between 10 AM and 2 PM.",
    color: "oklch(0.55 0.2 27)",
  },
  {
    type: "info",
    text: "North wing desks on Floor 2 are underutilized compared to the rest of the building.",
    color: "oklch(0.65 0.18 200)",
  },
  {
    type: "positive",
    text: "Engineering team has the highest in-office presence this week at 88%.",
    color: "oklch(0.55 0.18 145)",
  },
  {
    type: "info",
    text: "Average desk utilization is up 6% compared to last month.",
    color: "oklch(0.65 0.18 200)",
  },
  {
    type: "warning",
    text: "Friday attendance is 30% lower than mid-week — consider hotdesking policy.",
    color: "oklch(0.7 0.18 85)",
  },
];

const weekdayAttendance = [
  { day: "Monday", avg: 78 },
  { day: "Tuesday", avg: 83 },
  { day: "Wednesday", avg: 91 },
  { day: "Thursday", avg: 86 },
  { day: "Friday", avg: 61 },
];

const radarData = [
  { subject: "Engineering", A: 88 },
  { subject: "Design", A: 74 },
  { subject: "Product", A: 81 },
  { subject: "Sales", A: 65 },
  { subject: "Marketing", A: 52 },
  { subject: "Ops", A: 79 },
];

function tooltipStyle() {
  return {
    contentStyle: {
      backgroundColor: "oklch(0.17 0.006 240)",
      border: "1px solid oklch(0.25 0.007 240)",
      borderRadius: 6,
      fontSize: 11,
    },
    itemStyle: { color: "oklch(0.93 0.005 240)" },
    labelStyle: { color: "oklch(0.55 0.008 240)" },
  };
}

// ─── PDF colors (RGB) ───────────────────────────────────────────────────────

const C = {
  brand: [40, 68, 196] as const,
  brandLight: [230, 235, 250] as const,
  dark: [15, 15, 25] as const,
  text: [30, 30, 50] as const,
  muted: [120, 130, 150] as const,
  light: [240, 242, 248] as const,
  green: [50, 160, 80] as const,
  red: [220, 50, 50] as const,
  orange: [230, 150, 30] as const,
  blue: [60, 130, 210] as const,
  purple: [130, 90, 200] as const,
  barColors: [
    [60, 130, 210],
    [50, 160, 80],
    [200, 160, 40],
    [220, 80, 60],
    [130, 90, 200],
    [60, 170, 180],
    [200, 100, 150],
    [100, 140, 80],
  ] as number[][],
};

// ─── PDF Generator ──────────────────────────────────────────────────────────

async function generatePdfReport(
  timeRange: TimeRange,
  floorStats: { name: string; total: number; occupied: number; rate: number }[],
  zoneData: { name: string; utilization: number; occupied: number; total: number }[],
  chartData: { label: string; value: number }[],
) {
  const { default: jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();   // 210
  const ph = pdf.internal.pageSize.getHeight();   // 297
  const mx = 14; // margin x
  const usable = pw - mx * 2;
  const now = new Date();

  // ── Helper: set color ──
  const setFill = (c: readonly number[] | number[]) => pdf.setFillColor(c[0], c[1], c[2]);
  const setText = (c: readonly number[] | number[]) => pdf.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: readonly number[] | number[]) => pdf.setDrawColor(c[0], c[1], c[2]);

  // ── Helper: rounded rect ──
  const roundRect = (x: number, y: number, w: number, h: number, r: number, style: string) => {
    pdf.roundedRect(x, y, w, h, r, r, style);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1
  // ══════════════════════════════════════════════════════════════════════════

  // ── Header band ──
  setFill(C.dark);
  pdf.rect(0, 0, pw, 36, "F");
  setFill(C.brand);
  pdf.rect(0, 34, pw, 2.5, "F");

  setText([255, 255, 255]);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text("SpaceIQ", mx, 15);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  setText([170, 180, 210]);
  pdf.text("Seat Utilization \u2014 Analytics Report", mx, 22);

  pdf.setFontSize(8);
  setText([130, 140, 165]);
  pdf.text(`Period: ${timeRange}`, mx, 29);
  pdf.text(`Generated: ${now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`, pw - mx - 65, 29);

  let y = 44;

  // ── KPI Cards ──
  const kpis = [
    { label: "Avg Desk Utilization", value: "73%", trend: "+6%", up: true, accent: C.brand },
    { label: "Peak Hour Occupancy", value: "158", trend: "+12", up: true, accent: C.blue },
    { label: "Avg Daily Attendance", value: "79.8%", trend: "+4.2%", up: true, accent: C.green },
    { label: "Reassignable Desks", value: "23", trend: "-3", up: false, accent: C.orange },
  ];

  const cardW = (usable - 6) / 4;
  kpis.forEach((k, i) => {
    const cx = mx + i * (cardW + 2);
    // Card bg
    setFill(C.light);
    roundRect(cx, y, cardW, 22, 2, "F");
    // Accent left bar
    setFill(k.accent);
    pdf.rect(cx, y + 2, 1.2, 18, "F");

    // Label
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "normal");
    setText(C.muted);
    pdf.text(k.label.toUpperCase(), cx + 4, y + 6);

    // Value
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    setText(C.text);
    pdf.text(k.value, cx + 4, y + 15);

    // Trend
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    setText(k.up ? C.green : C.red);
    pdf.text(`${k.up ? "\u25B2" : "\u25BC"} ${k.trend}`, cx + 4, y + 20);
  });

  y += 30;

  // ── Utilization Trend Chart ──
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text(`${timeRange === "Today" ? "Occupancy by Hour" : "Utilization Trend"} \u2014 ${timeRange}`, mx, y);
  y += 5;

  // Chart area
  const chartX = mx + 8;
  const chartW = usable - 16;
  const chartH = 40;

  // Background
  setFill([248, 249, 252]);
  roundRect(mx, y - 2, usable, chartH + 6, 2, "F");

  // Grid lines
  setDraw([225, 228, 235]);
  pdf.setLineWidth(0.15);
  for (let g = 0; g <= 4; g++) {
    const gy = y + chartH - (g / 4) * chartH;
    pdf.line(chartX, gy, chartX + chartW, gy);
  }

  // Plot area chart as filled polygon
  if (chartData.length > 0) {
    const maxVal = Math.max(...chartData.map((d) => d.value), 1);
    const step = chartW / Math.max(chartData.length - 1, 1);

    // Fill
    setFill(C.brandLight);
    const points: number[][] = [];
    chartData.forEach((d, i) => {
      const px = chartX + i * step;
      const py = y + chartH - (d.value / maxVal) * chartH;
      points.push([px, py]);
    });

    pdf.moveTo(points[0][0], y + chartH);
    points.forEach(([px, py]) => pdf.lineTo(px, py));
    pdf.lineTo(points[points.length - 1][0], y + chartH);
    pdf.fill();

    // Line
    setDraw(C.brand);
    pdf.setLineWidth(0.5);
    for (let i = 0; i < points.length - 1; i++) {
      pdf.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }

    // X labels
    pdf.setFontSize(5.5);
    setText(C.muted);
    pdf.setFont("helvetica", "normal");
    const labelStep = Math.max(1, Math.floor(chartData.length / 8));
    chartData.forEach((d, i) => {
      if (i % labelStep === 0) {
        pdf.text(d.label, chartX + i * step, y + chartH + 4, { align: "center" });
      }
    });

    // Y labels
    for (let g = 0; g <= 4; g++) {
      const val = Math.round((g / 4) * maxVal);
      pdf.text(String(val), chartX - 2, y + chartH - (g / 4) * chartH + 1, { align: "right" });
    }
  }

  y += chartH + 12;

  // ── Department Utilization ──
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("Department Utilization", mx, y);
  y += 5;

  const deptBarH = 5;
  const deptMaxW = usable - 45;
  radarData.forEach((d, i) => {
    // Label
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(d.subject, mx, y + 3.5);

    // Bar background
    setFill(C.light);
    roundRect(mx + 30, y, deptMaxW, deptBarH, 1.5, "F");

    // Bar fill
    const bw = (d.A / 100) * deptMaxW;
    const color = C.barColors[i % C.barColors.length];
    setFill(color);
    roundRect(mx + 30, y, bw, deptBarH, 1.5, "F");

    // Value
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    setText(color);
    pdf.text(`${d.A}%`, mx + 30 + deptMaxW + 2, y + 3.5);

    y += deptBarH + 2;
  });

  y += 6;

  // ── Floor Occupancy ──
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("Occupancy by Floor", mx, y);
  y += 5;

  const floorBarH = 5.5;
  const floorMaxW = usable - 50;
  floorStats.forEach((f) => {
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(f.name, mx, y + 3.5);

    // Bar bg
    setFill(C.light);
    roundRect(mx + 24, y, floorMaxW, floorBarH, 1.5, "F");

    // Bar fill
    const bw = (f.rate / 100) * floorMaxW;
    const color = f.rate > 85 ? C.red : f.rate > 60 ? C.brand : C.green;
    setFill(color);
    roundRect(mx + 24, y, Math.max(bw, 2), floorBarH, 1.5, "F");

    // Value + detail
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    setText(color);
    pdf.text(`${f.rate}%`, mx + 24 + floorMaxW + 2, y + 3.5);
    pdf.setFont("helvetica", "normal");
    setText(C.muted);
    pdf.text(`${f.occupied}/${f.total}`, mx + 24 + floorMaxW + 14, y + 3.5);

    y += floorBarH + 1.5;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2
  // ══════════════════════════════════════════════════════════════════════════
  pdf.addPage();
  y = 16;

  // ── Weekday Attendance ──
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("Attendance by Weekday", mx, y);
  y += 4;

  const wBarW = (usable - 20) / weekdayAttendance.length;
  const wBarMaxH = 35;
  const wBaseY = y + wBarMaxH;

  // Grid
  setDraw([230, 233, 240]);
  pdf.setLineWidth(0.1);
  for (let g = 0; g <= 4; g++) {
    const gy = wBaseY - (g / 4) * wBarMaxH;
    pdf.line(mx, gy, mx + usable, gy);
    pdf.setFontSize(5.5);
    setText(C.muted);
    pdf.text(`${g * 25}%`, mx - 1, gy + 1, { align: "right" });
  }

  weekdayAttendance.forEach((d, i) => {
    const bx = mx + 10 + i * wBarW + wBarW * 0.15;
    const bw = wBarW * 0.7;
    const bh = (d.avg / 100) * wBarMaxH;
    const color = C.barColors[i % C.barColors.length];

    setFill(color);
    roundRect(bx, wBaseY - bh, bw, bh, 1.5, "F");

    // Day label
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(d.day.slice(0, 3), bx + bw / 2, wBaseY + 4.5, { align: "center" });

    // Value
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "bold");
    setText(color);
    pdf.text(`${d.avg}%`, bx + bw / 2, wBaseY - bh - 1.5, { align: "center" });
  });

  y = wBaseY + 14;

  // ── Zone Utilization Heatmap ──
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("Zone Utilization", mx, y);
  y += 5;

  const zoneCols = 4;
  const zoneW = (usable - (zoneCols - 1) * 2) / zoneCols;
  const zoneH = 16;

  zoneData.forEach((z, i) => {
    const col = i % zoneCols;
    const row = Math.floor(i / zoneCols);
    const zx = mx + col * (zoneW + 2);
    const zy = y + row * (zoneH + 2);

    // Cell bg
    const bg = z.utilization > 80 ? [255, 235, 230] : z.utilization > 60 ? [255, 248, 225] : [230, 248, 235];
    setFill(bg);
    roundRect(zx, zy, zoneW, zoneH, 2, "F");

    // Border
    const border = z.utilization > 80 ? [240, 200, 190] : z.utilization > 60 ? [240, 230, 190] : [200, 235, 210];
    setDraw(border);
    pdf.setLineWidth(0.3);
    roundRect(zx, zy, zoneW, zoneH, 2, "S");

    // Zone name
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(z.name, zx + 2.5, zy + 4.5);

    // Utilization value
    const valColor = z.utilization > 80 ? C.red : z.utilization > 60 ? C.orange : C.green;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    setText(valColor);
    pdf.text(`${z.utilization}%`, zx + 2.5, zy + 11.5);

    // Detail
    pdf.setFontSize(5.5);
    pdf.setFont("helvetica", "normal");
    setText(C.muted);
    pdf.text(`${z.occupied}/${z.total} desks`, zx + 2.5, zy + 14.5);
  });

  const zoneRows = Math.ceil(zoneData.length / zoneCols);
  y += zoneRows * (zoneH + 2) + 8;

  // ── AI Insights ──
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("\u{1F4A1} Insights", mx, y);
  y += 5;

  setFill([250, 251, 255]);
  roundRect(mx, y - 2, usable, insights.length * 8 + 4, 2, "F");
  setDraw([230, 235, 245]);
  pdf.setLineWidth(0.2);
  roundRect(mx, y - 2, usable, insights.length * 8 + 4, 2, "S");

  insights.forEach((ins, i) => {
    const iy = y + i * 8;

    // Colored accent dot
    const dotColor = ins.type === "warning" ? C.orange : ins.type === "positive" ? C.green : C.blue;
    setFill(dotColor);
    pdf.circle(mx + 4, iy + 1.5, 1.2, "F");

    // Text
    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(ins.text, mx + 8, iy + 2.5, { maxWidth: usable - 12 });
  });

  // ── Data Tables ──
  y += insights.length * 8 + 12;

  if (y + 40 > ph - 14) {
    pdf.addPage();
    y = 16;
  }

  // Floor data table
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("Detailed Floor Data", mx, y);
  y += 5;

  // Table header
  setFill(C.dark);
  roundRect(mx, y, usable, 6, 1.5, "F");
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  setText([255, 255, 255]);
  pdf.text("Floor", mx + 3, y + 4);
  pdf.text("Total Desks", mx + 45, y + 4);
  pdf.text("Occupied", mx + 75, y + 4);
  pdf.text("Rate", mx + 105, y + 4);
  y += 7;

  floorStats.forEach((f, i) => {
    if (i % 2 === 0) {
      setFill([248, 249, 252]);
      pdf.rect(mx, y - 1, usable, 5.5, "F");
    }
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(f.name, mx + 3, y + 2.5);
    pdf.text(String(f.total), mx + 45, y + 2.5);
    pdf.text(String(f.occupied), mx + 75, y + 2.5);
    pdf.setFont("helvetica", "bold");
    const rateColor = f.rate > 85 ? C.red : f.rate > 60 ? C.brand : C.green;
    setText(rateColor);
    pdf.text(`${f.rate}%`, mx + 105, y + 2.5);
    y += 5.5;
  });

  y += 8;

  // Zone data table
  if (y + 20 > ph - 14) {
    pdf.addPage();
    y = 16;
  }

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  setText(C.text);
  pdf.text("Detailed Zone Data", mx, y);
  y += 5;

  setFill(C.dark);
  roundRect(mx, y, usable, 6, 1.5, "F");
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  setText([255, 255, 255]);
  pdf.text("Zone", mx + 3, y + 4);
  pdf.text("Utilization", mx + 65, y + 4);
  pdf.text("Occupied", mx + 95, y + 4);
  pdf.text("Total", mx + 125, y + 4);
  y += 7;

  zoneData.forEach((z, i) => {
    if (i % 2 === 0) {
      setFill([248, 249, 252]);
      pdf.rect(mx, y - 1, usable, 5.5, "F");
    }
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(z.name, mx + 3, y + 2.5);
    pdf.setFont("helvetica", "bold");
    const uColor = z.utilization > 80 ? C.red : z.utilization > 60 ? C.orange : C.green;
    setText(uColor);
    pdf.text(`${z.utilization}%`, mx + 65, y + 2.5);
    pdf.setFont("helvetica", "normal");
    setText(C.text);
    pdf.text(String(z.occupied), mx + 95, y + 2.5);
    pdf.text(String(z.total), mx + 125, y + 2.5);
    y += 5.5;
  });

  // ── Footer on every page ──
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    // Footer line
    setDraw([220, 225, 235]);
    pdf.setLineWidth(0.2);
    pdf.line(mx, ph - 12, pw - mx, ph - 12);
    // Footer text
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica", "normal");
    setText(C.muted);
    pdf.text("SpaceIQ \u2014 Confidential", mx, ph - 8);
    setText([180, 185, 200]);
    pdf.text(`Page ${i} of ${pages}`, pw - mx, ph - 8, { align: "right" });
  }

  pdf.save(`SpaceIQ-Report-${timeRange.replace(/\s/g, "-")}-${now.toISOString().slice(0, 10)}.pdf`);
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("This Week");
  const [exporting, setExporting] = useState(false);

  const floorStats = useMemo(() =>
    floors.map(f => ({ name: f.floorName.replace("Floor ", "F").replace("Ground ", "G.").replace(" Floor", ""), ...getFloorStats(f.id) })),
    []
  );

  const zoneData = useMemo(() => {
    return zones.slice(0, 8).map(z => {
      const zDesks = allDesks.filter(d => d.zoneId === z.id);
      const occupied = zDesks.filter(d => d.status === "occupied").length;
      const avg = zDesks.reduce((s, d) => s + d.weeklyUtilization, 0) / (zDesks.length || 1);
      return { name: z.name, utilization: Math.round(avg), occupied, total: zDesks.length };
    }).sort((a, b) => b.utilization - a.utilization);
  }, []);

  const chartData = timeRange === "Today"
    ? hourlyOccupancy.map(h => ({ label: h.hour, value: h.occupied }))
    : timeRange === "This Week"
    ? weeklyTrend.map(w => ({ label: w.day, value: w.utilization }))
    : monthlyTrend.slice(0, 20).map(m => ({ label: m.date.replace("Jan ", ""), value: m.utilization }));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Analytics" subtitle="Utilization patterns and insights" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Time range toggle + download */}
        <div className="flex items-center gap-1.5">
          {TIME_RANGES.map(r => (
            <Button
              key={r}
              size="sm"
              variant={timeRange === r ? "default" : "outline"}
              className="h-7 text-xs"
              onClick={() => setTimeRange(r)}
            >
              {r}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs ml-auto gap-1.5"
            disabled={exporting}
            onClick={async () => {
              setExporting(true);
              try {
                await generatePdfReport(timeRange, floorStats, zoneData, chartData);
              } finally {
                setExporting(false);
              }
            }}
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {exporting ? "Generating..." : "Download Report"}
          </Button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Avg Desk Utilization", value: "73%", trend: "+6%", up: true },
            { label: "Peak Hour Occupancy", value: "158", trend: "+12 vs last week", up: true },
            { label: "Avg Daily Attendance", value: "79.8%", trend: "+4.2%", up: true },
            { label: "Reassignable Desks", value: "23", trend: "\u22123 vs last month", up: false },
          ].map(k => (
            <Card key={k.label} className="bg-card border-border">
              <CardContent className="pt-3 pb-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{k.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {k.up ? <TrendingUp className="w-3 h-3 text-[oklch(0.55_0.18_145)]" /> : <TrendingDown className="w-3 h-3 text-destructive" />}
                  <span className={`text-[10px] font-medium ${k.up ? "text-[oklch(0.55_0.18_145)]" : "text-destructive"}`}>{k.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Occupancy / utilization trend */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground">
                {timeRange === "Today" ? "Occupancy by Hour" : "Utilization Trend"} — {timeRange}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.18 200)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="oklch(0.65 0.18 200)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.007 240)" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "oklch(0.55 0.008 240)" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.55 0.008 240)" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle()} />
                  <Area type="monotone" dataKey="value" stroke="oklch(0.65 0.18 200)" fill="url(#grad1)" strokeWidth={2} name={timeRange === "Today" ? "Occupied" : "Utilization %"} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dept radar */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground">Dept. Utilization Radar</CardTitle>
            </CardHeader>
            <CardContent className="px-1 pb-2">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="oklch(0.25 0.007 240)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "oklch(0.55 0.008 240)" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: "oklch(0.55 0.008 240)" }} />
                  <Radar name="Utilization" dataKey="A" stroke="oklch(0.65 0.18 200)" fill="oklch(0.65 0.18 200)" fillOpacity={0.2} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Second charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Floor occupancy */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground">Occupancy by Floor</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={floorStats} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.007 240)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: "oklch(0.55 0.008 240)" }} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: "oklch(0.55 0.008 240)" }} tickLine={false} width={60} />
                  <Tooltip {...tooltipStyle()} formatter={(v: number) => [`${v}%`, "Occupancy"]} />
                  <Bar dataKey="rate" radius={[0, 3, 3, 0]}>
                    {floorStats.map((f, i) => (
                      <Cell key={i} fill={f.rate > 85 ? "oklch(0.55 0.2 27)" : f.rate > 60 ? "oklch(0.65 0.18 200)" : "oklch(0.55 0.18 145)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekday attendance */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground">Attendance by Weekday</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weekdayAttendance} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.007 240)" />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "oklch(0.55 0.008 240)" }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "oklch(0.55 0.008 240)" }} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle()} formatter={(v: number) => [`${v}%`, "Avg Attendance"]} />
                  <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
                    {weekdayAttendance.map((d, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Zone heatmap + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Zone heatmap */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-foreground">Zone Utilization Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="grid grid-cols-4 gap-2">
                {zoneData.map((z, i) => (
                  <div
                    key={z.name}
                    className="rounded-lg p-3 flex flex-col gap-1 border border-border/50"
                    style={{
                      backgroundColor: z.utilization > 80
                        ? "oklch(0.55 0.2 27 / 0.25)"
                        : z.utilization > 60
                        ? "oklch(0.7 0.18 85 / 0.2)"
                        : "oklch(0.55 0.18 145 / 0.15)"
                    }}
                  >
                    <p className="text-[10px] font-medium text-foreground leading-tight">{z.name}</p>
                    <p
                      className="text-lg font-bold leading-none"
                      style={{
                        color: z.utilization > 80
                          ? "oklch(0.55 0.2 27)"
                          : z.utilization > 60
                          ? "oklch(0.7 0.18 85)"
                          : "oklch(0.55 0.18 145)"
                      }}
                    >
                      {z.utilization}%
                    </p>
                    <p className="text-[9px] text-muted-foreground">{z.occupied}/{z.total} desks</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[oklch(0.7_0.18_85)]" />
                <CardTitle className="text-sm font-semibold text-foreground">AI Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-3">
              {insights.map((ins, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-1 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: ins.color, minHeight: 16 }} />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{ins.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
