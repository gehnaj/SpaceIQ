"""
Generic seat-utilization merge script.
Called by the Next.js API route after file uploads.

Usage:
  python process_location.py \
    --inventory "uploads/off-15/inventory.xlsx" \
    --logon     "uploads/off-15/logon.xlsx" \
    --date      "2026-04-08" \
    --location  "off-15" \
    --output    "processed/off-15/seat-data.json"
"""

import argparse, json, math, os, urllib.request
import pandas as pd
from datetime import datetime
from zoneinfo import ZoneInfo

# ─── CLI ──────────────────────────────────────────────────────────────────────

parser = argparse.ArgumentParser()
parser.add_argument("--inventory", required=True, help="Path to physical inventory Excel")
parser.add_argument("--logon", required=True, help="Path to logon view Excel")
parser.add_argument("--date", required=True, help="Date the logon sheet was captured (YYYY-MM-DD)")
parser.add_argument("--location", required=True, help="Location ID (e.g. off-15)")
parser.add_argument("--output", required=True, help="Output JSON path")
parser.add_argument("--time", default="19:30", help="Time the logon sheet was captured (HH:MM, 24h)")
parser.add_argument("--location-name", default="", help="Human-readable location name")
parser.add_argument("--timezone", default="Asia/Kolkata", help="Timezone of the logon data")
args = parser.parse_args()

# ─── Reference time: capture date at the specified time ─────────────────────

capture_date = datetime.strptime(args.date, "%Y-%m-%d")
h, m = (int(x) for x in args.time.split(":"))
NOW = datetime(capture_date.year, capture_date.month, capture_date.day, h, m, 0)

# ─── Read and merge ──────────────────────────────────────────────────────────

df_inv = pd.read_excel(args.inventory)
df_logon = pd.read_excel(args.logon)

df_inv["Computer Name"] = df_inv["Computer Name"].astype(str).str.strip().str.upper()
df_logon["Computer Name"] = df_logon["Computer Name"].astype(str).str.strip().str.upper()

df = df_inv.merge(df_logon, on="Computer Name", how="left")

# ─── Parse datetimes ─────────────────────────────────────────────────────────

df["Logon Time"] = pd.to_datetime(df["Logon Time"], format="mixed", errors="coerce")
df["Logoff Time"] = pd.to_datetime(df["Logoff Time"], format="mixed", errors="coerce")

# ─── Status ──────────────────────────────────────────────────────────────────

def get_status(row):
    if pd.isna(row["Logon Time"]):
        return ""
    if pd.isna(row["Logoff Time"]):
        return "Logged In"
    return "Offline"

df["Status"] = df.apply(get_status, axis=1)

# ─── Since (human-readable) ─────────────────────────────────────────────────

def get_since(row):
    if row["Status"] == "Logged In":
        ref = row["Logon Time"]
    elif row["Status"] == "Offline":
        ref = row["Logoff Time"]
    else:
        return ""
    if pd.isna(ref):
        return ""
    delta = NOW - ref
    days = delta.days
    hours, remainder = divmod(delta.seconds, 3600)
    minutes = remainder // 60
    parts = []
    if days:
        parts.append(f"{days}d")
    if hours:
        parts.append(f"{hours}h")
    parts.append(f"{minutes}m")
    return " ".join(parts)

df["Since"] = df.apply(get_since, axis=1)

# ─── sinceMinutes (for frontend color logic) ────────────────────────────────

def get_since_minutes(row):
    if row["Status"] == "Logged In":
        ref = row["Logon Time"]
    elif row["Status"] == "Offline":
        ref = row["Logoff Time"]
    else:
        return None
    if pd.isna(ref):
        return None
    delta = NOW - ref
    return int(delta.total_seconds() / 60)

df["sinceMinutes"] = df.apply(get_since_minutes, axis=1)

# ─── Select columns ─────────────────────────────────────────────────────────

columns = [
    "Floor", "Deskno", "Computer Name", "Serial Number",
    "Asset Type", "Model", "Domain Name",
    "Logon User Name", "User Logon Count",
    "Logon Time", "Logoff Time", "Status", "Since", "sinceMinutes",
]
df = df[[c for c in columns if c in df.columns]]

# ─── Convert to JSON-safe records ───────────────────────────────────────────

json_df = df.copy()
json_df["Logon Time"] = json_df["Logon Time"].astype(str).replace("NaT", "")
json_df["Logoff Time"] = json_df["Logoff Time"].astype(str).replace("NaT", "")

records = json_df.to_dict(orient="records")
for rec in records:
    for k, v in rec.items():
        if isinstance(v, float) and math.isnan(v):
            rec[k] = None
        elif v == "NaT" or v == "nan":
            rec[k] = None

# ─── Write output ───────────────────────────────────────────────────────────

os.makedirs(os.path.dirname(args.output), exist_ok=True)
with open(args.output, "w") as f:
    json.dump(records, f, indent=2)

# ─── Append snapshot to history ─────────────────────────────────────────────

physical = [r for r in records if r.get("Floor") and r["Floor"] != "WFH"]
logged_in = [r for r in physical if r.get("Status") == "Logged In"]
offline = [r for r in physical if r.get("Status") == "Offline"]
empty = [r for r in physical if not r.get("Status")]

# Per-floor breakdown
floor_keys = sorted(set(r["Floor"] for r in physical))
floors_summary = []
for fk in floor_keys:
    floor_recs = [r for r in physical if r["Floor"] == fk]
    fl_busy = sum(1 for r in floor_recs if r.get("Status") == "Logged In")
    floors_summary.append({
        "floor": fk,
        "total": len(floor_recs),
        "busy": fl_busy,
        "free": len(floor_recs) - fl_busy,
        "occupancy": round(fl_busy / len(floor_recs) * 100) if floor_recs else 0,
    })

# Per asset-type breakdown
def normalize_asset(val):
    s = (val or "Unknown").strip()
    if s.upper() == "AIO":
        return "AIO"
    return s.capitalize()

asset_counts = {}
for r in physical:
    at = normalize_asset(r.get("Asset Type"))
    if at not in asset_counts:
        asset_counts[at] = {"total": 0, "busy": 0}
    asset_counts[at]["total"] += 1
    if r.get("Status") == "Logged In":
        asset_counts[at]["busy"] += 1

asset_summary = [{"type": k, "total": v["total"], "busy": v["busy"]} for k, v in sorted(asset_counts.items())]

snapshot = {
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "captureDate": args.date,
    "referenceTime": NOW.isoformat(),
    "location": args.location,
    "totalDesks": len(physical),
    "busy": len(logged_in),
    "offline": len(offline),
    "free": len(empty),
    "occupancyRate": round(len(logged_in) / len(physical) * 100, 1) if physical else 0,
    "floors": floors_summary,
    "assetTypes": asset_summary,
}

history_path = os.path.join(os.path.dirname(args.output), "history.json")
history = []
if os.path.exists(history_path):
    with open(history_path) as f:
        try:
            history = json.load(f)
        except json.JSONDecodeError:
            history = []

history.append(snapshot)

with open(history_path, "w") as f:
    json.dump(history, f, indent=2)

# ─── Generate alerts ───────────────────────────────────────────────────────

processed_dir = os.path.dirname(os.path.dirname(args.output))  # processed/
alerts_path = os.path.join(processed_dir, "alerts.json")
settings_path = os.path.join(processed_dir, "settings.json")

# Read thresholds
thresholds = {"critical": 95, "standard": 85, "warning": 75,
              "offline_warn_pct": 20, "offline_crit_pct": 30,
              "idle_minutes": 1440, "idle_count": 10}
if os.path.exists(settings_path):
    with open(settings_path) as f:
        try:
            thresholds.update(json.load(f))
        except json.JSONDecodeError:
            pass

loc_id = args.location
loc_name = getattr(args, "location_name", "") or args.location
ts = datetime.utcnow().isoformat() + "Z"
new_alerts = []

def make_alert(atype, severity, floor, message, detail, action, metric=None):
    floor_slug = (floor or "location").replace(" ", "-").lower()
    aid = f"alert-{loc_id}-{args.date}-{atype}-{floor_slug}"
    new_alerts.append({
        "id": aid, "type": atype, "severity": severity,
        "locationId": loc_id, "locationName": loc_name,
        "floor": floor, "message": message, "detail": detail,
        "recommendedAction": action, "createdAt": ts,
        "captureDate": args.date, "resolved": False,
        "metric": metric,
    })

# --- Location-level occupancy ---
occ = snapshot["occupancyRate"]
if occ >= thresholds["critical"]:
    make_alert("occupancy_threshold", "critical", None,
               f"{loc_name} occupancy at {occ}% — critical",
               f"Overall occupancy is {occ}% ({snapshot['busy']}/{snapshot['totalDesks']} desks). This exceeds the {thresholds['critical']}% critical threshold.",
               "Immediately review space allocation. Consider redirecting employees to less crowded locations.", occ)
elif occ >= thresholds["standard"]:
    make_alert("occupancy_threshold", "warning", None,
               f"{loc_name} occupancy at {occ}% — high",
               f"Overall occupancy is {occ}% ({snapshot['busy']}/{snapshot['totalDesks']} desks). This exceeds the {thresholds['standard']}% standard threshold.",
               "Monitor closely. Prepare overflow plans if occupancy continues rising.", occ)
elif occ >= thresholds["warning"]:
    make_alert("occupancy_threshold", "info", None,
               f"{loc_name} occupancy at {occ}% — elevated",
               f"Overall occupancy is {occ}% ({snapshot['busy']}/{snapshot['totalDesks']} desks). Approaching the {thresholds['standard']}% threshold.",
               "No immediate action required. Continue monitoring.", occ)

# --- Per-floor analysis ---
for fl in floors_summary:
    fname = fl["floor"]
    ft = fl["total"]
    fb = fl["busy"]
    fo = fl["occupancy"]

    if ft < 5:
        continue  # skip very small floors

    # Floor occupancy thresholds
    if fo >= thresholds["critical"]:
        make_alert("occupancy_threshold", "critical", fname,
                   f"{fname} at {fo}% occupancy — critical",
                   f"{fname} has {fb}/{ft} desks occupied ({fo}%). Exceeds {thresholds['critical']}% critical threshold.",
                   f"Redirect new arrivals from {fname}. Alert facilities team.", fo)
    elif fo >= thresholds["standard"]:
        make_alert("occupancy_threshold", "warning", fname,
                   f"{fname} at {fo}% occupancy — high",
                   f"{fname} has {fb}/{ft} desks occupied ({fo}%). Exceeds {thresholds['standard']}% standard threshold.",
                   f"Monitor {fname}. Prepare overflow if it continues rising.", fo)

    # Zero utilization floor
    if fo == 0 and ft > 0:
        make_alert("zone_inactive", "info", fname,
                   f"{fname} has zero utilization",
                   f"{fname} has {ft} desks but none are occupied. The entire floor appears inactive.",
                   f"Check if {fname} is expected to be empty. Verify with local team.", 0)

    # Per-floor offline count
    fl_offline = sum(1 for r in physical if r["Floor"] == fname and r.get("Status") == "Offline")
    if ft > 0:
        offline_pct = round(fl_offline / ft * 100)
        if offline_pct >= thresholds["offline_crit_pct"]:
            make_alert("desks_offline", "critical", fname,
                       f"{fl_offline} desks offline on {fname} ({offline_pct}%)",
                       f"{fl_offline} of {ft} desks on {fname} are in Offline status. This is {offline_pct}% of the floor.",
                       f"Investigate network or hardware issues on {fname}. Dispatch IT.", offline_pct)
        elif offline_pct >= thresholds["offline_warn_pct"]:
            make_alert("desks_offline", "warning", fname,
                       f"{fl_offline} desks offline on {fname} ({offline_pct}%)",
                       f"{fl_offline} of {ft} desks on {fname} are in Offline status.",
                       f"Monitor {fname} for connectivity issues.", offline_pct)

    # Long idle desks (offline for > 24 hours)
    fl_idle = sum(1 for r in physical
                  if r["Floor"] == fname
                  and r.get("Status") == "Offline"
                  and r.get("sinceMinutes") is not None
                  and r["sinceMinutes"] > thresholds["idle_minutes"])
    if fl_idle >= thresholds["idle_count"]:
        make_alert("idle_desks", "info", fname,
                   f"{fl_idle} desks idle 24h+ on {fname}",
                   f"{fl_idle} desks on {fname} have been offline for more than 24 hours. These may be abandoned or have hardware issues.",
                   f"Review these desks for possible reassignment or hardware check.", fl_idle)

# --- Write alerts (remove stale alerts for same location+date, then append) ---
existing_alerts = []
if os.path.exists(alerts_path):
    with open(alerts_path) as f:
        try:
            existing_alerts = json.load(f)
        except json.JSONDecodeError:
            existing_alerts = []

# Remove old alerts for this location+captureDate (idempotent re-processing)
existing_alerts = [a for a in existing_alerts
                   if not (a.get("locationId") == loc_id and a.get("captureDate") == args.date)]
existing_alerts.extend(new_alerts)

with open(alerts_path, "w") as f:
    json.dump(existing_alerts, f, indent=2)

# ─── Send critical/warning alerts to Microsoft Teams ───────────────────────

teams_enabled = thresholds.get("teams_enabled", False)
teams_url = thresholds.get("teams_webhook_url", "").strip()

if teams_enabled and teams_url and new_alerts:
    urgent = [a for a in new_alerts if a["severity"] in ("critical", "warning")]
    if urgent:
        severity_emoji = {"critical": "\U0001F534", "warning": "\U0001F7E1"}

        # Build Adaptive Card body
        body = [
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "bolder",
                "text": f"SpaceIQ Alert — {loc_name}",
                "wrap": True,
            },
            {
                "type": "TextBlock",
                "text": f"{len(urgent)} warning/critical alert(s) from data captured {args.date} {args.time}",
                "isSubtle": True,
                "spacing": "none",
                "wrap": True,
            },
        ]

        for a in urgent:
            emoji = severity_emoji.get(a["severity"], "")
            floor_text = f" — {a['floor']}" if a.get("floor") else ""
            body.append({"type": "ColumnSet", "separator": True, "spacing": "medium", "columns": [
                {"type": "Column", "width": "auto", "items": [
                    {"type": "TextBlock", "text": emoji, "size": "medium"}
                ]},
                {"type": "Column", "width": "stretch", "items": [
                    {"type": "TextBlock", "text": f"**{a['severity'].upper()}**: {a['message']}", "wrap": True, "weight": "bolder", "size": "small"},
                    {"type": "TextBlock", "text": f"{a['locationName']}{floor_text}", "isSubtle": True, "spacing": "none", "size": "small", "wrap": True},
                    {"type": "TextBlock", "text": a["detail"], "wrap": True, "size": "small", "spacing": "small"},
                    {"type": "TextBlock", "text": f"Action: {a['recommendedAction']}", "wrap": True, "size": "small", "isSubtle": True, "spacing": "none"},
                ]},
            ]})

        payload = {
            "type": "message",
            "attachments": [{
                "contentType": "application/vnd.microsoft.card.adaptive",
                "contentUrl": None,
                "content": {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.4",
                    "body": body,
                },
            }],
        }

        try:
            req = urllib.request.Request(
                teams_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                resp_body = resp.read().decode("utf-8", errors="replace")
                print(f"Teams — notification sent ({resp.status}: {resp_body[:100]})")
        except Exception as e:
            print(f"Teams — failed to send: {e}")

print(f"OK — {len(records)} records written to {args.output}")
print(f"History — {len(history)} snapshots in {history_path}")
print(f"Alerts — {len(new_alerts)} new alerts generated ({len(existing_alerts)} total)")
