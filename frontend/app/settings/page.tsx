"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MapPin, AlertCircle, Plug, Save, RotateCcw,
  ChevronDown, Pencil, Trash2, Plus, Search, Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Topbar from "@/components/topbar";
import { officeLocations, type OfficeLocation } from "@/lib/mock-data";

interface SettingsState {
  // Occupancy thresholds
  occupancyThreshold: string;
  criticalThreshold: string;
  warningThreshold: string;
  // Offline desk thresholds
  offlineWarnPct: string;
  offlineCritPct: string;
  // Idle desk thresholds
  idleMinutes: string;
  idleCount: string;
  // Integration
  microsoftTeamsIntegration: boolean;
  teamsWebhookUrl: string;
}

interface LocationFormData {
  name: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  address: string;
  lat: string;
  lng: string;
  floors: string;
  timezone: string;
  status: "open" | "closed" | "partial";
}

const emptyForm: LocationFormData = {
  name: "",
  city: "",
  state: "",
  country: "",
  countryCode: "",
  address: "",
  lat: "",
  lng: "",
  floors: "1",
  timezone: "IST",
  status: "open",
};

const DEFAULT_SETTINGS: SettingsState = {
  occupancyThreshold: "85",
  criticalThreshold: "95",
  warningThreshold: "75",
  offlineWarnPct: "20",
  offlineCritPct: "30",
  idleMinutes: "1440",
  idleCount: "10",
  microsoftTeamsIntegration: false,
  teamsWebhookUrl: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });

  const [locations, setLocations] = useState<OfficeLocation[]>([...officeLocations]);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    locations: true,
    alertRules: false,
    integrations: false,
  });

  // Load persisted settings on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          occupancyThreshold: String(data.standard ?? 85),
          criticalThreshold: String(data.critical ?? 95),
          warningThreshold: String(data.warning ?? 75),
          offlineWarnPct: String(data.offline_warn_pct ?? 20),
          offlineCritPct: String(data.offline_crit_pct ?? 30),
          idleMinutes: String(data.idle_minutes ?? 1440),
          idleCount: String(data.idle_count ?? 10),
          microsoftTeamsIntegration: DEFAULT_SETTINGS.microsoftTeamsIntegration,
          teamsWebhookUrl: DEFAULT_SETTINGS.teamsWebhookUrl,
        });
      })
      .catch(() => {});
  }, []);

  // Location management state
  const [locationSearch, setLocationSearch] = useState("");
  const [editingLocation, setEditingLocation] = useState<OfficeLocation | null>(null);
  const [editForm, setEditForm] = useState<LocationFormData>(emptyForm);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<LocationFormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<OfficeLocation | null>(null);

  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return locations;
    const q = locationSearch.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q) ||
        loc.id.toLowerCase().includes(q)
    );
  }, [locations, locationSearch]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (key: keyof SettingsState, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Persist alert thresholds to processed/settings.json via API
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        standard: parseInt(settings.occupancyThreshold) || 85,
        critical: parseInt(settings.criticalThreshold) || 95,
        warning: parseInt(settings.warningThreshold) || 75,
        offline_warn_pct: parseInt(settings.offlineWarnPct) || 20,
        offline_crit_pct: parseInt(settings.offlineCritPct) || 30,
        idle_minutes: parseInt(settings.idleMinutes) || 1440,
        idle_count: parseInt(settings.idleCount) || 10,
      }),
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setLocations([...officeLocations]);
    setHasChanges(true);
  };

  // ── Edit location ──
  const openEditDialog = (loc: OfficeLocation) => {
    setEditingLocation(loc);
    setEditForm({
      name: loc.name,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      countryCode: loc.countryCode,
      address: loc.address,
      lat: String(loc.lat),
      lng: String(loc.lng),
      floors: String(loc.floors),
      timezone: loc.timezone,
      status: loc.status,
    });
  };

  const saveEditLocation = () => {
    if (!editingLocation) return;
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === editingLocation.id
          ? {
              ...loc,
              name: editForm.name,
              city: editForm.city,
              state: editForm.state,
              country: editForm.country,
              countryCode: editForm.countryCode,
              address: editForm.address,
              lat: parseFloat(editForm.lat) || loc.lat,
              lng: parseFloat(editForm.lng) || loc.lng,
              floors: parseInt(editForm.floors) || loc.floors,
              timezone: editForm.timezone,
              status: editForm.status,
            }
          : loc
      )
    );
    setEditingLocation(null);
    setHasChanges(true);
  };

  // ── Add location ──
  const saveNewLocation = () => {
    const id = `off-new-${Date.now()}`;
    const newLoc: OfficeLocation = {
      id,
      name: addForm.name,
      city: addForm.city,
      state: addForm.state,
      country: addForm.country,
      countryCode: addForm.countryCode,
      address: addForm.address,
      lat: parseFloat(addForm.lat) || 0,
      lng: parseFloat(addForm.lng) || 0,
      status: addForm.status,
      totalDesks: 0,
      occupied: 0,
      employees: 0,
      floors: parseInt(addForm.floors) || 1,
      timezone: addForm.timezone,
    };
    setLocations((prev) => [...prev, newLoc]);
    setAddDialogOpen(false);
    setAddForm(emptyForm);
    setHasChanges(true);
  };

  // ── Delete location ──
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setLocations((prev) => prev.filter((loc) => loc.id !== deleteTarget.id));
    setDeleteTarget(null);
    setHasChanges(true);
  };

  // ── Shared form renderer ──
  const renderLocationForm = (
    form: LocationFormData,
    setForm: (fn: (prev: LocationFormData) => LocationFormData) => void
  ) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Location Name *</Label>
          <Input
            placeholder="e.g., Mumbai – Athena Towers"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">City *</Label>
          <Input
            placeholder="e.g., Mumbai"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">State / Province</Label>
          <Input
            placeholder="e.g., Maharashtra"
            value={form.state}
            onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Country *</Label>
          <Input
            placeholder="e.g., India"
            value={form.country}
            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Country Code</Label>
          <Input
            placeholder="e.g., IN"
            value={form.countryCode}
            onChange={(e) => setForm((p) => ({ ...p, countryCode: e.target.value.toUpperCase() }))}
            className="h-8 text-xs bg-secondary border-border"
            maxLength={2}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Timezone</Label>
          <Select value={form.timezone} onValueChange={(v) => setForm((p) => ({ ...p, timezone: v }))}>
            <SelectTrigger className="h-8 text-xs bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IST" className="text-xs">IST (India)</SelectItem>
              <SelectItem value="PHT" className="text-xs">PHT (Philippines)</SelectItem>
              <SelectItem value="GMT" className="text-xs">GMT (UK)</SelectItem>
              <SelectItem value="EST" className="text-xs">EST (US East)</SelectItem>
              <SelectItem value="CST" className="text-xs">CST (US Central)</SelectItem>
              <SelectItem value="PST" className="text-xs">PST (US West)</SelectItem>
              <SelectItem value="AEST" className="text-xs">AEST (Australia)</SelectItem>
              <SelectItem value="GST" className="text-xs">GST (UAE)</SelectItem>
              <SelectItem value="CST-MX" className="text-xs">CST (Mexico)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Full Address *</Label>
        <Input
          placeholder="Full street address"
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          className="h-8 text-xs bg-secondary border-border"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Number of Floors</Label>
          <Input
            placeholder="1"
            type="number"
            min="1"
            value={form.floors}
            onChange={(e) => setForm((p) => ({ ...p, floors: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Latitude</Label>
          <Input
            placeholder="e.g., 19.1770"
            value={form.lat}
            onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Longitude</Label>
          <Input
            placeholder="e.g., 72.8385"
            value={form.lng}
            onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))}
            className="h-8 text-xs bg-secondary border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Status</Label>
        <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as LocationFormData["status"] }))}>
          <SelectTrigger className="h-8 text-xs bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open" className="text-xs">Open</SelectItem>
            <SelectItem value="closed" className="text-xs">Closed</SelectItem>
            <SelectItem value="partial" className="text-xs">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" subtitle="Configure system preferences and integrations" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Header with Save/Reset */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Configuration</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your SpaceIQ settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleSave} disabled={!hasChanges}>
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </div>
        </div>

        <Separator className="bg-border my-4" />

        {/* ─── Locations Data ─────────────────────────────────────────────── */}
        <Collapsible open={expandedSections.locations} onOpenChange={() => toggleSection("locations")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#DF6014]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Locations Data</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage office locations &middot; {locations.length} locations
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.locations ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
              {/* Search + Add */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="h-8 text-xs bg-secondary border-border pl-8"
                  />
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-[#DF6014] hover:bg-[#c75512] text-white"
                  onClick={() => {
                    setAddForm(emptyForm);
                    setAddDialogOpen(true);
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Location
                </Button>
              </div>

              {/* Locations table */}
              <div className="rounded-md border border-border overflow-hidden">
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-secondary/60 sticky top-0 z-10">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold text-foreground">Name</th>
                        <th className="text-left px-3 py-2 font-semibold text-foreground hidden md:table-cell">City</th>
                        <th className="text-left px-3 py-2 font-semibold text-foreground hidden lg:table-cell">Country</th>
                        <th className="text-center px-3 py-2 font-semibold text-foreground">Floors</th>
                        <th className="text-center px-3 py-2 font-semibold text-foreground">Desks</th>
                        <th className="text-center px-3 py-2 font-semibold text-foreground">Status</th>
                        <th className="text-right px-3 py-2 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredLocations.map((loc) => (
                        <tr key={loc.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-3 py-2.5">
                            <p className="font-medium text-foreground truncate max-w-[200px]">{loc.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[200px] md:hidden">{loc.city}, {loc.country}</p>
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">{loc.city}</td>
                          <td className="px-3 py-2.5 text-muted-foreground hidden lg:table-cell">
                            <span className="inline-flex items-center gap-1">
                              <span className="text-[10px] font-mono bg-secondary px-1 rounded">{loc.countryCode}</span>
                              {loc.country}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center tabular-nums">{loc.floors}</td>
                          <td className="px-3 py-2.5 text-center tabular-nums">{loc.totalDesks.toLocaleString()}</td>
                          <td className="px-3 py-2.5 text-center">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                loc.status === "open"
                                  ? "border-green-500/30 text-green-600 bg-green-50"
                                  : loc.status === "partial"
                                  ? "border-yellow-500/30 text-yellow-600 bg-yellow-50"
                                  : "border-red-500/30 text-red-600 bg-red-50"
                              }`}
                            >
                              {loc.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => openEditDialog(loc)}
                              >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:text-red-600"
                                onClick={() => setDeleteTarget(loc)}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLocations.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                            No locations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* ─── Alert Rules ─────────────────────────────────────────────────── */}
        <Collapsible open={expandedSections.alertRules} onOpenChange={() => toggleSection("alertRules")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-[oklch(0.7_0.18_85)]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Alert Rules</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure thresholds for automated alert generation</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.alertRules ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-5">

              {/* Occupancy Thresholds */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#DF6014]" /> Occupancy Thresholds
                </p>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Alerts are generated when a location or floor occupancy exceeds these percentages.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">Warning</Label>
                      <Badge variant="outline" className="text-[10px] border-blue-400/40 text-blue-600 bg-blue-50">{settings.warningThreshold}%</Badge>
                    </div>
                    <Input
                      placeholder="75"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.warningThreshold}
                      onChange={(e) => handleInputChange("warningThreshold", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">Info-level alert</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">Standard</Label>
                      <Badge variant="outline" className="text-[10px] border-yellow-400/40 text-yellow-600 bg-yellow-50">{settings.occupancyThreshold}%</Badge>
                    </div>
                    <Input
                      placeholder="85"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.occupancyThreshold}
                      onChange={(e) => handleInputChange("occupancyThreshold", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">Warning-level alert</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">Critical</Label>
                      <Badge variant="outline" className="text-[10px] border-red-400/40 text-red-600 bg-red-50">{settings.criticalThreshold}%</Badge>
                    </div>
                    <Input
                      placeholder="95"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.criticalThreshold}
                      onChange={(e) => handleInputChange("criticalThreshold", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">Critical-level alert</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Offline Desk Thresholds */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#DF6014]" /> Offline Desk Thresholds
                </p>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Alerts when the percentage of offline desks on a floor exceeds these values.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">Warning Level</Label>
                      <Badge variant="outline" className="text-[10px] border-yellow-400/40 text-yellow-600 bg-yellow-50">{settings.offlineWarnPct}%</Badge>
                    </div>
                    <Input
                      placeholder="20"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.offlineWarnPct}
                      onChange={(e) => handleInputChange("offlineWarnPct", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">% of floor desks offline to trigger warning</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">Critical Level</Label>
                      <Badge variant="outline" className="text-[10px] border-red-400/40 text-red-600 bg-red-50">{settings.offlineCritPct}%</Badge>
                    </div>
                    <Input
                      placeholder="30"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.offlineCritPct}
                      onChange={(e) => handleInputChange("offlineCritPct", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">% of floor desks offline to trigger critical</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Idle Desk Thresholds */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#DF6014]" /> Idle Desk Detection
                </p>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Alerts when desks have been offline for an extended period, suggesting hardware issues or abandonment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Idle Duration (minutes)</Label>
                    <Input
                      placeholder="1440"
                      type="number"
                      min="60"
                      value={settings.idleMinutes}
                      onChange={(e) => handleInputChange("idleMinutes", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Minutes a desk must be offline to count as idle (1440 = 24 hours)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Minimum Count per Floor</Label>
                    <Input
                      placeholder="10"
                      type="number"
                      min="1"
                      value={settings.idleCount}
                      onChange={(e) => handleInputChange("idleCount", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Minimum idle desks on a floor to trigger an alert
                    </p>
                  </div>
                </div>
              </div>

              {/* Info note */}
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/50">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  These thresholds are applied automatically each time data is processed for a location.
                  Alerts are generated per-floor and per-location based on these rules.
                  Changes take effect on the next data upload.
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* ─── Integrations ───────────────────────────────────────────────── */}
        <Collapsible open={expandedSections.integrations} onOpenChange={() => toggleSection("integrations")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Plug className="w-4 h-4 text-[oklch(0.6_0.18_275)]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Integrations</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Connect external tools and services</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.integrations ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[oklch(0.5_0.15_240_/_0.3)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[oklch(0.65_0.18_200)]">MT</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Microsoft Teams</p>
                    <p className="text-xs text-muted-foreground">Send occupancy alerts to Teams channels</p>
                  </div>
                </div>
                <Switch
                  checked={settings.microsoftTeamsIntegration}
                  onCheckedChange={(v) => handleInputChange("microsoftTeamsIntegration", v)}
                />
              </div>

              {settings.microsoftTeamsIntegration && (
                <div className="space-y-2 pl-11">
                  <Label className="text-xs font-semibold text-foreground">Webhook URL</Label>
                  <Input
                    placeholder="https://outlook.office.com/webhook/..."
                    value={settings.teamsWebhookUrl}
                    onChange={(e) => handleInputChange("teamsWebhookUrl", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste your Teams incoming webhook URL to receive alerts
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Separator className="bg-border my-4" />

        <Card className="bg-secondary/30 border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Settings are saved automatically after you click &quot;Save Changes&quot;. For support or advanced
              configuration options, contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Edit Location Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!editingLocation} onOpenChange={(open) => !open && setEditingLocation(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Location</DialogTitle>
            <DialogDescription className="text-xs">
              Update details for {editingLocation?.name}
            </DialogDescription>
          </DialogHeader>
          {renderLocationForm(editForm, setEditForm)}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setEditingLocation(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs bg-[#DF6014] hover:bg-[#c75512] text-white"
              onClick={saveEditLocation}
              disabled={!editForm.name.trim() || !editForm.city.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add Location Dialog ──────────────────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">Add New Location</DialogTitle>
            <DialogDescription className="text-xs">
              Enter the details for the new office location
            </DialogDescription>
          </DialogHeader>
          {renderLocationForm(addForm, setAddForm)}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs bg-[#DF6014] hover:bg-[#c75512] text-white"
              onClick={saveNewLocation}
              disabled={!addForm.name.trim() || !addForm.city.trim() || !addForm.country.trim()}
            >
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ──────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">Delete Location</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.name}</span>?
              This action cannot be undone. All associated data for this location will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-8">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-xs h-8 bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
