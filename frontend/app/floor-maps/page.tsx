"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ZoomIn, ZoomOut, Search, Monitor, User,
  Clock, Cpu, Wifi, WifiOff, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";
import Topbar from "@/components/topbar";
import {
  athenaFloors, athenaDesks, getAthenaFloorStats, wfhSummary,
  GRID_COLUMNS, type AthenaDesk, type AthenaDeskStatus
} from "@/lib/athena-data";
import { cn } from "@/lib/utils";

// ─── Status color config (green / red / yellow) ─────────────────────────────

const statusConfig: Record<AthenaDeskStatus, { bg: string; border: string; label: string; pulse?: boolean }> = {
  occupied: {
    bg: "bg-[oklch(0.55_0.2_27)]/80",
    border: "border-[oklch(0.55_0.2_27)]",
    label: "Busy",
    pulse: true,
  },
  recent: {
    bg: "bg-[oklch(0.7_0.18_85)]/70",
    border: "border-[oklch(0.7_0.18_85)]",
    label: "Recently Vacated",
  },
  empty: {
    bg: "bg-[oklch(0.55_0.18_145)]/70",
    border: "border-[oklch(0.55_0.18_145)]",
    label: "Free",
  },
};

const statusColors: Record<AthenaDeskStatus, string> = {
  occupied: "oklch(0.55 0.2 27)",
  recent: "oklch(0.7 0.18 85)",
  empty: "oklch(0.55 0.18 145)",
};

// ─── Desk Tile ───────────────────────────────────────────────────────────────

function DeskTile({
  desk, scale, onClick,
}: {
  desk: AthenaDesk;
  scale: number;
  onClick: (d: AthenaDesk) => void;
}) {
  const cfg = statusConfig[desk.status];
  const size = Math.max(16, Math.round(24 * scale));
  const fontSize = Math.max(5, Math.round(7 * scale));

  // Extract short label from desk number (last part)
  const shortLabel = desk.deskno.split("-").pop()?.slice(-3) || "";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onClick(desk)}
            className={cn(
              "relative rounded-sm border transition-all duration-150 flex items-center justify-center cursor-pointer hover:scale-110 hover:z-10 hover:brightness-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
              cfg.bg,
              cfg.border,
            )}
            style={{ width: size, height: size }}
            aria-label={`Desk ${desk.deskno} — ${cfg.label}`}
          >
            {desk.status === "occupied" && (
              <span
                className="absolute inset-0 rounded-sm animate-pulse opacity-30"
                style={{ backgroundColor: statusColors.occupied }}
              />
            )}
            <span
              style={{ fontSize }}
              className="text-white/80 font-mono z-10 leading-none select-none"
            >
              {shortLabel}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs bg-card border-border text-foreground max-w-64">
          <p className="font-semibold">{desk.deskno}</p>
          <p className="text-muted-foreground">
            {cfg.label}
            {desk.logonUserName && <> &middot; {desk.logonUserName}</>}
          </p>
          {desk.since && (
            <p className="text-muted-foreground">Since: {desk.since}</p>
          )}
          {desk.computerName && (
            <p className="text-muted-foreground text-[10px]">{desk.computerName}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Floor Map Grid ──────────────────────────────────────────────────────────

function FloorMap({
  floorId, scale, filters, onDeskClick,
}: {
  floorId: string;
  scale: number;
  filters: { status: string; search: string };
  onDeskClick: (d: AthenaDesk) => void;
}) {
  const floorDesks = useMemo(() => {
    let desks = athenaDesks.filter((d) => d.floorId === floorId);
    if (filters.status && filters.status !== "all") {
      desks = desks.filter((d) => d.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      desks = desks.filter(
        (d) =>
          d.deskno.toLowerCase().includes(s) ||
          (d.logonUserName && d.logonUserName.toLowerCase().includes(s)) ||
          d.computerName.toLowerCase().includes(s)
      );
    }
    return desks;
  }, [floorId, filters]);

  const allFloorDesks = useMemo(
    () => athenaDesks.filter((d) => d.floorId === floorId),
    [floorId]
  );

  const gap = Math.max(2, Math.round(3 * scale));

  return (
    <div className="relative bg-secondary/20 rounded-xl border border-border p-6 overflow-auto">
      {/* Top feature blocks */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 h-7 rounded-md bg-secondary/60 border border-border flex items-center justify-center text-[9px] text-muted-foreground uppercase tracking-wider">
          Entrance
        </div>
        <div className="w-12 h-7 rounded-md bg-secondary/60 border border-border flex items-center justify-center text-[9px] text-muted-foreground">
          Elev.
        </div>
        <div className="flex-1 h-7 rounded-md bg-secondary/60 border border-border flex items-center justify-center text-[9px] text-muted-foreground uppercase tracking-wider">
          Meeting Rooms
        </div>
      </div>

      {/* Desk grid */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, auto)`, gap }}
      >
        {allFloorDesks.map((desk) => {
          const visible = floorDesks.find((d) => d.id === desk.id);
          return visible ? (
            <DeskTile
              key={desk.id}
              desk={desk}
              scale={scale}
              onClick={onDeskClick}
            />
          ) : (
            <div
              key={desk.id}
              className="rounded-sm opacity-15 bg-secondary border border-border"
              style={{
                width: Math.max(16, Math.round(24 * scale)),
                height: Math.max(16, Math.round(24 * scale)),
              }}
            />
          );
        })}
      </div>

      {/* Bottom feature blocks */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1 h-7 rounded-md bg-secondary/60 border border-border flex items-center justify-center text-[9px] text-muted-foreground uppercase tracking-wider">
          Pantry / Break Area
        </div>
        <div className="flex-1 h-7 rounded-md bg-secondary/60 border border-border flex items-center justify-center text-[9px] text-muted-foreground uppercase tracking-wider">
          Restrooms
        </div>
      </div>
    </div>
  );
}

// ─── Desk Detail Sheet ───────────────────────────────────────────────────────

function DeskDetailSheet({ desk, onClose }: { desk: AthenaDesk | null; onClose: () => void }) {
  if (!desk) return null;
  const cfg = statusConfig[desk.status];
  const floor = athenaFloors.find((f) => f.id === desk.floorId);

  return (
    <Sheet open={!!desk} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-80 bg-card border-border text-foreground overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base">{desk.deskno}</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {floor?.floorName} &middot; Athena Building
          </SheetDescription>
        </SheetHeader>

        <Badge
          className={`mb-4 border ${cfg.border} ${cfg.bg} text-white text-xs`}
        >
          {cfg.label}
        </Badge>

        <div className="space-y-4">
          {/* User info */}
          {desk.logonUserName ? (
            <div className="p-3 rounded-lg bg-secondary/60 space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {desk.logonUserName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {desk.status === "occupied" ? "Currently logged in" : "Last logged in user"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No logon data available
            </p>
          )}

          {/* Details */}
          <div className="space-y-2.5">
            {[
              { icon: Monitor, label: "Computer", value: desk.computerName },
              { icon: Cpu, label: "Asset Type", value: desk.assetType || "—" },
              ...(desk.model ? [{ icon: Cpu, label: "Model", value: desk.model }] : []),
              {
                icon: desk.status === "occupied" ? Wifi : WifiOff,
                label: "Status",
                value: cfg.label,
              },
              ...(desk.since
                ? [{ icon: Clock, label: "Since", value: desk.since }]
                : []),
              ...(desk.logonTime
                ? [{ icon: Clock, label: "Logon Time", value: desk.logonTime }]
                : []),
              ...(desk.logoffTime
                ? [{ icon: Clock, label: "Logoff Time", value: desk.logoffTime }]
                : []),
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">{label}</span>
                  <span className="text-xs font-medium text-foreground text-right break-all">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {desk.serialNumber && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">
                S/N: {desk.serialNumber}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function FloorMapsContent() {
  const searchParams = useSearchParams();
  const initialFloor = searchParams.get("floor") || athenaFloors[0]?.id || "";

  const [selectedFloor, setSelectedFloor] = useState(initialFloor);
  const [scale, setScale] = useState(1);
  const [selectedDesk, setSelectedDesk] = useState<AthenaDesk | null>(null);
  const [filters, setFilters] = useState({ status: "all", search: "" });

  const stats = useMemo(
    () => getAthenaFloorStats(selectedFloor),
    [selectedFloor]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Floor Maps — Athena" subtitle="Live seat-level occupancy" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Floor selector tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {athenaFloors.map((f) => {
            const s = getAthenaFloorStats(f.id);
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFloor(f.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                  selectedFloor === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                )}
              >
                {f.floorName}
                <span className="ml-1.5 opacity-60">
                  {s.occupied}/{s.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Desks", value: stats.total, color: "oklch(0.65 0.18 200)" },
            { label: "Busy", value: stats.occupied, color: statusColors.occupied },
            { label: "Recently Vacated", value: stats.recent, color: statusColors.recent },
            { label: "Free", value: stats.empty, color: statusColors.empty },
            {
              label: "Occupancy",
              value: `${stats.rate}%`,
              color: stats.rate > 80 ? statusColors.occupied : "oklch(0.65 0.18 200)",
            },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-xl font-bold mt-0.5" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* WFH banner */}
        <div className="flex items-center gap-2 bg-card/60 border border-border rounded-lg px-4 py-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{wfhSummary.loggedIn}</span> WFH users currently logged in
            <span className="text-muted-foreground/60 ml-1">({wfhSummary.total} WFH desks total)</span>
          </span>
        </div>

        {/* Filters + controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search desk, user, PC..."
              className="pl-8 h-8 text-xs w-48 bg-secondary/50 border-border"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger className="h-8 w-36 text-xs bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Status</SelectItem>
              <SelectItem value="occupied" className="text-xs">Busy</SelectItem>
              <SelectItem value="recent" className="text-xs">Recently Vacated</SelectItem>
              <SelectItem value="empty" className="text-xs">Free</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.min(s + 0.25, 2.5))}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.max(s - 0.25, 0.4))}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-5 flex-wrap">
          {(Object.entries(statusConfig) as [AthenaDeskStatus, typeof statusConfig.occupied][]).map(
            ([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm border ${cfg.bg} ${cfg.border}`} />
                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
              </div>
            )
          )}
        </div>

        {/* Map */}
        <FloorMap
          floorId={selectedFloor}
          scale={scale}
          filters={filters}
          onDeskClick={setSelectedDesk}
        />
      </div>

      <DeskDetailSheet
        desk={selectedDesk}
        onClose={() => setSelectedDesk(null)}
      />
    </div>
  );
}

export default function FloorMapsPage() {
  return (
    <Suspense>
      <FloorMapsContent />
    </Suspense>
  );
}
