import { HouseAdContent } from "./HouseAdContent";
import type { AdFormat } from "./HouseAdContent";

export type { AdFormat };

/**
 * Positional slot for advertising. Currently renders house ads (HouseAdContent).
 *
 * To integrate AdSense / Taboola:
 *   1. Replace the HouseAdContent block below with the ad network's snippet.
 *   2. Keep the outer <div data-ad-slot> intact — it marks the position in the layout.
 */
export function AdSlot({
  format,
  className = "",
}: {
  format: AdFormat;
  className?: string;
}) {
  return (
    <div data-ad-slot={format} className={className}>
      {/* House ad — swap this block for AdSense/Taboola when ready */}
      <HouseAdContent format={format} />
    </div>
  );
}
