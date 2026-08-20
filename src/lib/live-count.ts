/** Shared live-presence display rules (marketing + join). */
export const LIVE_COUNT_THRESHOLD = 5;

export function shouldShowLiveCount(count: number | null | undefined): boolean {
  return typeof count === "number" && count >= LIVE_COUNT_THRESHOLD;
}
