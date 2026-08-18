import { getRedis, keys } from "./redis";

export const ONLINE_WINDOW_MS = 30_000;

export async function pingOnline(visitorId: string): Promise<number> {
  const redis = getRedis();
  const now = Date.now();
  const cutoff = now - ONLINE_WINDOW_MS;
  await redis.zadd(keys.online, { score: now, member: visitorId });
  await redis.zremrangebyscore(keys.online, 0, cutoff);
  const count = await redis.zcard(keys.online);
  return typeof count === "number" ? count : 0;
}

export async function countOnline(): Promise<number> {
  const redis = getRedis();
  const cutoff = Date.now() - ONLINE_WINDOW_MS;
  await redis.zremrangebyscore(keys.online, 0, cutoff);
  const count = await redis.zcard(keys.online);
  return typeof count === "number" ? count : 0;
}
