import pandas as pd
from datetime import datetime

# --- Config ---
ATHENA_FILE = "data/Athena Inventory - 07 April 2026.xlsx"
LOGON_FILE = "data/CommonCurrentlyComputerLogonView.xlsx"
OUTPUT_FILE = "output/Athena_Seat_Utilization.xlsx"
# 7:30 PM IST on April 8, 2026 (naive, to compare with Excel timestamps)
NOW = datetime(2026, 4, 8, 19, 30, 0)

# --- Read files ---
df_athena = pd.read_excel(ATHENA_FILE)
df_logon = pd.read_excel(LOGON_FILE)

# Normalize the join key
df_athena["Computer Name"] = df_athena["Computer Name"].astype(str).str.strip().str.upper()
df_logon["Computer Name"] = df_logon["Computer Name"].astype(str).str.strip().str.upper()

# --- Merge on Computer Name ---
df = df_athena.merge(df_logon, on="Computer Name", how="left")

# --- Add Building column ---
df.insert(0, "Building", "ATHENA")

# --- Parse datetime columns ---
df["Logon Time"] = pd.to_datetime(df["Logon Time"], format="mixed", errors="coerce")
df["Logoff Time"] = pd.to_datetime(df["Logoff Time"], format="mixed", errors="coerce")

# --- Status: "Logged In" if logoff is missing, "Offline" if logged off, blank if no logon at all ---
def get_status(row):
    if pd.isna(row["Logon Time"]):
        return ""
    if pd.isna(row["Logoff Time"]):
        return "Logged In"
    return "Offline"

df["Status"] = df.apply(get_status, axis=1)

# --- Since: duration from the relevant time until now ---
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

# --- Reorder columns ---
columns = [
    "Building",
    "Floor",
    "Deskno",
    "Computer Name",
    "Serial Number",
    "Asset Type",
    "Model",
    "Domain Name",
    "Logon User Name",
    "User Logon Count",
    "Logon Time",
    "Logoff Time",
    "Status",
    "Since",
]
df = df[[c for c in columns if c in df.columns]]

# --- Compute sinceMinutes for frontend color logic ---
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

# --- Write output ---
import os, json
os.makedirs("output", exist_ok=True)
df.to_excel(OUTPUT_FILE, index=False, sheet_name="Athena Utilization")

# --- Also write JSON for the frontend ---
json_df = df.copy()
json_df["Logon Time"] = json_df["Logon Time"].astype(str).replace("NaT", "")
json_df["Logoff Time"] = json_df["Logoff Time"].astype(str).replace("NaT", "")

# Convert to records and scrub NaN → None for valid JSON
import math
records = json_df.to_dict(orient="records")
for rec in records:
    for k, v in rec.items():
        if isinstance(v, float) and math.isnan(v):
            rec[k] = None
        elif v == "NaT" or v == "nan":
            rec[k] = None

json_path = os.path.join("frontend", "lib", "athena-seat-data.json")
os.makedirs(os.path.dirname(json_path), exist_ok=True)
with open(json_path, "w") as f:
    json.dump(records, f, indent=2)

print(f"Done — {len(df)} rows written to {OUTPUT_FILE}")
print(f"JSON — {len(records)} records written to {json_path}")
print(df.head(10).to_string(index=False))
