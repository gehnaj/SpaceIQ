"use client";

import { useState, useMemo } from "react";
import { Lightbulb, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";
import Topbar from "@/components/topbar";
import {
  floors, deptUtilization, hourlyOccupancy, weeklyTrend,
  monthlyTrend, getFloorStats, allDesks, zones
} from "@/lib/mock-data";

const TIME_RANGES = ["Today", "This Week", "This Month", "Custom"] as const;
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("This Week");

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

        {/* Time range toggle */}
        <div className="flex gap-1.5">
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
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Avg Desk Utilization", value: "73%", trend: "+6%", up: true },
            { label: "Peak Hour Occupancy", value: "158", trend: "+12 vs last week", up: true },
            { label: "Avg Daily Attendance", value: "79.8%", trend: "+4.2%", up: true },
            { label: "Reassignable Desks", value: "23", trend: "−3 vs last month", up: false },
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
