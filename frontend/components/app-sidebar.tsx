"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Users,
  BarChart3,
  Bell,
  Settings,
  Building2,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Circle,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/offices", icon: Globe, label: "Global Offices" },
  { href: "/floor-maps", icon: Map, label: "Floor Maps" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/alerts", icon: Bell, label: "Alerts", badge: 4 },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border", collapsed && "px-3 justify-center")}>
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-sidebar-foreground/50 uppercase tracking-widest leading-none">Office</p>
            <p className="text-xs font-semibold text-sidebar-accent-foreground leading-snug truncate">Productivity Monitor</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors relative group",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-destructive text-destructive-foreground">
                  {item.badge}
                </Badge>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live status */}
      <div className={cn(
        "px-3 py-3 border-t border-sidebar-border",
        collapsed ? "flex justify-center" : ""
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-sidebar-accent/50">
            <Circle className="w-2 h-2 fill-[oklch(0.55_0.18_145)] text-[oklch(0.55_0.18_145)] animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-sidebar-foreground/60 uppercase tracking-wider">Live Sync</p>
              <p className="text-xs font-semibold text-[oklch(0.65_0.18_200)]">Active</p>
            </div>
            <Wifi className="w-3 h-3 text-sidebar-foreground/40 ml-auto shrink-0" />
          </div>
        ) : (
          <Circle className="w-2 h-2 fill-[oklch(0.55_0.18_145)] text-[oklch(0.55_0.18_145)] animate-pulse" />
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-center py-2 border-t border-sidebar-border text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
