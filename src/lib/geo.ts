import type { Guest, GlobalMode, MeetScope } from "./types";

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
  const code = raw.trim().toUpperCase();
  if (!code || code === "XX" || code === "T1" || code === "ZZ") return null;
  return code.slice(0, 2);
}

function effectiveScope(guest: Guest): MeetScope {
  return guest.meetScope ?? "random";
}

function isWorldwide(guest: Guest): boolean {
  const scope = effectiveScope(guest);
  return scope === "random" || scope === "global";
}

/** Reciprocal location preference. Local-only guests stay in-country. */
export function areGuestsGeoCompatible(a: Guest, b: Guest): boolean {
  if (isWorldwide(a) && isWorldwide(b)) return true;

  if (effectiveScope(a) === "local" && effectiveScope(b) === "local") {
    if (!a.country || !b.country) return true;
    return a.country === b.country;
  }

  return false;
}
