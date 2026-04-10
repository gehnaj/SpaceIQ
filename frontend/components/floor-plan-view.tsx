"use client";

// ─── Floor plan registry ────────────────────────────────────────────────────
// Keyed by "{officeId}/{floorRawKey}" → image path

const FLOOR_PLANS: Record<string, string> = {
  "off-15/1st  Floor": "/floorplans/off-15-floor1.png",
  "off-15/2nd Floor": "/floorplans/off-15-floor2.png",
  "off-15/3rd Floor": "/floorplans/off-15-floor3.png",
  "off-15/4th Floor": "/floorplans/off-15-floor4.png",
  "off-15/5th Floor": "/floorplans/off-15-floor5.png",
  "off-15/6th Floor": "/floorplans/off-15-floor6.png",
};

// ─── Component ──────────────────────────────────────────────────────────────

interface FloorPlanViewProps {
  officeId: string;
  floorRawKey: string;
}

export function FloorPlanView({ officeId, floorRawKey }: FloorPlanViewProps) {
  const image = FLOOR_PLANS[`${officeId}/${floorRawKey}`];
  if (!image) return null;

  return (
    <div className="relative rounded-xl border border-border overflow-hidden bg-[#07070e]">
      <img
        src={image}
        alt={`Floor Plan — ${floorRawKey}`}
        className="w-full h-auto object-contain"
        draggable={false}
      />
    </div>
  );
}

/** Check whether a floor plan image exists for a given office + floor. */
export function hasFloorPlan(officeId: string, floorRawKey: string): boolean {
  return `${officeId}/${floorRawKey}` in FLOOR_PLANS;
}
