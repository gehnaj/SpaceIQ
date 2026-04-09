"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Filter, ChevronDown, X, User,
  Monitor, Clock, CalendarCheck, MapPin, Mail,
  BarChart3, TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Topbar from "@/components/topbar";
import { employees, floors, allDesks, type Employee, type EmployeeStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<EmployeeStatus, { label: string; color: string; bg: string }> = {
  "in-office": { label: "In Office", color: "oklch(0.55 0.18 145)", bg: "oklch(0.55 0.18 145 / 0.15)" },
  away: { label: "Away", color: "oklch(0.7 0.18 85)", bg: "oklch(0.7 0.18 85 / 0.15)" },
  remote: { label: "Remote", color: "oklch(0.65 0.18 200)", bg: "oklch(0.65 0.18 200 / 0.15)" },
  offline: { label: "Offline", color: "oklch(0.55 0.008 240)", bg: "oklch(0.22 0.007 240)" },
};

function StatusBadge({ status }: { status: EmployeeStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

// ─── Employee Detail Sheet ────────────────────────────────────────────────────

function EmployeeDetailSheet({ emp, onClose }: { emp: Employee | null; onClose: () => void }) {
  if (!emp) return null;
  const desk = allDesks.find(d => d.id === emp.assignedDeskId);
  const floor = desk ? floors.find(f => f.id === desk.floorId) : null;

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceChart = weekDays.map((day, i) => ({
    day,
    value: emp.weeklyAttendance[i] ?? 0,
  }));

  const activityLog = [
    { time: "09:02 AM", event: "Logged in — device connected" },
    { time: "10:30 AM", event: "Away from desk (15 min)" },
    { time: "12:00 PM", event: "Out for lunch" },
    { time: "01:10 PM", event: "Returned to desk" },
    { time: "03:45 PM", event: "Meeting Room A (booked)" },
  ];

  return (
    <Sheet open={!!emp} onOpenChange={o => !o && onClose()}>
      <SheetContent side="right" className="w-80 bg-card border-border text-foreground overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base">Employee Profile</SheetTitle>
        </SheetHeader>

        {/* Profile Card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{emp.name}</p>
            <p className="text-xs text-muted-foreground">{emp.team} · {emp.department}</p>
            <div className="mt-1">
              <StatusBadge status={emp.status} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          {[
            { icon: Mail, label: "Email", value: emp.email },
            { icon: MapPin, label: "Desk", value: emp.assignedDeskId },
            { icon: Monitor, label: "Device", value: emp.status === "in-office" ? "Connected" : "Disconnected" },
            { icon: Clock, label: "Today", value: emp.todayDuration },
            { icon: Clock, label: "Last Active", value: emp.lastActive },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground flex-1">{label}</span>
              <span className="text-xs font-medium text-foreground truncate max-w-32">{value}</span>
            </div>
          ))}
          {floor && (
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground flex-1">Floor</span>
              <span className="text-xs font-medium text-foreground">{floor.floorName}</span>
            </div>
          )}
        </div>

        {/* Weekly attendance */}
        <div className="mb-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Weekly Attendance</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={attendanceChart} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "oklch(0.55 0.008 240)" }} tickLine={false} />
              <YAxis tick={false} tickLine={false} axisLine={false} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ backgroundColor: "oklch(0.17 0.006 240)", border: "1px solid oklch(0.25 0.007 240)", borderRadius: 4, fontSize: 10 }}
                formatter={() => ["Present", ""]}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {attendanceChart.map((e, i) => (
                  <Cell key={i} fill={e.value === 1 ? "oklch(0.55 0.18 145)" : "oklch(0.22 0.007 240)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-1">
            {emp.weeklyAttendance.filter(Boolean).length}/5 days this week
          </p>
        </div>

        {/* Activity log */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Today&apos;s Activity</p>
          <div className="space-y-2">
            {activityLog.map((log, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">{log.time}</span>
                <span className="text-[10px] text-foreground">{log.event}</span>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function EmployeesContent() {
  const searchParams = useSearchParams();
  const initialEmp = searchParams.get("emp");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(
    initialEmp ? (employees.find(e => e.id === initialEmp) ?? null) : null
  );
  const [sort, setSort] = useState<"name" | "dept" | "status">("name");

  const depts = useMemo(() => [...new Set(employees.map(e => e.department))], []);

  const filtered = useMemo(() => {
    let list = [...employees];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== "all") list = list.filter(e => e.status === statusFilter);
    if (deptFilter !== "all") list = list.filter(e => e.department === deptFilter);
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "dept") return a.department.localeCompare(b.department);
      return a.status.localeCompare(b.status);
    });
    return list;
  }, [search, statusFilter, deptFilter, sort]);

  const statusCounts = useMemo(() => ({
    "in-office": employees.filter(e => e.status === "in-office").length,
    away: employees.filter(e => e.status === "away").length,
    remote: employees.filter(e => e.status === "remote").length,
    offline: employees.filter(e => e.status === "offline").length,
  }), []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Employees" subtitle="Directory and occupancy details" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap">
          {(Object.entries(statusCounts) as [EmployeeStatus, number][]).map(([s, count]) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                statusFilter === s
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig[s].color }} />
              {statusConfig[s].label}
              <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8 h-8 text-xs w-52 bg-secondary/50 border-border"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-8 w-36 text-xs bg-secondary/50 border-border">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Departments</SelectItem>
              {depts.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={v => setSort(v as typeof sort)}>
            <SelectTrigger className="h-8 w-28 text-xs bg-secondary/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name" className="text-xs">Sort: Name</SelectItem>
              <SelectItem value="dept" className="text-xs">Sort: Dept</SelectItem>
              <SelectItem value="status" className="text-xs">Sort: Status</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} employees</span>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  {["Name", "ID", "Team / Dept", "Desk", "Status", "Last Active", "Today", "Wk Attendance"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmp(emp)}
                    className={cn(
                      "border-b border-border/50 cursor-pointer hover:bg-secondary/40 transition-colors",
                      i % 2 === 0 ? "bg-card" : "bg-card/50"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="font-medium text-foreground whitespace-nowrap">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{emp.id}</td>
                    <td className="px-4 py-2.5">
                      <div className="text-foreground">{emp.team}</div>
                      <div className="text-muted-foreground text-[10px]">{emp.department}</div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">{emp.assignedDeskId}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={emp.status} /></td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{emp.lastActive}</td>
                    <td className="px-4 py-2.5 text-foreground whitespace-nowrap">{emp.todayDuration}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-0.5">
                        {emp.weeklyAttendance.map((v, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: v ? "oklch(0.55 0.18 145)" : "oklch(0.22 0.007 240)" }}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">No employees match your filters.</div>
          )}
        </div>
      </div>
      <EmployeeDetailSheet emp={selectedEmp} onClose={() => setSelectedEmp(null)} />
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense>
      <EmployeesContent />
    </Suspense>
  );
}
