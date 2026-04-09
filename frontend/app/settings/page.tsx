"use client";

import { useState, useMemo } from "react";
import {
  Building2, Layout, AlertCircle, Zap, Plug, Save, RotateCcw,
  ChevronDown, Check, X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import Topbar from "@/components/topbar";
import { buildings, floors } from "@/lib/mock-data";

interface SettingsState {
  buildingName: string;
  timezone: string;
  notificationEmail: string;
  deskNamingFormat: string;
  hotDeskingEnabled: boolean;
  maxReservationHours: string;
  occupancyThreshold: string;
  criticalThreshold: string;
  warningThreshold: string;
  enableAnomalyDetection: boolean;
  alertCooldown: string;
  slackIntegration: boolean;
  microsoftTeamsIntegration: boolean;
  googleCalendarSync: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    buildingName: "HQ Tower A",
    timezone: "America/New_York",
    notificationEmail: "admin@corp.com",
    deskNamingFormat: "Floor-Zone-Number",
    hotDeskingEnabled: true,
    maxReservationHours: "8",
    occupancyThreshold: "85",
    criticalThreshold: "95",
    warningThreshold: "75",
    enableAnomalyDetection: true,
    alertCooldown: "15",
    slackIntegration: true,
    microsoftTeamsIntegration: false,
    googleCalendarSync: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    building: true,
    layout: false,
    occupancy: false,
    alerts: false,
    integrations: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (key: keyof SettingsState, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("[v0] Saving settings:", settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    console.log("[v0] Resetting settings");
    setSettings({
      buildingName: "HQ Tower A",
      timezone: "America/New_York",
      notificationEmail: "admin@corp.com",
      deskNamingFormat: "Floor-Zone-Number",
      hotDeskingEnabled: true,
      maxReservationHours: "8",
      occupancyThreshold: "85",
      criticalThreshold: "95",
      warningThreshold: "75",
      enableAnomalyDetection: true,
      alertCooldown: "15",
      slackIntegration: true,
      microsoftTeamsIntegration: false,
      googleCalendarSync: true,
    });
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Settings" subtitle="Configure system preferences and integrations" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {/* Header with Save/Reset */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Configuration</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your office monitor settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </Button>
          </div>
        </div>

        <Separator className="bg-border my-4" />

        {/* Building Configuration */}
        <Collapsible open={expandedSections.building} onOpenChange={() => toggleSection("building")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[oklch(0.65_0.18_200)]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Building Configuration</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Location and general settings</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.building ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">Building Name</Label>
                  <Input
                    placeholder="e.g., HQ Tower A"
                    value={settings.buildingName}
                    onChange={e => handleInputChange("buildingName", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={v => handleInputChange("timezone", v)}>
                    <SelectTrigger className="h-8 text-xs bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York" className="text-xs">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago" className="text-xs">Central Time</SelectItem>
                      <SelectItem value="America/Denver" className="text-xs">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles" className="text-xs">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London" className="text-xs">GMT</SelectItem>
                      <SelectItem value="Europe/Paris" className="text-xs">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">Notification Email</Label>
                  <Input
                    placeholder="admin@corp.com"
                    type="email"
                    value={settings.notificationEmail}
                    onChange={e => handleInputChange("notificationEmail", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Layout Settings */}
        <Collapsible open={expandedSections.layout} onOpenChange={() => toggleSection("layout")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4 text-[oklch(0.55_0.18_145)]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Layout Settings</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Desk naming and hotdesking policy</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.layout ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Desk Naming Format</Label>
                <Select value={settings.deskNamingFormat} onValueChange={v => handleInputChange("deskNamingFormat", v)}>
                  <SelectTrigger className="h-8 text-xs bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Floor-Zone-Number" className="text-xs">Floor-Zone-Number (F2-North-01)</SelectItem>
                    <SelectItem value="Zone-Number" className="text-xs">Zone-Number (North-001)</SelectItem>
                    <SelectItem value="Numeric-Sequential" className="text-xs">Numeric Sequential (001, 002...)</SelectItem>
                    <SelectItem value="Alphanumeric" className="text-xs">Alphanumeric (A1, A2, B1...)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable Hotdesking</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Allow employees to reserve desks on-demand</p>
                  </div>
                  <Switch
                    checked={settings.hotDeskingEnabled}
                    onCheckedChange={v => handleInputChange("hotDeskingEnabled", v)}
                  />
                </div>

                {settings.hotDeskingEnabled && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Max Reservation Duration (hours)</Label>
                    <Input
                      placeholder="8"
                      type="number"
                      min="1"
                      max="24"
                      value={settings.maxReservationHours}
                      onChange={e => handleInputChange("maxReservationHours", e.target.value)}
                      className="h-8 text-xs bg-secondary border-border"
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Occupancy Rules */}
        <Collapsible open={expandedSections.occupancy} onOpenChange={() => toggleSection("occupancy")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-[oklch(0.7_0.18_85)]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Occupancy Rules</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Define floor capacity thresholds</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.occupancy ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Standard Threshold</Label>
                    <Badge variant="outline" className="text-[10px]">{settings.occupancyThreshold}%</Badge>
                  </div>
                  <Input
                    placeholder="85"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.occupancyThreshold}
                    onChange={e => handleInputChange("occupancyThreshold", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">Standard occupancy alert level</p>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Warning Threshold</Label>
                    <Badge variant="outline" className="text-[10px]">{settings.warningThreshold}%</Badge>
                  </div>
                  <Input
                    placeholder="75"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.warningThreshold}
                    onChange={e => handleInputChange("warningThreshold", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">Triggers warning-level alerts</p>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">Critical Threshold</Label>
                    <Badge variant="outline" className="text-[10px]">{settings.criticalThreshold}%</Badge>
                  </div>
                  <Input
                    placeholder="95"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.criticalThreshold}
                    onChange={e => handleInputChange("criticalThreshold", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">Triggers critical-level alerts</p>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Alert Thresholds */}
        <Collapsible open={expandedSections.alerts} onOpenChange={() => toggleSection("alerts")}>
          <div className="border border-border rounded-lg bg-card">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-[oklch(0.55_0.2_27)]" />
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground">Alert Thresholds</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure alert sensitivity and behavior</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.alerts ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                  <div>
                    <p className="text-sm font-medium text-foreground">Enable Anomaly Detection</p>
                    <p className="text-xs text-muted-foreground mt-0.5">AI-powered detection of unusual patterns</p>
                  </div>
                  <Switch
                    checked={settings.enableAnomalyDetection}
                    onCheckedChange={v => handleInputChange("enableAnomalyDetection", v)}
                  />
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">Alert Cooldown Period (minutes)</Label>
                  <Input
                    placeholder="15"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.alertCooldown}
                    onChange={e => handleInputChange("alertCooldown", e.target.value)}
                    className="h-8 text-xs bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">Minimum time between duplicate alerts</p>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Integrations */}
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
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.integrations ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[oklch(0.4_0.2_280_/_0.3)] flex items-center justify-center">
                      <span className="text-xs font-bold text-[oklch(0.6_0.2_280)]">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Slack</p>
                      <p className="text-xs text-muted-foreground">Send alerts to Slack channels</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={v => handleInputChange("slackIntegration", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[oklch(0.5_0.15_240_/_0.3)] flex items-center justify-center">
                      <span className="text-xs font-bold text-[oklch(0.65_0.18_200)]">MT</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Microsoft Teams</p>
                      <p className="text-xs text-muted-foreground">Send alerts to Teams channels</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.microsoftTeamsIntegration}
                    onCheckedChange={v => handleInputChange("microsoftTeamsIntegration", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.2_30_/_0.3)] flex items-center justify-center">
                      <span className="text-xs font-bold text-[oklch(0.65_0.22_30)]">GC</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Google Calendar</p>
                      <p className="text-xs text-muted-foreground">Sync desk availability with calendars</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.googleCalendarSync}
                    onCheckedChange={v => handleInputChange("googleCalendarSync", v)}
                  />
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="p-3 rounded-lg bg-[oklch(0.65_0.18_200_/_0.1)] border border-[oklch(0.65_0.18_200_/_0.2)]">
                <p className="text-xs text-[oklch(0.55_0.08_200)] leading-relaxed">
                  More integrations coming soon: Asana, Linear, Jira, and custom webhooks.
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Separator className="bg-border my-4" />

        {/* Info section */}
        <Card className="bg-secondary/30 border-border">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Settings are saved automatically after you click "Save Changes". For support or advanced configuration options, contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
