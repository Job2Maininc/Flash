import { getRedis, keys } from "./redis";

export const PRESENCE_TTL_SEC = 90;
export const STALE_PEER_MS = 45_000;

export async function touchPresence(userId: string): Promise<void> {
  const redis = getRedis();
  const now = Date.now();
  await redis.set(keys.lastSeen(userId), now, { ex: PRESENCE_TTL_SEC });
  await redis.set(keys.inBrowse(userId), "1", { ex: PRESENCE_TTL_SEC });
}

export async function clearPresence(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(keys.lastSeen(userId));
  await redis.del(keys.inBrowse(userId));
}

export async function getLastSeen(userId: string): Promise<number | null> {
  const redis = getRedis();
  const value = await redis.get<number>(keys.lastSeen(userId));
  return value ?? null;
}

export async function isUserStale(userId: string): Promise<boolean> {
  const lastSeen = await getLastSeen(userId);
  if (!lastSeen) return true;
  return Date.now() - lastSeen > STALE_PEER_MS;
}
