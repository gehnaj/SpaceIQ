"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AlertTriangle, AlertCircle, Info, CheckCircle2,
  Search, Bell, X, ChevronRight, MapPin, Clock,
  Zap, WifiOff, CircleDot, CheckCheck, Eye,
  Download, Loader2, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Topbar from "@/components/topbar";
import { type Alert, type AlertSeverity, type AlertType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

const severityConfig: Record<AlertSeverity, {
  label: string; color: string; bg: string; border: string; Icon: React.FC<{ className?: string }>;
}> = {
  critical: {
    label: "Critical", color: "oklch(0.6 0.22 27)", bg: "oklch(0.55 0.22 27 / 0.12)",
    border: "oklch(0.55 0.22 27 / 0.5)",
    Icon: ({ className }) => <AlertTriangle className={className} />,
  },
  warning: {
    label: "Warning", color: "oklch(0.7 0.18 85)", bg: "oklch(0.7 0.18 85 / 0.12)",
    border: "oklch(0.7 0.18 85 / 0.5)",
    Icon: ({ className }) => <AlertCircle className={className} />,
  },
  info: {
    label: "Info", color: "oklch(0.65 0.18 200)", bg: "oklch(0.65 0.18 200 / 0.12)",
    border: "oklch(0.65 0.18 200 / 0.5)",
    Icon: ({ className }) => <Info className={className} />,
  },
};

const typeConfig: Record<AlertType, { label: string }> = {
  occupancy_threshold: { label: "Occupancy Threshold" },
  desks_offline: { label: "Desks Offline" },
  zone_inactive: { label: "Zone Inactive" },
  idle_desks: { label: "Idle Desks" },
};

const TYPE_ICON_MAP: Record<AlertType, React.FC<{ className?: string }>> = {
  occupancy_threshold: ({ className }) => <Zap className={className} />,
  desks_offline: ({ className }) => <WifiOff className={className} />,
  zone_inactive: ({ className }) => <CircleDot className={className} />,
  idle_desks: ({ className }) => <Clock className={className} />,
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ${m}m ago`;
  return `${m}m ago`;
}

// ─── Severity Badge ───────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const cfg = severityConfig[severity];
  const Icon = cfg.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

// ─── Alert Detail Sheet ───────────────────────────────────────────────────────

function AlertDetailSheet({
  alert,
  onClose,
  onResolve,
}: {
  alert: Alert | null;
  onClose: () => void;
  onResolve: (id: string) => void;
}) {
  if (!alert) return null;
  const sev = severityConfig[alert.severity];
  const TypeIcon = TYPE_ICON_MAP[alert.type];

  return (
    <Sheet open={!!alert} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-80 bg-card border-border text-foreground overflow-y-auto flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TypeIcon className="w-4 h-4" />
            Alert Detail
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Severity + Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={alert.severity} />
            {alert.resolved ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-300">
                <CheckCircle2 className="w-2.5 h-2.5" /> Resolved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/30">
                <Bell className="w-2.5 h-2.5" /> Active
              </span>
            )}
          </div>

          {/* Message */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Message</p>
            <p className="text-sm font-medium text-foreground leading-snug">{alert.message}</p>
          </div>

          {/* Detail */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Detail</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{alert.detail}</p>
          </div>

          {/* Recommended Action */}
          <div
            className="rounded-lg p-3 border"
            style={{ backgroundColor: sev.bg, borderColor: sev.border }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: sev.color }}>
              Recommended Action
            </p>
            <p className="text-[11px] text-foreground/80 leading-relaxed">{alert.recommendedAction}</p>
          </div>

          {/* Metadata */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Context</p>
            {[
              { Icon: Zap, label: "Type", value: typeConfig[alert.type]?.label || alert.type },
              { Icon: MapPin, label: "Location", value: alert.locationName },
              alert.floor ? { Icon: MapPin, label: "Floor", value: alert.floor } : null,
              { Icon: Clock, label: "Created", value: formatTime(alert.createdAt) },
              { Icon: Clock, label: "Data Date", value: alert.captureDate },
              alert.metric != null ? { Icon: Zap, label: "Metric", value: `${alert.metric}%` } : null,
            ].filter(Boolean).map((item) => {
              const { Icon, label, value } = item as { Icon: React.FC<{ className?: string }>; label: string; value: string };
              return (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground flex-1">{label}</span>
                  <span className="text-xs font-medium text-foreground truncate max-w-36">{value}</span>
                </div>
              );
            })}
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-muted-foreground">Alert ID</span>
            <span className="text-[10px] font-mono text-muted-foreground/70 ml-auto truncate max-w-48">{alert.id}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border space-y-2">
          {!alert.resolved && (
            <Button
              size="sm"
              className="w-full h-8 text-xs bg-green-600 text-white hover:bg-green-700"
              onClick={() => { onResolve(alert.id); onClose(); }}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
              Mark as Resolved
            </Button>
          )}
          <Button size="sm" variant="outline" className="w-full h-8 text-xs border-border">
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View Office Dashboard
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────

function AlertCard({
  alert,
  onClick,
  onResolve,
}: {
  alert: Alert;
  onClick: () => void;
  onResolve: (id: string) => void;
}) {
  const sev = severityConfig[alert.severity];
  const TypeIcon = TYPE_ICON_MAP[alert.type];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex gap-3 p-4 rounded-lg border bg-card cursor-pointer transition-all hover:bg-secondary/30",
        alert.resolved && "opacity-60"
      )}
      style={{ borderColor: alert.resolved ? undefined : sev.border }}
    >
      {/* Severity left accent */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ backgroundColor: alert.resolved ? "var(--border)" : sev.color }}
      />

      {/* Icon */}
      <div
        className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 mt-0.5"
        style={{ backgroundColor: sev.bg }}
      >
        <TypeIcon className={cn("w-4 h-4", alert.resolved ? "text-muted-foreground" : "")} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-medium leading-snug", alert.resolved ? "text-muted-foreground" : "text-foreground")}>
            {alert.message}
          </p>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors" />
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {alert.detail}
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <SeverityBadge severity={alert.severity} />
          {alert.resolved && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium text-green-700 bg-green-100">
              <CheckCircle2 className="w-2.5 h-2.5" /> Resolved
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="w-2.5 h-2.5" /> {alert.locationName}
          </span>
          {alert.floor && (
            <span className="text-[10px] text-muted-foreground">
              &middot; {alert.floor}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(alert.createdAt)}</span>
        </div>
      </div>

      {/* Quick resolve */}
      {!alert.resolved && (
        <button
          onClick={(e) => { e.stopPropagation(); onResolve(alert.id); }}
          className="hidden group-hover:flex items-center justify-center absolute top-3 right-3 w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
          title="Mark resolved"
        >
          <CheckCheck className="w-3 h-3 text-green-700" />
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [alertList, setAlertList] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showResolved, setShowResolved] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Fetch alerts from API
  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        setAlertList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleResolve = async (id: string) => {
    // Optimistic update
    setAlertList((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
    if (selectedAlert?.id === id) {
      setSelectedAlert((prev) => (prev ? { ...prev, resolved: true } : null));
    }
    // Persist
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, resolved: true }),
    });
  };

  const handleResolveAll = async () => {
    const infoAlerts = alertList.filter((a) => a.severity === "info" && !a.resolved);
    setAlertList((prev) => prev.map((a) => (a.severity === "info" ? { ...a, resolved: true } : a)));
    // Persist each
    for (const a of infoAlerts) {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, resolved: true }),
      });
    }
  };

  // Unique locations for filter
  const uniqueLocations = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of alertList) {
      if (a.locationId && a.locationName) map.set(a.locationId, a.locationName);
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [alertList]);

  // Stats
  const stats = useMemo(
    () => ({
      total: alertList.length,
      critical: alertList.filter((a) => a.severity === "critical" && !a.resolved).length,
      warning: alertList.filter((a) => a.severity === "warning" && !a.resolved).length,
      info: alertList.filter((a) => a.severity === "info" && !a.resolved).length,
      resolved: alertList.filter((a) => a.resolved).length,
    }),
    [alertList]
  );

  const filtered = useMemo(() => {
    let list = [...alertList];
    if (!showResolved) list = list.filter((a) => !a.resolved);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.message.toLowerCase().includes(s) ||
          a.detail.toLowerCase().includes(s) ||
          a.locationName.toLowerCase().includes(s) ||
          (a.floor || "").toLowerCase().includes(s)
      );
    }
    if (severityFilter !== "all") list = list.filter((a) => a.severity === severityFilter);
    if (typeFilter !== "all") list = list.filter((a) => a.type === typeFilter);
    if (locationFilter !== "all") list = list.filter((a) => a.locationId === locationFilter);

    const order: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
    list.sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [alertList, search, severityFilter, typeFilter, locationFilter, showResolved]);

  const hasActiveFilters = search || severityFilter !== "all" || typeFilter !== "all" || locationFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setSeverityFilter("all");
    setTypeFilter("all");
    setLocationFilter("all");
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Topbar title="Alerts" subtitle="Monitor and manage system notifications" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-3 text-sm text-muted-foreground">Loading alerts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Alerts" subtitle="Monitor and manage system notifications" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              label: "Total Alerts", value: stats.total,
              color: "oklch(0.65 0.18 200)", bg: "oklch(0.65 0.18 200 / 0.1)",
              icon: <Bell className="w-4 h-4" />,
            },
            {
              label: "Critical", value: stats.critical,
              color: "oklch(0.6 0.22 27)", bg: "oklch(0.55 0.22 27 / 0.12)",
              icon: <AlertTriangle className="w-4 h-4" />,
            },
            {
              label: "Warning", value: stats.warning,
              color: "oklch(0.7 0.18 85)", bg: "oklch(0.7 0.18 85 / 0.12)",
              icon: <AlertCircle className="w-4 h-4" />,
            },
            {
              label: "Info", value: stats.info,
              color: "oklch(0.65 0.18 200)", bg: "oklch(0.65 0.18 200 / 0.1)",
              icon: <Info className="w-4 h-4" />,
            },
            {
              label: "Resolved", value: stats.resolved,
              color: "#16a34a", bg: "rgba(22, 163, 74, 0.1)",
              icon: <CheckCircle2 className="w-4 h-4" />,
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-center w-8 h-8 rounded-md shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground leading-none tabular-nums">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              className="pl-8 h-8 text-xs w-52 bg-secondary/50 border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 w-32 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Severity</SelectItem>
              <SelectItem value="critical" className="text-xs">Critical</SelectItem>
              <SelectItem value="warning" className="text-xs">Warning</SelectItem>
              <SelectItem value="info" className="text-xs">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-40 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Types</SelectItem>
              {(Object.entries(typeConfig) as [AlertType, { label: string }][]).map(([k, v]) => (
                <SelectItem key={k} value={k} className="text-xs">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="h-8 w-44 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Locations</SelectItem>
              {uniqueLocations.map(([id, name]) => (
                <SelectItem key={id} value={id} className="text-xs">{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              id="show-resolved"
              checked={showResolved}
              onCheckedChange={setShowResolved}
              className="h-4 w-7"
            />
            <Label htmlFor="show-resolved" className="text-xs text-muted-foreground cursor-pointer">
              Show resolved
            </Label>
          </div>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
              onClick={clearFilters}
            >
              <X className="w-3 h-3" /> Clear filters
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{filtered.length} alert{filtered.length !== 1 ? "s" : ""}</span>
            {stats.info > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-border gap-1.5"
                onClick={handleResolveAll}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Resolve info
              </Button>
            )}
          </div>
        </div>

        {/* Alert List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {alertList.length === 0 ? "No alerts yet" : "No alerts found"}
            </p>
            <p className="text-xs text-muted-foreground">
              {alertList.length === 0
                ? "Alerts are generated automatically when you upload and process data for a location."
                : hasActiveFilters
                ? "Try adjusting your filters."
                : "No active alerts right now."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => setSelectedAlert(alert)}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDetailSheet
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolve}
      />
    </div>
  );
}
