"use client";

import { useState, useRef } from "react";
import {
  Upload, FileSpreadsheet, MapPin, CalendarDays, CheckCircle2,
  AlertCircle, Loader2, X, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { officeLocations } from "@/lib/mock-data";
import Topbar from "@/components/topbar";
import { cn } from "@/lib/utils";

type UploadTab = "inventory" | "logon";
type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

interface UploadStatus {
  state: UploadState;
  message: string;
}

function FileDropZone({
  file, onFileSelect, onClear, accept, label,
}: {
  file: File | null; onFileSelect: (f: File) => void; onClear: () => void;
  accept: string; label: string;
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
        "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
        file
          ? "border-[oklch(0.55_0.18_145)]/40 bg-[oklch(0.55_0.18_145)]/5"
          : "border-border hover:border-primary/40 hover:bg-primary/5"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
        }}
      />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-[oklch(0.55_0.18_145)]" />
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          <p className="text-xs text-muted-foreground">
            Drag & drop an Excel file here, or click to browse
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-2">.xlsx, .xls files accepted</p>
        </>
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
    success: { icon: CheckCircle2, color: "text-[oklch(0.55_0.18_145)]", bg: "bg-[oklch(0.55_0.18_145)]/10 border-[oklch(0.55_0.18_145)]/20" },
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
  const [tab, setTab] = useState<UploadTab>("inventory");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ state: "idle", message: "" });

  const handleUpload = async () => {
    if (!file || !location) return;
    if (tab === "logon" && !date) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", tab);
    formData.append("locationId", location);
    if (tab === "logon" && date) formData.append("date", date);

    try {
      // Step 1: Upload
      setStatus({ state: "uploading", message: "Uploading file..." });
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");

      // Step 2: Process
      setStatus({ state: "processing", message: "Processing data — running seat utilization merge..." });
      const processRes = await fetch(`/api/process/${location}`, { method: "POST" });
      const processData = await processRes.json();

      if (processRes.ok && processData.success) {
        setStatus({ state: "success", message: `Done! ${processData.records} seats processed for ${officeLocations.find((o) => o.id === location)?.name || location}.` });
        setFile(null);
      } else {
        setStatus({ state: "success", message: `File uploaded. ${processData.message || "Processing will run when both files are available."}` });
        setFile(null);
      }
    } catch (err) {
      setStatus({ state: "error", message: `Error: ${err instanceof Error ? err.message : "Something went wrong"}` });
    }
  };

  const canSubmit = file && location && (tab === "inventory" || date);
  const selectedOffice = officeLocations.find((o) => o.id === location);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Upload Data" subtitle="Upload inventory and logon files for processing" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Tab selector */}
          <div className="flex gap-2">
            {[
              { key: "inventory" as const, label: "Physical Inventory", icon: Building2, desc: "Desk & computer inventory" },
              { key: "logon" as const, label: "Logon Data", icon: FileSpreadsheet, desc: "User logon/logoff activity" },
            ].map(({ key, label, icon: Icon, desc }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setFile(null); setStatus({ state: "idle", message: "" }); }}
                className={cn(
                  "flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left",
                  tab === key
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border hover:bg-secondary/60"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", tab === key ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className={cn("text-sm font-medium", tab === key ? "text-foreground" : "text-muted-foreground")}>{label}</p>
                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Form card */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {tab === "inventory" ? (
                  <><Building2 className="w-4 h-4 text-primary" /> Upload Physical Inventory</>
                ) : (
                  <><FileSpreadsheet className="w-4 h-4 text-primary" /> Upload Logon Data</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Location selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Select Location
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-9 text-xs bg-secondary/50 border-border">
                    <SelectValue placeholder="Choose an office location..." />
                  </SelectTrigger>
                  <SelectContent>
                    {officeLocations.map((o) => (
                      <SelectItem key={o.id} value={o.id} className="text-xs">
                        {o.name} — {o.city}, {o.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOffice && (
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {selectedOffice.address}
                  </p>
                )}
              </div>

              {/* Date selector (logon only) */}
              {tab === "logon" && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3" /> Data Capture Date
                  </label>
                  <Input
                    type="date"
                    className="h-9 text-xs bg-secondary/50 border-border w-48"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    The date the logon data was captured (used for &quot;Since&quot; duration calculation)
                  </p>
                </div>
              )}

              {/* File drop zone */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  {tab === "inventory" ? "Inventory Excel File" : "Logon View Excel File"}
                </label>
                <FileDropZone
                  file={file}
                  onFileSelect={setFile}
                  onClear={() => setFile(null)}
                  accept=".xlsx,.xls"
                  label={tab === "inventory" ? "Drop inventory spreadsheet here" : "Drop logon data spreadsheet here"}
                />
              </div>

              {/* Status */}
              <StatusBanner status={status} />

              {/* Submit */}
              <Button
                className="w-full h-10 font-medium gap-2"
                disabled={!canSubmit || status.state === "uploading" || status.state === "processing"}
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
              <li>Upload the <strong>Physical Inventory</strong> file for a location (desk numbers, computer names, etc.)</li>
              <li>Upload the <strong>Logon Data</strong> file for the same location (user sessions, logon/logoff times)</li>
              <li>The system merges both files and computes seat utilization automatically</li>
              <li>View results on the office dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
