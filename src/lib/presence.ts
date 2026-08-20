import { pingOnline } from "./online";
import { getRedis, keys } from "./redis";

export const PRESENCE_TTL_SEC = 30;
/** Queue / pairing: drop peers that stop heartbeating. */
export const STALE_PEER_MS = 8_000;
/**
 * Active/matched calls: allow a wider gap so a single delayed heartbeat
 * (tab jank, network) does not end the call. Still below PRESENCE_TTL.
 */
export const STALE_IN_CALL_MS = 25_000;

export async function touchPresence(userId: string): Promise<void> {
  const redis = getRedis();
  const now = Date.now();
  await redis.set(keys.lastSeen(userId), now, { ex: PRESENCE_TTL_SEC });
  await redis.set(keys.inBrowse(userId), "1", { ex: PRESENCE_TTL_SEC });
  try {
    await pingOnline(userId);
  } catch {
    // Online count is best-effort and must not block matching.
  }
}

export async function clearPresence(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(keys.lastSeen(userId));
  await redis.del(keys.inBrowse(userId));
}

export async function getLastSeen(userId: string): Promise<number | null> {
  const redis = getRedis();
  const value = await redis.get<number | string>(keys.lastSeen(userId));
  if (value == null) return null;
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

export async function isUserStale(
  userId: string,
  maxAgeMs: number = STALE_PEER_MS,
): Promise<boolean> {
  const lastSeen = await getLastSeen(userId);
  if (!lastSeen) return true;
  return Date.now() - lastSeen > maxAgeMs;
}
