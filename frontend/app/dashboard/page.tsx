"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Users, LayoutGrid, TrendingUp, MapPin,
  ChevronRight, Activity, Armchair,
} from "lucide-react";
import { officeLocations } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface LocationStats {
  id: string;
  name: string;
  city: string;
  country: string;
  totalDesks: number;
  occupied: number;
  available: number;
  occupancyRate: number;
  floors: number;
  hasData: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const stats: LocationStats[] = [];

      for (const office of officeLocations) {
        let totalDesks = office.totalDesks;
        let occupied = office.occupied;
        let hasData = office.totalDesks > 0;

        // Try to fetch live data from API
        try {
          const res = await fetch(`/api/data/${office.id}`);
          if (res.ok) {
            const data = await res.json();
            // API returns a flat array of records
            const records = Array.isArray(data) ? data : data.records;
            if (records && records.length > 0) {
              const physical = records.filter((r: Record<string, string>) =>
                r["Floor"] && r["Floor"] !== "WFH"
              );
              totalDesks = physical.length;
              occupied = physical.filter((r: Record<string, string>) =>
                r["Status"] === "Logged In"
              ).length;
              hasData = true;
            }
          }
        } catch {
          // Use mock data fallback
        }

        const available = totalDesks - occupied;
        const occupancyRate = totalDesks > 0 ? Math.round((occupied / totalDesks) * 100) : 0;

        stats.push({
          id: office.id,
          name: office.name,
          city: office.city,
          country: office.country,
          totalDesks,
          occupied,
          available,
          occupancyRate,
          floors: office.floors,
          hasData,
        });
      }

      setLocationStats(stats);
      setLoading(false);
    }

    loadStats();
  }, []);

  // Org-wide totals
  const totalDesks = locationStats.reduce((s, l) => s + l.totalDesks, 0);
  const totalOccupied = locationStats.reduce((s, l) => s + l.occupied, 0);
  const totalAvailable = totalDesks - totalOccupied;
  const orgOccupancy = totalDesks > 0 ? Math.round((totalOccupied / totalDesks) * 100) : 0;
  const activeLocations = locationStats.filter((l) => l.hasData).length;
  const totalFloors = locationStats.reduce((s, l) => s + l.floors, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Loading organization data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Activity className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">Organization Dashboard</h1>
            <p className="text-xs text-muted-foreground">Combined stats across all Firstsource locations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Locations", value: officeLocations.length, icon: Building2, color: "#2844C4" },
            { label: "Active Locations", value: activeLocations, icon: MapPin, color: "#43A047" },
            { label: "Total Desks", value: totalDesks.toLocaleString(), icon: LayoutGrid, color: "#113190" },
            { label: "Occupied", value: totalOccupied.toLocaleString(), icon: TrendingUp, color: "#E53935" },
            { label: "Available", value: totalAvailable.toLocaleString(), icon: Armchair, color: "#43A047" },
            { label: "Occupancy Rate", value: `${orgOccupancy}%`, icon: Activity, color: "#DF6014" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-4 flex flex-col items-center text-center">
              <Icon className="w-5 h-5 mb-2" style={{ color }} />
              <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Occupancy bar */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Overall Seat Utilization</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${orgOccupancy}%`,
                  backgroundColor: orgOccupancy > 85 ? "#E53935" : orgOccupancy > 60 ? "#DF6014" : "#43A047",
                }}
              />
            </div>
            <span className="text-sm font-bold min-w-[48px] text-right" style={{
              color: orgOccupancy > 85 ? "#E53935" : orgOccupancy > 60 ? "#DF6014" : "#43A047",
            }}>
              {orgOccupancy}%
            </span>
          </div>
          <div className="flex items-center gap-6 mt-3 text-xs text-muted-foreground">
            <span>{totalOccupied.toLocaleString()} occupied</span>
            <span>{totalAvailable.toLocaleString()} available</span>
            <span>{totalFloors} total floors</span>
          </div>
        </div>

        {/* Location breakdown table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Location Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Desks</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Occupied</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Available</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Occupancy</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {locationStats.map((loc) => (
                  <tr
                    key={loc.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/office/${loc.id}`)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{loc.name}</p>
                      <p className="text-[10px] text-muted-foreground">{loc.city}, {loc.country}</p>
                    </td>
                    <td className="text-right px-4 py-3 font-medium text-foreground tabular-nums">
                      {loc.totalDesks > 0 ? loc.totalDesks.toLocaleString() : "—"}
                    </td>
                    <td className="text-right px-4 py-3 font-medium tabular-nums" style={{
                      color: loc.occupied > 0 ? "#E53935" : "var(--muted-foreground)",
                    }}>
                      {loc.occupied > 0 ? loc.occupied.toLocaleString() : "—"}
                    </td>
                    <td className="text-right px-4 py-3 font-medium tabular-nums" style={{
                      color: loc.available > 0 ? "#43A047" : "var(--muted-foreground)",
                    }}>
                      {loc.totalDesks > 0 ? loc.available.toLocaleString() : "—"}
                    </td>
                    <td className="text-center px-4 py-3">
                      {loc.totalDesks > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${loc.occupancyRate}%`,
                                backgroundColor: loc.occupancyRate > 85 ? "#E53935" : loc.occupancyRate > 60 ? "#DF6014" : "#43A047",
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold tabular-nums" style={{
                            color: loc.occupancyRate > 85 ? "#E53935" : loc.occupancyRate > 60 ? "#DF6014" : "#43A047",
                          }}>
                            {loc.occupancyRate}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
                        loc.hasData
                          ? "bg-green-500/10 text-green-600"
                          : "bg-secondary text-muted-foreground"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          loc.hasData ? "bg-green-500" : "bg-muted-foreground/40"
                        )} />
                        {loc.hasData ? "Live" : "No Data"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-secondary/40 font-semibold">
                  <td className="px-5 py-3 text-foreground">Total ({officeLocations.length} locations)</td>
                  <td className="text-right px-4 py-3 text-foreground tabular-nums">{totalDesks.toLocaleString()}</td>
                  <td className="text-right px-4 py-3 tabular-nums" style={{ color: "#E53935" }}>{totalOccupied.toLocaleString()}</td>
                  <td className="text-right px-4 py-3 tabular-nums" style={{ color: "#43A047" }}>{totalAvailable.toLocaleString()}</td>
                  <td className="text-center px-4 py-3">
                    <span className="text-xs font-bold" style={{
                      color: orgOccupancy > 85 ? "#E53935" : orgOccupancy > 60 ? "#DF6014" : "#43A047",
                    }}>{orgOccupancy}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[10px] text-muted-foreground">{activeLocations} live</span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
