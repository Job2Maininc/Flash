import type { Guest, GlobalMode, MeetScope } from "./types";
import { normalizeCountryCode } from "./countries";

export const MEET_SCOPES = ["local", "global", "random"] as const;

export const GLOBAL_MODES = ["all", "random"] as const;

export function isMeetScope(value: unknown): value is MeetScope {
  return value === "local" || value === "global" || value === "random";
}

export function isGlobalMode(value: unknown): value is GlobalMode {
  return value === "all" || value === "random";
}

export function readCountryFromHeaders(headers: Headers): string | null {
  const raw =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code");
  if (!raw) return null;
  return normalizeCountryCode(raw);
}

function effectiveScope(guest: Guest): MeetScope {
  return guest.meetScope ?? "random";
}

/**
 * Country this guest wants to meet people from:
 * - local → their IP country
 * - global → preferredCountry (chosen from the full list)
 * - random → none (worldwide)
 */
export function targetCountry(guest: Guest): string | null {
  const scope = effectiveScope(guest);
  if (scope === "local") return guest.country ?? null;
  if (scope === "global") return guest.preferredCountry ?? null;
  return null;
}

/** Reciprocal location preference. */
export function areGuestsGeoCompatible(a: Guest, b: Guest): boolean {
  const wantA = targetCountry(a);
  const wantB = targetCountry(b);

  // A asks for a country → B must be there (if we know B's geo).
  if (wantA && b.country && b.country !== wantA) return false;
  // B asks for a country → A must be there (if we know A's geo).
  if (wantB && a.country && a.country !== wantB) return false;

  return true;
}
