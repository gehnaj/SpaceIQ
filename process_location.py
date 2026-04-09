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

import argparse, json, math, os
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
parser.add_argument("--timezone", default="Asia/Kolkata", help="Timezone of the logon data")
args = parser.parse_args()

# ─── Reference time: capture date at 9 AM EST, converted to target tz ────────

capture_date = datetime.strptime(args.date, "%Y-%m-%d")
# Default: 7:30 PM in the target timezone (naive, to compare with Excel timestamps)
NOW = datetime(capture_date.year, capture_date.month, capture_date.day, 19, 30, 0)

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

print(f"OK — {len(records)} records written to {args.output}")
print(f"History — {len(history)} snapshots in {history_path}")
