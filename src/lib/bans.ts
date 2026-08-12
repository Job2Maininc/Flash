import { getRedis, keys } from "./redis";

const BAN_TTL_SEC = 60 * 60 * 24 * 7;
const MAX_IDLE_STRIKES = 3;

export function normalizeNickname(nickname: string): string {
  return nickname.trim().toLowerCase();
}

export async function isNicknameBanned(nickname: string): Promise<boolean> {
  const redis = getRedis();
  const banned = await redis.get<string>(
    keys.banNickname(normalizeNickname(nickname)),
  );
  return Boolean(banned);
}

export async function banNickname(nickname: string): Promise<void> {
  const redis = getRedis();
  await redis.set(keys.banNickname(normalizeNickname(nickname)), "1", {
    ex: BAN_TTL_SEC,
  });
}

export async function getIdleStrikes(userId: string): Promise<number> {
  const redis = getRedis();
  const strikes = await redis.get<number>(keys.idleStrikes(userId));
  return strikes ?? 0;
}

export async function incrementIdleStrike(userId: string): Promise<number> {
  const redis = getRedis();
  const next = await redis.incr(keys.idleStrikes(userId));
  await redis.expire(keys.idleStrikes(userId), BAN_TTL_SEC);
  return next;
}

export async function resetIdleStrikes(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(keys.idleStrikes(userId));
}

export { MAX_IDLE_STRIKES };
