"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Globe,
  Upload,
  BarChart3,
  Bell,
  Settings,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Circle,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/", icon: Globe, label: "Locations" },
  { href: "/upload", icon: Upload, label: "Upload Data" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/alerts", icon: Bell, label: "Alerts", hasBadge: true },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAlertCount(data.filter((a: any) => !a.resolved).length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Logo + Product name */}
      <div className={cn(
        "flex flex-col gap-2 px-3 py-4 border-b border-sidebar-border",
        collapsed && "items-center"
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-md bg-[#DF6014] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-bold tracking-wide leading-none">
              <span className="text-[#DF6014]">Space</span><span className="text-sidebar-accent-foreground">IQ</span>
            </p>
            <Image
              src="/FSL-Logo-light.png"
              alt="Firstsource"
              width={100}
              height={26}
              className="h-8 w-auto object-contain"
              priority
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-hidden">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href);
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
              <item.icon className={cn("w-4 h-4 shrink-0", active && "text-[#DF6014]")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.hasBadge && alertCount > 0 && (
                <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-[#DF6014] text-white border-0">
                  {alertCount}
                </Badge>
              )}
              {collapsed && item.hasBadge && alertCount > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#DF6014]" />
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
            <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-sidebar-foreground/60 uppercase tracking-wider">Live Sync</p>
              <p className="text-xs font-semibold text-[#6CB1DB]">Active</p>
            </div>
            <Wifi className="w-3 h-3 text-sidebar-foreground/40 ml-auto shrink-0" />
          </div>
        ) : (
          <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
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
