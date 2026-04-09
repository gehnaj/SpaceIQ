"use client";

import { useState, useRef, useMemo } from "react";
import {
  Upload, FileSpreadsheet, MapPin, CheckCircle2,
  AlertCircle, Loader2, X, Building2, Search, Clock,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { officeLocations } from "@/lib/mock-data";
import Topbar from "@/components/topbar";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

interface UploadStatus {
  state: UploadState;
  message: string;
}

function FileDropZone({
  file, onFileSelect, onClear, label, icon: Icon,
}: {
  file: File | null; onFileSelect: (f: File) => void; onClear: () => void;
  label: string; icon: React.ElementType;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect(f);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={cn(
        "border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer",
        file
          ? "border-green-500/40 bg-green-50"
          : "border-border hover:border-[#DF6014]/40 hover:bg-[#DF6014]/5"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
        }}
      />
      {file ? (
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-green-600 shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="ml-2 text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-2">
          <Icon className="w-7 h-7 text-muted-foreground" />
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">
            Drag & drop or click to browse &middot; .xlsx, .xls
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBanner({ status }: { status: UploadStatus }) {
  if (status.state === "idle") return null;

  const config: Record<UploadState, { icon: React.ElementType; color: string; bg: string }> = {
    idle: { icon: Upload, color: "", bg: "" },
    uploading: { icon: Loader2, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
    processing: { icon: Loader2, color: "text-[oklch(0.7_0.18_85)]", bg: "bg-[oklch(0.7_0.18_85)]/10 border-[oklch(0.7_0.18_85)]/20" },
    success: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200" },
    error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  };

  const cfg = config[status.state];
  const Icon = cfg.icon;

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", cfg.bg)}>
      <Icon className={cn("w-5 h-5 shrink-0", cfg.color, (status.state === "uploading" || status.state === "processing") && "animate-spin")} />
      <p className="text-sm text-foreground">{status.message}</p>
    </div>
  );
}

export default function UploadPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState("");

  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [logonFile, setLogonFile] = useState<File | null>(null);
  const [captureDate, setCaptureDate] = useState("");
  const [captureTime, setCaptureTime] = useState("");
  const [status, setStatus] = useState<UploadStatus>({ state: "idle", message: "" });

  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return officeLocations;
    const q = locationSearch.toLowerCase();
    return officeLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q)
    );
  }, [locationSearch]);

  const selectedLocation = officeLocations.find((o) => o.id === selectedLocationId);

  const resetForm = () => {
    setInventoryFile(null);
    setLogonFile(null);
    setCaptureDate("");
    setCaptureTime("");
    setStatus({ state: "idle", message: "" });
  };

  const handleSelectLocation = (id: string) => {
    if (id !== selectedLocationId) {
      resetForm();
    }
    setSelectedLocationId(id);
  };

  const handleUpload = async () => {
    if (!selectedLocationId || !inventoryFile || !logonFile || !captureDate || !captureTime) return;

    try {
      // Step 1: Upload inventory
      setStatus({ state: "uploading", message: "Uploading inventory file..." });
      const invForm = new FormData();
      invForm.append("file", inventoryFile);
      invForm.append("type", "inventory");
      invForm.append("locationId", selectedLocationId);
      const invRes = await fetch("/api/upload", { method: "POST", body: invForm });
      if (!invRes.ok) throw new Error("Inventory upload failed");

      // Step 2: Upload logon
      setStatus({ state: "uploading", message: "Uploading logon file..." });
      const logForm = new FormData();
      logForm.append("file", logonFile);
      logForm.append("type", "logon");
      logForm.append("locationId", selectedLocationId);
      logForm.append("date", captureDate);
      logForm.append("time", captureTime);
      const logRes = await fetch("/api/upload", { method: "POST", body: logForm });
      if (!logRes.ok) throw new Error("Logon upload failed");

      // Step 3: Process
      setStatus({ state: "processing", message: "Processing data — merging inventory with logon data..." });
      const processRes = await fetch(`/api/process/${selectedLocationId}`, { method: "POST" });
      const processData = await processRes.json();

      if (processRes.ok && processData.success) {
        setStatus({
          state: "success",
          message: `Done! ${processData.records} seats processed for ${selectedLocation?.name || selectedLocationId}. View the dashboard to see results.`,
        });
        setInventoryFile(null);
        setLogonFile(null);
      } else {
        throw new Error(processData.message || "Processing failed");
      }
    } catch (err) {
      setStatus({
        state: "error",
        message: `Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
      });
    }
  };

  const canSubmit =
    selectedLocationId &&
    inventoryFile &&
    logonFile &&
    captureDate &&
    captureTime &&
    status.state !== "uploading" &&
    status.state !== "processing";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Upload Data" subtitle="Upload inventory and logon files for processing" />

      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* ── Left: Upload form ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedLocation ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Select a Location</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Choose an office location from the panel on the right to upload inventory and logon data.
              </p>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-5">
              {/* Selected location header */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-[#DF6014]/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4.5 h-4.5 text-[#DF6014]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{selectedLocation.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{selectedLocation.address}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-muted-foreground">
                      {selectedLocation.floors} floor{selectedLocation.floors !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedLocation.city}, {selectedLocation.country}
                    </span>
                    <Badge variant="outline" className={cn(
                      "text-[9px] h-4 px-1.5",
                      selectedLocation.status === "open"
                        ? "border-green-500/30 text-green-600 bg-green-50"
                        : "border-yellow-500/30 text-yellow-600 bg-yellow-50"
                    )}>
                      {selectedLocation.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* File uploads */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Upload Files</CardTitle>
                  <p className="text-[10px] text-muted-foreground">
                    Both files are required to generate the seat utilization report
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Inventory file */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> Physical Inventory
                    </label>
                    <FileDropZone
                      file={inventoryFile}
                      onFileSelect={setInventoryFile}
                      onClear={() => setInventoryFile(null)}
                      label="Drop inventory spreadsheet here"
                      icon={Building2}
                    />
                  </div>

                  {/* Logon file */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3 h-3" /> Logon Data
                    </label>
                    <FileDropZone
                      file={logonFile}
                      onFileSelect={setLogonFile}
                      onClear={() => setLogonFile(null)}
                      label="Drop logon data spreadsheet here"
                      icon={FileSpreadsheet}
                    />
                  </div>

                  {/* Capture date & time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3" /> Capture Date
                      </label>
                      <Input
                        type="date"
                        className="h-9 text-xs bg-secondary/50 border-border"
                        value={captureDate}
                        onChange={(e) => setCaptureDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Capture Time
                      </label>
                      <Input
                        type="time"
                        className="h-9 text-xs bg-secondary/50 border-border"
                        value={captureTime}
                        onChange={(e) => setCaptureTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground -mt-2">
                    Enter the date and time when the logon data was downloaded. This is used to calculate the &quot;Since&quot; duration for each desk.
                  </p>

                  {/* Status */}
                  <StatusBanner status={status} />

                  {/* Submit */}
                  <Button
                    className="w-full h-10 font-medium gap-2"
                    disabled={!canSubmit}
                    onClick={handleUpload}
                  >
                    {status.state === "uploading" || status.state === "processing" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Upload & Process</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Info */}
              <div className="text-xs text-muted-foreground bg-secondary/30 rounded-lg px-4 py-3 space-y-1">
                <p className="font-medium text-foreground">How it works:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Select a location from the panel</li>
                  <li>Upload the <strong>Physical Inventory</strong> file (desk numbers, computer names, serial numbers)</li>
                  <li>Upload the <strong>Logon Data</strong> file (user sessions, logon/logoff times)</li>
                  <li>Enter the <strong>date and time</strong> when the logon data was captured</li>
                  <li>Click <strong>Upload & Process</strong> — the system merges both files and computes seat utilization</li>
                  <li>View results on the <strong>office dashboard</strong> and <strong>organization dashboard</strong></li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Location list (same style as Locations page) ──── */}
        <div className="w-72 border-l border-border bg-card/50 flex flex-col shrink-0">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DF6014]" />
                <span className="text-xs font-semibold text-foreground">All Offices</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{officeLocations.length} locations</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="h-7 text-xs bg-secondary border-border pl-8"
              />
            </div>
          </div>

          {/* Location items */}
          <div className="flex-1 overflow-y-auto">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc.id)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 border-b border-border/40 transition-colors",
                    isSelected
                      ? "bg-[#DF6014]/8"
                      : "hover:bg-secondary/60"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={cn(
                      "mt-1 w-2 h-2 rounded-full shrink-0",
                      loc.status === "open" ? "bg-green-500" : loc.status === "partial" ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-xs font-medium truncate",
                          isSelected ? "text-foreground" : "text-foreground/80"
                        )}>
                          {loc.name}
                        </p>
                        {loc.totalDesks > 0 && (
                          <span className="text-[10px] font-semibold text-[#DF6014] shrink-0">
                            {Math.round((loc.occupied / loc.totalDesks) * 100)}%
                          </span>
                        )}
                        {loc.totalDesks === 0 && (
                          <span className="text-[10px] text-muted-foreground/60 shrink-0">No data</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {loc.city}, {loc.state} &middot; {loc.country}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
