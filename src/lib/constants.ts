/** Shared product constants — never duplicate durations/prices elsewhere. */

export const CALL_DURATION_MS = 5 * 60 * 1000;
export const COUNTDOWN_FROM_MS = 10_000;
export const COUNTDOWN_WARN_MS = 30_000;

export const HEARTS_TO_UNLOCK_MATCH = 3;
export const FIRST_MESSAGE_FREE = true;

export const MAX_MESSAGE_LENGTH = 500;
export const MAX_REPORT_NOTE_LENGTH = 280;

export const REPORT_REASONS = [
  "seemed_underage",
  "harassment",
  "sexual_content",
  "spam",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export function isReportReason(value: unknown): value is ReportReason {
  return (
    typeof value === "string" &&
    (REPORT_REASONS as readonly string[]).includes(value)
  );
}

/** Underage reports pin to the top of the moderation queue. */
export function reportPriority(reason: ReportReason): number {
  return reason === "seemed_underage" ? 100 : 10;
}
