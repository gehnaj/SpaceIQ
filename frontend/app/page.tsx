"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  Building2, Users, LayoutGrid, MapPin, X, TrendingUp,
  Clock, Globe, ChevronRight, PanelRightOpen, PanelRightClose,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { officeLocations, type OfficeLocation } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const STATUS_COLORS: Record<string, { dot: string; label: string; badge: string }> = {
  open: {
    dot: "#43A047",
    label: "Open",
    badge: "bg-[oklch(0.55_0.18_145)]/15 text-[oklch(0.55_0.18_145)] border-[oklch(0.55_0.18_145)]/30",
  },
  partial: {
    dot: "#F9A825",
    label: "Partial",
    badge: "bg-[oklch(0.7_0.18_85)]/15 text-[oklch(0.7_0.18_85)] border-[oklch(0.7_0.18_85)]/30",
  },
  closed: {
    dot: "oklch(0.55 0.22 27)",
    label: "Closed",
    badge: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

// ─── Office list item ────────────────────────────────────────────────────────

function OfficeListItem({
  office, selected, onSelect,
}: {
  office: OfficeLocation; selected: boolean; onSelect: () => void;
}) {
  const st = STATUS_COLORS[office.status];
  const rate = Math.round((office.occupied / office.totalDesks) * 100);
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors border",
        selected
          ? "bg-primary/10 border-primary/30"
          : "bg-secondary/30 border-transparent hover:bg-secondary/60 hover:border-border"
      )}
    >
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: st.dot }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{office.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {office.city}{office.state && office.state !== office.city ? `, ${office.state}` : ""} &middot; {office.country}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-semibold" style={{
          color: rate > 85 ? "#E53935" : rate > 60 ? "#2844C4" : "#43A047",
        }}>{rate}%</p>
        <p className="text-[9px] text-muted-foreground">occupied</p>
      </div>
    </button>
  );
}

// ─── Office detail panel ─────────────────────────────────────────────────────

function OfficeDetailPanel({
  office, onClose, onViewDashboard,
}: {
  office: OfficeLocation; onClose: () => void; onViewDashboard: () => void;
}) {
  const st = STATUS_COLORS[office.status];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug truncate">{office.name}</p>
            <p className="text-xs text-muted-foreground">
              {office.city}, {office.state} &middot; {office.country}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Badge className={cn("text-[10px] px-2 py-0.5 border font-medium", st.badge)}>
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: st.dot }} />
          {st.label}
        </Badge>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />{office.timezone}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
          <MapPin className="w-3 h-3" />{office.floors} {office.floors === 1 ? "floor" : "floors"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: "Total Desks", value: office.totalDesks, icon: LayoutGrid, color: "#2844C4" },
          { label: "Occupied", value: office.occupied, icon: TrendingUp, color: "#E53935" },
          { label: "Employees", value: office.employees, icon: Users, color: "#6CB1DB" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
            <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
            <p className="text-base font-bold text-foreground leading-none">{value}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-secondary/40 border border-border">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-medium">Address</p>
        <p className="text-xs text-foreground leading-relaxed">{office.address}</p>
      </div>

      <div className="mt-auto pt-4">
        <Button size="sm" className="w-full h-9 text-xs font-medium gap-1.5" onClick={onViewDashboard}>
          View Dashboard <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<OfficeLocation | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [hovered, setHovered] = useState<OfficeLocation | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [panelOpen, setPanelOpen] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectOffice = useCallback((office: OfficeLocation) => {
    setSelected(office);
    setHovered(null);
    setCenter([office.lng, office.lat]);
    setZoom(4);
    setPanelOpen(true);
  }, []);

  const handleBack = useCallback(() => {
    setSelected(null);
    setZoom(1);
    setCenter([0, 20]);
  }, []);

  const handleMarkerMouseEnter = useCallback((office: OfficeLocation, e: React.MouseEvent) => {
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHovered(office);
  }, []);

  const totalDesks = officeLocations.reduce((s, o) => s + o.totalDesks, 0);
  const totalOccupied = officeLocations.reduce((s, o) => s + o.occupied, 0);
  const totalEmployees = officeLocations.reduce((s, o) => s + o.employees, 0);
  const openCount = officeLocations.filter((o) => o.status === "open").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* KPI strip */}
      <div className="shrink-0 border-b border-border bg-card/60 px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">SpaceIQ — Locations</span>
        </div>
        <div className="flex gap-5 ml-auto text-xs">
          {[
            { label: "Offices", value: officeLocations.length, color: "#2844C4" },
            { label: "Open", value: openCount, color: "#43A047" },
            { label: "Employees", value: totalEmployees.toLocaleString(), color: "#6CB1DB" },
            { label: "Occupancy", value: `${Math.round((totalOccupied / totalDesks) * 100)}%`, color: "#2844C4" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-bold" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map + Panel */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* Map area — dark background for visual richness */}
        <div className="flex-1 relative bg-[#F5F7FA]">
          {/* Zoom controls */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur border border-border rounded-md px-2 py-1.5 shadow-sm">
            <span className="text-[10px] text-muted-foreground mr-0.5">Zoom</span>
            <button onClick={() => setZoom((z) => Math.min(z * 1.6, 16))} className="w-5 h-5 rounded text-xs font-bold text-foreground hover:bg-secondary transition-colors flex items-center justify-center">+</button>
            <button onClick={() => { setZoom(1); setCenter([0, 20]); setSelected(null); }} className="w-5 h-5 rounded text-[11px] font-medium text-muted-foreground hover:bg-secondary transition-colors flex items-center justify-center">↺</button>
            <button onClick={() => setZoom((z) => Math.max(z / 1.6, 1))} className="w-5 h-5 rounded text-xs font-bold text-foreground hover:bg-secondary transition-colors flex items-center justify-center">−</button>
          </div>

          {/* Panel toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-md bg-white/90 backdrop-blur border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {panelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 bg-white/90 backdrop-blur border border-border rounded-md px-3 py-2 shadow-sm">
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: val.dot }} />
                <span className="text-[10px] text-muted-foreground capitalize">{val.label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div
            ref={mapContainerRef}
            className="w-full h-full relative"
            onMouseMove={(e) => {
              if (!hovered) return;
              const rect = mapContainerRef.current?.getBoundingClientRect();
              if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
          >
            <ComposableMap projection="geoMercator" style={{ width: "100%", height: "100%" }} projectionConfig={{ scale: 140 }}>
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={({ zoom: z, coordinates }) => {
                  setZoom(z);
                  setCenter(coordinates as [number, number]);
                }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: "#E0E5EC", stroke: "#CBD2DC", strokeWidth: 0.4, outline: "none" },
                          hover: { fill: "#D0D7E2", stroke: "#B8C1CE", strokeWidth: 0.4, outline: "none" },
                          pressed: { fill: "#C8CFD9", outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {officeLocations.map((office) => {
                  const isSelected = selected?.id === office.id;
                  const dotColor = STATUS_COLORS[office.status].dot;
                  return (
                    <Marker
                      key={office.id}
                      coordinates={[office.lng, office.lat]}
                      onClick={() => handleSelectOffice(office)}
                      onMouseEnter={(e) => handleMarkerMouseEnter(office, e as unknown as React.MouseEvent)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Outer glow ring */}
                      <circle
                        r={isSelected ? 14 / zoom : 10 / zoom}
                        fill={dotColor}
                        fillOpacity={0.08}
                        stroke="none"
                      >
                        <animate attributeName="r" values={`${(isSelected ? 12 : 8) / zoom};${(isSelected ? 16 : 12) / zoom};${(isSelected ? 12 : 8) / zoom}`} dur="3s" repeatCount="indefinite" />
                        <animate attributeName="fill-opacity" values="0.08;0.02;0.08" dur="3s" repeatCount="indefinite" />
                      </circle>
                      {/* Mid glow */}
                      <circle
                        r={isSelected ? 8 / zoom : 6 / zoom}
                        fill={dotColor}
                        fillOpacity={0.15}
                        stroke="none"
                      />
                      {/* Selection ring */}
                      {isSelected && (
                        <circle r={10 / zoom} fill="none" stroke={dotColor} strokeWidth={1 / zoom} opacity={0.5} />
                      )}
                      {/* Core dot */}
                      <circle
                        r={isSelected ? 4.5 / zoom : 3.5 / zoom}
                        fill={dotColor}
                        stroke="white"
                        strokeWidth={0.7 / zoom}
                      />
                      {/* Bright center */}
                      <circle
                        r={1.5 / zoom}
                        fill="white"
                        fillOpacity={0.5}
                      />
                    </Marker>
                  );
                })}
              </ZoomableGroup>
            </ComposableMap>

            {/* Hover tooltip */}
            {hovered && !selected && (
              <div
                className="absolute z-20 pointer-events-none bg-white border border-border rounded-lg shadow-xl px-3 py-2 text-xs min-w-[170px] -translate-x-1/2 -translate-y-full"
                style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
              >
                <p className="font-semibold text-foreground">{hovered.name}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">{hovered.city}, {hovered.country}</p>
                <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-border">
                  <span className="text-muted-foreground text-[10px]">{hovered.occupied}/{hovered.totalDesks} desks</span>
                  <span className="ml-auto font-medium text-[10px]" style={{ color: STATUS_COLORS[hovered.status].dot }}>
                    {STATUS_COLORS[hovered.status].label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className={cn(
          "shrink-0 border-l border-border bg-card transition-all duration-300 overflow-hidden",
          panelOpen ? "w-72" : "w-0"
        )}>
          <div className="w-72 h-full flex flex-col">
            {selected ? (
              <div className="p-4 flex-1 flex flex-col overflow-y-auto">
                <OfficeDetailPanel
                  office={selected}
                  onClose={handleBack}
                  onViewDashboard={() => router.push(`/office/${selected.id}`)}
                />
              </div>
            ) : (
              <>
                <div className="pb-2 pt-4 px-4 shrink-0">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    All Offices
                    <span className="ml-auto text-[10px] font-normal text-muted-foreground">{officeLocations.length} locations</span>
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
                  {officeLocations.map((office) => (
                    <OfficeListItem
                      key={office.id}
                      office={office}
                      selected={false}
                      onSelect={() => handleSelectOffice(office)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
