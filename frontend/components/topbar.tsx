"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const [time, setTime] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <header className="flex items-center gap-4 px-6 py-3 border-b border-border bg-card/50 backdrop-blur shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>

      {/* Building selector */}
      <Select defaultValue="b1">
        <SelectTrigger className="w-36 h-7 text-xs bg-secondary border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {buildings.map(b => (
            <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date & live status */}
      <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
        <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
        <span className="text-border">|</span>
        <span className="font-mono">{time}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.55_0.18_145)] animate-pulse" />
        <span className="text-[10px] font-medium text-[oklch(0.55_0.18_145)] hidden sm:block">Live Sync Active</span>
      </div>

      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRefresh}>
        <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 relative">
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
      </Button>
    </header>
  );
}
