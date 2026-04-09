"use client";
// Dashboard page - Athena Building overview
import { useMemo } from "react";
import Link from "next/link";
import {
  Building2, Users, MonitorSmartphone, LayoutGrid,
  TrendingUp, AlertTriangle, ArrowRight,
  Layers, Home
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  athenaFloors, getAthenaFloorStats, getAthenaBuildingStats,
} from "@/lib/athena-data";
import { alerts } from "@/lib/mock-data";
import Topbar from "@/components/topbar";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const statusColors = {
  occupied: "oklch(0.55 0.2 27)",
  recent: "oklch(0.7 0.18 85)",
  empty: "oklch(0.55 0.18 145)",
};

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}22` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const severityColor: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  warning: "bg-[oklch(0.7_0.18_85)]/20 text-[oklch(0.7_0.18_85)] border-[oklch(0.7_0.18_85)]/30",
  info: "bg-primary/20 text-primary border-primary/30",
};

export default function DashboardPage() {
  const stats = useMemo(() => getAthenaBuildingStats(), []);
  const floorStats = useMemo(
    () => athenaFloors.map((f) => ({ ...f, ...getAthenaFloorStats(f.id) })),
    []
  );
  const unresolvedAlerts = useMemo(
    () => alerts.filter((a) => !a.resolved).slice(0, 4),
    []
  );
  const mostOccupied = useMemo(
    () => [...floorStats].sort((a, b) => b.rate - a.rate)[0],
    [floorStats]
  );
  const underutilized = useMemo(
    () => floorStats.filter((f) => f.rate < 60).slice(0, 3),
    [floorStats]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Athena — Seat Utilization" subtitle="Real-time occupancy overview" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Total Desks" value={stats.total} sub="physical seats"
            icon={LayoutGrid} color="oklch(0.65 0.18 200)" />
          <KpiCard label="Busy" value={stats.occupied} sub="logged in now"
            icon={MonitorSmartphone} color={statusColors.occupied} />
          <KpiCard label="Free" value={stats.empty} sub="available"
            icon={LayoutGrid} color={statusColors.empty} />
          <KpiCard label="Occupancy" value={`${stats.rate}%`} sub="of all desks"
            icon={TrendingUp} color="oklch(0.65 0.18 200)" />
          <KpiCard label="Active Users" value={stats.activeUsers} sub="unique logins"
            icon={Users} color="oklch(0.6 0.18 275)" />
          <KpiCard label="Floors" value={stats.floorsOnline} sub="all reporting"
            icon={Building2} color="oklch(0.55 0.18 145)" />
        </div>

        {/* WFH banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-3 pb-3 flex items-center gap-3">
            <Home className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {stats.wfh.loggedIn} WFH users active
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.wfh.total} total WFH machines &middot; {stats.wfh.offline} offline &middot; {stats.wfh.noData} no data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floor summary + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Floor summary */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground">Floor-wise Summary</CardTitle>
                <Link href="/floor-maps">
                  <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground hover:text-foreground">
                    View Maps <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 space-y-2">
              {floorStats.map((f) => (
                <Link key={f.id} href={`/floor-maps?floor=${f.id}`}>
                  <div className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                    <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{f.floorName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {f.occupied} busy · {f.recent > 0 ? `${f.recent} recent · ` : ""}{f.empty} free · {f.total} total
                      </p>
                    </div>
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-muted-foreground">{f.rate}%</span>
                      </div>
                      {/* Stacked occupancy bar */}
                      <div className="h-1.5 rounded-full bg-border overflow-hidden flex">
                        {f.occupied > 0 && (
                          <div
                            className="h-full"
                            style={{
                              width: `${(f.occupied / f.total) * 100}%`,
                              backgroundColor: statusColors.occupied,
                            }}
                          />
                        )}
                        {f.recent > 0 && (
                          <div
                            className="h-full"
                            style={{
                              width: `${(f.recent / f.total) * 100}%`,
                              backgroundColor: statusColors.recent,
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] shrink-0"
                      style={{
                        color: f.rate > 80 ? statusColors.occupied : f.rate > 50 ? "oklch(0.65 0.18 200)" : statusColors.empty,
                        borderColor: f.rate > 80 ? "oklch(0.55 0.2 27 / 0.4)" : "oklch(0.25 0.007 240)",
                      }}
                    >
                      {f.rate > 80 ? "High" : f.rate > 50 ? "Moderate" : "Low"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Alerts + Highlights */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">Recent Alerts</CardTitle>
                  <Link href="/alerts">
                    <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-muted-foreground hover:text-foreground">
                      View All <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-2">
                {unresolvedAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded-md bg-secondary/40">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{
                      color: alert.severity === "critical" ? statusColors.occupied : alert.severity === "warning" ? statusColors.recent : "oklch(0.65 0.18 200)"
                    }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{alert.detail}</p>
                    </div>
                    <Badge className={`text-[10px] px-1.5 py-0 shrink-0 border ${severityColor[alert.severity]}`}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold text-foreground">Highlights</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Most Occupied</span>
                  <span className="text-xs font-semibold" style={{ color: statusColors.occupied }}>
                    {mostOccupied?.floorName} &middot; {mostOccupied?.rate}%
                  </span>
                </div>
                {underutilized.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Underutilized Floors</p>
                    {underutilized.map((f) => (
                      <div key={f.id} className="flex items-center justify-between">
                        <span className="text-xs text-foreground">{f.floorName}</span>
                        <span className="text-xs" style={{ color: statusColors.empty }}>{f.rate}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Color legend */}
                <div className="pt-2 border-t border-border space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Legend</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors.occupied }} />
                      <span className="text-[10px] text-muted-foreground">Busy</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors.recent }} />
                      <span className="text-[10px] text-muted-foreground">&lt;30m ago</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors.empty }} />
                      <span className="text-[10px] text-muted-foreground">Free</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <KeyboardShortcuts />
    </div>
  );
}
